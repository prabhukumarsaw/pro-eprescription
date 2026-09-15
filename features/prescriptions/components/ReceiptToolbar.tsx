'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileDown,
  Printer,
  CheckCircle2,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Stethoscope,
} from 'lucide-react'

export interface ReceiptToolbarProps {
  patientId: string
  patientName: string
  patientMrn: string
  zoom: number
  onZoomChange: (zoom: number) => void
  onExportPdf: () => void
  isExporting: boolean
  doctorName: string
}

export function ReceiptToolbar({
  patientId,
  patientName,
  patientMrn,
  zoom,
  onZoomChange,
  onExportPdf,
  isExporting,
  doctorName,
}: ReceiptToolbarProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  return (
    <header className="sticky top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white z-40 px-3 sm:px-6 py-2.5 shadow-md print:hidden transition-all">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* ── Left: Navigation & Patient Details ── */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/patients/${patientId}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 shadow-xs transition-all active:scale-95"
              title="Return to patient profile"
            >
              <ArrowLeft className="size-3.5 stroke-[2.5]" />
              <span>Back</span>
            </Link>

            <Link
              href={`/patients/${patientId}/prescribe`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-sky-400 font-semibold text-xs border border-slate-700/80 transition-all"
              title="Open prescription writing canvas"
            >
              <Stethoscope className="size-3.5" />
              <span>Prescribe Pad</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs border-l border-slate-800 pl-3">
            <div className="flex flex-col">
              <span className="font-bold text-slate-100 uppercase tracking-wide text-xs truncate max-w-[140px] sm:max-w-[200px]">
                {patientName}
              </span>
              <span className="text-sky-400 font-mono text-[10px]">{patientMrn}</span>
            </div>
          </div>
        </div>

        {/* ── Center: Official Verified Record Status ── */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-xs">
          <CheckCircle2 className="size-3.5 stroke-[2.5]" />
          <span>Authorized Hospital OPD Record</span>
        </div>

        {/* ── Right: Zoom, Share, PDF & Print Actions ── */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Zoom Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800 rounded-full px-2.5 py-1 border border-slate-700 text-slate-300 text-xs mr-1">
            <button
              onClick={() => onZoomChange(Math.max(0.7, zoom - 0.1))}
              className="hover:text-white p-0.5"
              title="Zoom Out"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => onZoomChange(Math.min(1.3, zoom + 0.1))}
              className="hover:text-white p-0.5"
              title="Zoom In"
            >
              <ZoomIn className="size-3.5" />
            </button>
            {zoom !== 1 && (
              <button
                onClick={() => onZoomChange(1)}
                className="hover:text-white p-0.5 ml-0.5 text-slate-400"
                title="Reset Zoom"
              >
                <RotateCcw className="size-3" />
              </button>
            )}
          </div>

          {/* Copy Share Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95"
            title="Copy Receipt Link"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Download Vector PDF */}
          <button
            onClick={onExportPdf}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Download Vector A4 PDF"
          >
            <FileDown className="size-3.5" />
            <span>{isExporting ? 'Exporting PDF…' : 'Download PDF'}</span>
          </button>

          {/* Browser Print */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/20 transition-all active:scale-95"
            title="Print Official Receipt"
          >
            <Printer className="size-3.5" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </header>
  )
}
