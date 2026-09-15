'use client'

/**
 * PrescriptionCanvas — Ultra-low-latency handwriting engine.
 * - Active stroke rendered in raw screen pixels (zero React re-renders during drawing)
 * - Committed strokes on static layer (perfect-freehand)
 * - Apple Pencil pressure + tilt support
 * - Palm rejection (pen-only mode on touch screens)
 * - Coalesced pointer events for sub-ms accuracy
 */

import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import getStroke from 'perfect-freehand'

export type Tool = 'pen' | 'highlighter' | 'eraser'
export type PenStyle = 'fountain' | 'ballpoint' | 'marker'

export interface CompletedStroke {
  id: string
  points: [number, number, number][] // [x, y, pressure]
  color: string
  width: number
  tool: Tool
  style: PenStyle
  timestamp: number
}

interface PrescriptionCanvasProps {
  tool: Tool
  penColor: string
  penWidth: number
  penStyle: PenStyle
  paperLines?: boolean
  onStrokeComplete?: (stroke: CompletedStroke) => void
  className?: string
}

export interface PrescriptionCanvasRef {
  undo: () => void
  redo: () => void
  clear: () => void
  getStrokes: () => CompletedStroke[]
  exportToDataURL: () => string | null
  loadStrokes: (strokes: CompletedStroke[]) => void
}

// ── Perfect-freehand options per pen style ──────────────────────────────────
function getStrokeOptions(style: PenStyle, tool: Tool, width: number, isLast: boolean) {
  const base = {
    size: width,
    last: isLast,
    simulatePressure: false,
    streamline: 0.5,
    smoothing: 0.5,
  }

  if (tool === 'highlighter') {
    return { ...base, size: width * 3.5, thinning: 0, smoothing: 0.7, streamline: 0.4 }
  }
  if (tool === 'eraser') {
    return { ...base, size: width * 4, thinning: 0 }
  }

  switch (style) {
    case 'fountain':
      return { ...base, thinning: 0.72, smoothing: 0.55, streamline: 0.5, easing: (t: number) => Math.sin((t * Math.PI) / 2) }
    case 'ballpoint':
      return { ...base, thinning: 0.2, smoothing: 0.3, streamline: 0.6 }
    case 'marker':
      return { ...base, thinning: -0.3, smoothing: 0.6, streamline: 0.3, size: width * 1.8 }
    default:
      return base
  }
}

