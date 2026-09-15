/**
 * Robust Multi-Layer Canvas Handwriting Storage
 *
 * Prevents DOMException: QuotaExceededError by keeping an in-memory Map
 * that instantly bridges Next.js client-side route transitions (SPA push),
 * with fallback to window global and localStorage/sessionStorage.
 */

const memoryCanvasMap = new Map<string, string>()
const memoryStrokesMap = new Map<string, any[]>()

export function savePrescriptionCanvas(patientId: string, dataUrl: string | null, strokes?: any[]): void {
  if (!patientId) return

  if (!dataUrl) {
    memoryCanvasMap.delete(patientId)
    memoryStrokesMap.delete(patientId)
    if (typeof window !== 'undefined') {
      try {
        delete (window as any).__RX_CANVAS_DATA__?.[patientId]
        sessionStorage.removeItem(`rx_canvas_${patientId}`)
        localStorage.removeItem(`rx_canvas_${patientId}`)
        localStorage.removeItem(`rx_strokes_${patientId}`)
      } catch {}
    }
    return
  }

  // 1. In-memory Map (zero size limits, zero quota errors, instant sync across SPA routes)
  memoryCanvasMap.set(patientId, dataUrl)
  if (strokes) {
    memoryStrokesMap.set(patientId, strokes)
  }

  // 2. Window object attachment
  if (typeof window !== 'undefined') {
    try {
      ;(window as any).__RX_CANVAS_DATA__ = (window as any).__RX_CANVAS_DATA__ || {}
      ;(window as any).__RX_CANVAS_DATA__[patientId] = dataUrl
      if (strokes) {
        ;(window as any).__RX_STROKES_DATA__ = (window as any).__RX_STROKES_DATA__ || {}
        ;(window as any).__RX_STROKES_DATA__[patientId] = strokes
      }
    } catch {}

    // 3. Web Storage with quota safety
    try {
      sessionStorage.setItem(`rx_canvas_${patientId}`, dataUrl)
    } catch {
      // Ignore quota exceeded
    }

    try {
      localStorage.setItem(`rx_canvas_${patientId}`, dataUrl)
      if (strokes && strokes.length > 0) {
        localStorage.setItem(`rx_strokes_${patientId}`, JSON.stringify(strokes))
      }
    } catch {
      // Ignore quota exceeded
    }
  }
}

export function getPrescriptionCanvas(patientId: string): string | null {
  if (!patientId) return null

  // 1. Check in-memory map first
  const inMem = memoryCanvasMap.get(patientId)
  if (inMem) return inMem

  // 2. Check window object
  if (typeof window !== 'undefined') {
    const onWindow = (window as any).__RX_CANVAS_DATA__?.[patientId]
    if (onWindow) {
      memoryCanvasMap.set(patientId, onWindow)
      return onWindow
    }

    // 3. Check sessionStorage
    try {
      const fromSession = sessionStorage.getItem(`rx_canvas_${patientId}`)
      if (fromSession) {
        memoryCanvasMap.set(patientId, fromSession)
        return fromSession
      }
    } catch {}

    // 4. Check localStorage
    try {
      const fromLocal = localStorage.getItem(`rx_canvas_${patientId}`)
      if (fromLocal) {
        memoryCanvasMap.set(patientId, fromLocal)
        return fromLocal
      }
    } catch {}
  }

  return null
}

export function getPrescriptionStrokes(patientId: string): any[] | null {
  if (!patientId) return null

  const inMem = memoryStrokesMap.get(patientId)
  if (inMem) return inMem

  if (typeof window !== 'undefined') {
    const onWindow = (window as any).__RX_STROKES_DATA__?.[patientId]
    if (onWindow) return onWindow

    try {
      const raw = localStorage.getItem(`rx_strokes_${patientId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          memoryStrokesMap.set(patientId, parsed)
          return parsed
        }
      }
    } catch {}
  }

  return null
}