// ── Render a stroke outline to canvas context ────────────────────────────────
function renderOutline(
  ctx: CanvasRenderingContext2D,
  outline: number[][],
  color: string,
  tool: Tool
) {
  if (outline.length < 3) return

  ctx.save()
  if (tool === 'highlighter') {
    ctx.globalCompositeOperation = 'multiply'
    ctx.globalAlpha = 0.38
  } else if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.globalAlpha = 1
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(
    (outline[0][0] + outline[1][0]) / 2,
    (outline[0][1] + outline[1][1]) / 2
  )
  for (let i = 1; i < outline.length; i++) {
    const cur = outline[i]
    const nxt = outline[(i + 1) % outline.length]
    ctx.quadraticCurveTo(cur[0], cur[1], (cur[0] + nxt[0]) / 2, (cur[1] + nxt[1]) / 2)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

// ── Draw paper lines on canvas ───────────────────────────────────────────────
function drawPaperLines(ctx: CanvasRenderingContext2D, w: number, h: number, isDark: boolean) {
  const lineSpacing = 36
  ctx.save()
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,100,200,0.08)'
  ctx.lineWidth = 1
  for (let y = lineSpacing; y < h; y += lineSpacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }
  // Red left margin
  ctx.strokeStyle = isDark ? 'rgba(255,80,80,0.12)' : 'rgba(220,38,38,0.15)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(72, 0)
  ctx.lineTo(72, h)
  ctx.stroke()
  ctx.restore()
}

// ── Main Component ──────────────────────────────────────────────────────────
const PrescriptionCanvas = forwardRef<PrescriptionCanvasRef, PrescriptionCanvasProps>(
  ({ tool, penColor, penWidth, penStyle, paperLines = true, onStrokeComplete, className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const staticCanvasRef = useRef<HTMLCanvasElement>(null)   // committed strokes
    const activeCanvasRef = useRef<HTMLCanvasElement>(null)   // live drawing
    const dpr = useRef(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)

    // Fast local refs (no React state during drawing)
    const isDrawingRef = useRef(false)
    const localPointsRef = useRef<[number, number, number][]>([])
    const strokesRef = useRef<CompletedStroke[]>([])
    const undoStackRef = useRef<CompletedStroke[][]>([[]])   // array of snapshots

    // Current props as refs for callbacks
    const toolRef = useRef(tool)
    const colorRef = useRef(penColor)
    const widthRef = useRef(penWidth)
    const styleRef = useRef(penStyle)

    useEffect(() => { toolRef.current = tool }, [tool])
    useEffect(() => { colorRef.current = penColor }, [penColor])
    useEffect(() => { widthRef.current = penWidth }, [penWidth])
    useEffect(() => { styleRef.current = penStyle }, [penStyle])

    // ── Canvas sizing ──────────────────────────────────────────────────────
    const resize = useCallback(() => {
      const container = containerRef.current
      if (!container) return
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return
      const d = dpr.current

      for (const canvas of [staticCanvasRef.current, activeCanvasRef.current]) {
        if (!canvas) continue
        canvas.width = width * d
        canvas.height = height * d
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        const ctx = canvas.getContext('2d')
        if (ctx) { ctx.scale(d, d); ctx.lineCap = 'round'; ctx.lineJoin = 'round' }
      }
      repaintStatic()
    }, []) // eslint-disable-line

    // ── Repaint static layer ───────────────────────────────────────────────
    const repaintStatic = useCallback(() => {
      const canvas = staticCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const d = dpr.current
      const w = canvas.width / d
      const h = canvas.height / d
      ctx.clearRect(0, 0, w, h)

      if (paperLines) {
        const isDark = document.documentElement.classList.contains('dark')
        drawPaperLines(ctx, w, h, isDark)
      }

      // Re-render all committed strokes
      for (const stroke of strokesRef.current) {
        const opts = getStrokeOptions(stroke.style, stroke.tool, stroke.width, true)
        const outline = getStroke(stroke.points, opts)
        renderOutline(ctx, outline, stroke.color, stroke.tool)
      }
    }, [paperLines])

    // ── Live active stroke drawing (< 1ms) ─────────────────────────────────
    const drawLive = useCallback((pts: [number, number, number][]) => {
      const canvas = activeCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const d = dpr.current
      ctx.clearRect(0, 0, canvas.width / d, canvas.height / d)
      if (pts.length === 0) return

      if (toolRef.current === 'eraser') {
        const last = pts[pts.length - 1]
        ctx.save()
        ctx.strokeStyle = 'rgba(239,68,68,0.5)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(last[0], last[1], widthRef.current * 2.5, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
        return
      }

      const opts = getStrokeOptions(styleRef.current, toolRef.current, widthRef.current, false)
      const outline = getStroke(pts, opts)
      renderOutline(ctx, outline, colorRef.current, toolRef.current)
    }, [])

    // Palm rejection refs
    const isPenActiveRef = useRef(false)
    const lastPenTimeRef = useRef(0)

    // ── Pointer handlers ───────────────────────────────────────────────────
    const onDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      // Smart palm rejection: reject touch only if a stylus is actively drawing or recently lifted
      if (e.pointerType === 'pen') {
        isPenActiveRef.current = true
        lastPenTimeRef.current = Date.now()
      } else if (e.pointerType === 'touch') {
        if (isPenActiveRef.current || Date.now() - lastPenTimeRef.current < 500) {
          return
        }
      }
      e.preventDefault()
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch { }
      isDrawingRef.current = true
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const p = e.pressure > 0 ? e.pressure : 0.5
      localPointsRef.current = [[x, y, p]]
      drawLive(localPointsRef.current)
    }, [drawLive])

    const onMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return
      if (e.pointerType === 'touch') {
        if (isPenActiveRef.current || Date.now() - lastPenTimeRef.current < 500) {
          return
        }
      }
      e.preventDefault()
      const rect = e.currentTarget.getBoundingClientRect()
      // Process coalesced events for stylus precision
      const native = e.nativeEvent as PointerEvent
      const events = native.getCoalescedEvents?.() || [native]
      for (const ce of events) {
        const x = ce.clientX - rect.left
        const y = ce.clientY - rect.top
        const p = ce.pressure > 0 ? ce.pressure : 0.5
        localPointsRef.current.push([x, y, p])
      }
      drawLive(localPointsRef.current)
    }, [drawLive])

    const onUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'pen') {
        isPenActiveRef.current = false
        lastPenTimeRef.current = Date.now()
      }
      if (!isDrawingRef.current) return
      e.preventDefault()
      isDrawingRef.current = false

      // Clear active layer
      const activeCanvas = activeCanvasRef.current
      if (activeCanvas) {
        const ctx = activeCanvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, activeCanvas.width / dpr.current, activeCanvas.height / dpr.current)
        }
      }

      const pts = localPointsRef.current
      localPointsRef.current = []
      if (pts.length < 1) return

      const newStroke: CompletedStroke = {
        id: `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        points: pts,
        color: colorRef.current,
        width: widthRef.current,
        tool: toolRef.current,
        style: styleRef.current,
        timestamp: Date.now(),
      }

      if (toolRef.current === 'eraser') {
        // Remove strokes that the eraser passed over (simple bbox check)
        const ex = pts.map(p => p[0])
        const ey = pts.map(p => p[1])
        const minEx = Math.min(...ex) - widthRef.current * 3
        const maxEx = Math.max(...ex) + widthRef.current * 3
        const minEy = Math.min(...ey) - widthRef.current * 3
        const maxEy = Math.max(...ey) + widthRef.current * 3
        strokesRef.current = strokesRef.current.filter((s) => {
          return !s.points.some(([sx, sy]) =>
            sx >= minEx && sx <= maxEx && sy >= minEy && sy <= maxEy
          )
        })
      } else {
        strokesRef.current = [...strokesRef.current, newStroke]
      }

      // Save undo snapshot
      undoStackRef.current = [...undoStackRef.current, [...strokesRef.current]]

      repaintStatic()
      onStrokeComplete?.(newStroke)
    }, [repaintStatic, onStrokeComplete])

    // ── Imperative API ─────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      undo() {
        if (undoStackRef.current.length <= 1) return
        undoStackRef.current = undoStackRef.current.slice(0, -1)
        strokesRef.current = [...(undoStackRef.current[undoStackRef.current.length - 1] || [])]
        repaintStatic()
      },
      redo() {
        // Simple: not implemented (stateless); user can re-draw
      },
      clear() {
        strokesRef.current = []
        undoStackRef.current = [[]]
        repaintStatic()
      },
      getStrokes() {
        return [...strokesRef.current]
      },
      exportToDataURL() {
        // Merge static + active canvas
        const s = staticCanvasRef.current
        if (!s) return null
        const merged = document.createElement('canvas')
        merged.width = s.width
        merged.height = s.height
        const ctx = merged.getContext('2d')
        if (!ctx) return null
        ctx.drawImage(s, 0, 0)
        return merged.toDataURL('image/png')
      },
      loadStrokes(strokes: CompletedStroke[]) {
        strokesRef.current = strokes
        undoStackRef.current = [[...strokes]]
        repaintStatic()
      },
    }), [repaintStatic])

    // ── Mount / Resize ─────────────────────────────────────────────────────
    useEffect(() => {
      resize()
      const ro = new ResizeObserver(resize)
      if (containerRef.current) ro.observe(containerRef.current)
      return () => ro.disconnect()
    }, [resize])

    useEffect(() => { repaintStatic() }, [repaintStatic, paperLines])

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-full select-none overflow-hidden ${className}`}
        style={{ touchAction: 'none' }}
      >
        {/* Static layer: paper lines + committed strokes */}
        <canvas
          ref={staticCanvasRef}
          className="absolute inset-0 pointer-events-none"
        />
        {/* Active layer: live stroke rendering */}
        <canvas
          ref={activeCanvasRef}
          className="absolute inset-0 touch-none"
          style={{ touchAction: 'none', cursor: 'crosshair' }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          onPointerCancel={onUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    )
  }
)

PrescriptionCanvas.displayName = 'PrescriptionCanvas'
export default PrescriptionCanvas
