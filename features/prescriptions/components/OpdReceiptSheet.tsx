'use client'

import * as React from 'react'
import { Patient } from '@/features/patients/types'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HospitalConfig, DoctorStampConfig } from '../types/receipt'
import { getHospitalConfig, getDoctorConfig } from '../utils/receipt-defaults'

export interface RxDrugItem {
  id: string
  drug: string
  dosage?: string
  frequency: string
  duration: string
}

export interface OpdReceiptSheetProps {
  patient: Patient
  attendingDoctor?: string
  attendingSpeciality?: string
  guardianText?: string
  presentingComplaints: string
  onPresentingComplaintsChange?: (val: string) => void
  examinationFindings: string
  onExaminationFindingsChange?: (val: string) => void
  provisionalDiagnosis: string
  onProvisionalDiagnosisChange?: (val: string) => void
  planOfCare: string
  onPlanOfCareChange?: (val: string) => void
  rxDrugs: RxDrugItem[]
  onRemoveDrug?: (id: string) => void
  onAddDrugClick?: () => void
  followUp: string
  onFollowUpChange?: (val: string) => void
  followUpOptions?: string[]
  canvasSlot?: React.ReactNode
  onExtraCanvasHeightClick?: () => void
  isReadOnly?: boolean
  hospitalConfig?: Partial<HospitalConfig>
  doctorConfig?: Partial<DoctorStampConfig>
  className?: string
}

const DEFAULT_FOLLOW_UP_OPTIONS = ['3 Days', '5 Days', '1 Week', '2 Weeks', '1 Month', 'SOS / As Needed']

export function OpdReceiptSheet({
  patient,
  attendingDoctor,
  attendingSpeciality,
  guardianText = 'Self / Independent',
  presentingComplaints,
  onPresentingComplaintsChange,
  examinationFindings,
  onExaminationFindingsChange,
  provisionalDiagnosis,
  onProvisionalDiagnosisChange,
  planOfCare,
  onPlanOfCareChange,
  rxDrugs,
  onRemoveDrug,
  onAddDrugClick,
  followUp,
  onFollowUpChange,
  followUpOptions = DEFAULT_FOLLOW_UP_OPTIONS,
  canvasSlot,
  onExtraCanvasHeightClick,
  isReadOnly = false,
  hospitalConfig: customHospitalConfig,
  doctorConfig: customDoctorConfig,
  className,
}: OpdReceiptSheetProps) {
  const latestVitals = patient.vitals?.[0]

  const hospital = React.useMemo(() => {
    return getHospitalConfig(customHospitalConfig)
  }, [customHospitalConfig])

  const doctor = React.useMemo(() => {
    return getDoctorConfig(patient, {
      name: attendingDoctor,
      speciality: attendingSpeciality,
      ...customDoctorConfig,
    })
  }, [patient, attendingDoctor, attendingSpeciality, customDoctorConfig])

  return (
    <div
      className={cn(
        'w-full max-w-5xl h-full flex flex-col bg-white dark:bg-[#18181b] shadow-2xl rounded-none sm:rounded-2xl border-0 sm:border border-slate-300 dark:border-zinc-800 overflow-y-auto relative text-slate-800 dark:text-slate-200',
        className
      )}
    >
      {/* ── Sheet Top Header (Hospital Logo, OPD CARD title, Registration) ── */}
      <div className="px-4 sm:px-8 pt-3 sm:pt-4 pb-2 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-start justify-between gap-3">
          {/* Left: Hospital Name & Slogan */}
          <div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-serif font-black text-sm">
                {hospital.logoInitial}
              </div>
              <div>
                <h1 className="font-serif font-black text-base sm:text-xl text-rose-600 dark:text-rose-500 tracking-tight leading-none">
                  {hospital.name}
                </h1>
                <p className="text-[9px] sm:text-[10px] text-sky-900 dark:text-sky-400 font-bold tracking-wide">
                  {hospital.subtitle}
                </p>
              </div>
            </div>
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-serif italic mt-0.5">
              {hospital.slogan}
            </p>
          </div>

          {/* Center: OPD CARD Box */}
          <div className="hidden sm:block text-center">
            <span className="px-3 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 font-bold text-xs tracking-wider text-slate-800 dark:text-slate-200">
              PRESCRIPTION
            </span>
          </div>

          {/* Right: Revision, Validity & Date */}
          <div className="text-right text-[9px] text-slate-500 space-y-0.5">
            <p className="font-mono">{hospital.opdCode}</p>
            <p className="text-[8px]">{hospital.establishedText}</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 text-[10px]">
              Date : {new Date().toLocaleDateString('en-GB')}{' '}
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Patient Demographic Table (2-Column Reference Matrix) */}
        <div className="mt-2 border border-slate-300 dark:border-zinc-700 text-[11px] font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-300 dark:divide-zinc-700">
            {/* Column 1 */}
            <div className="p-2 space-y-1">
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">BHMRC No. :</span>
                <strong className="text-sky-700 dark:text-sky-400 font-mono">{patient.mrn}</strong>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Patient Name :</span>
                <strong className="text-slate-900 dark:text-white uppercase">{patient.fullName}</strong>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">s/o, w/o :</span>
                <span>{guardianText}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Contact No :</span>
                <span>{patient.phone}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Address :</span>
                <span className="truncate max-w-xs">
                  {patient.address.street}, {patient.address.city}
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="p-2 space-y-1">
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Age/Sex :</span>
                <strong>
                  {patient.age} Y / {patient.gender}
                </strong>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Blood Group :</span>
                <span className="font-bold text-rose-600">{patient.bloodGroup || 'O+'}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Doctor :</span>
                <span className="font-semibold">{attendingDoctor}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 font-bold">Speciality :</span>
                <span className="uppercase font-semibold text-sky-700 dark:text-sky-400">
                  {attendingSpeciality}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Clinical Writing Sections (Exclusively Pencil Writing) ──────── */}
      <div className="flex-1 relative flex flex-col p-4 sm:p-8 space-y-3">
        {/* Medical Symbol ℞ */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-black text-sky-700 dark:text-sky-400 italic">℞</span>
        </div>

        {/* ── Primary Handwriting Canvas Slot (Only Pencil Notes) ── */}
        <div className="flex-1 w-full min-h-[520px]">
          {canvasSlot}
        </div>

        {/* ── Commented Out Guide Sections (Preserved for Reference) ──
        {/ * Guide Section 1: Presenting Complaints * /}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase">
              PRESENTING COMPLAINTS:
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              INITIAL ASSESSMENT: YES / TIME:{' '}
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {isReadOnly ? (
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 py-1">
              {presentingComplaints || 'None reported'}
            </p>
          ) : (
            <input
              type="text"
              value={presentingComplaints}
              onChange={(e) => onPresentingComplaintsChange?.(e.target.value)}
              placeholder="Write or stylus chief complaints..."
              className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 py-1 outline-none mt-0.5"
            />
          )}
        </div>

        {/ * Guide Section 2: Examination Findings * /}
        <div className="relative z-10">
          <span className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase block">
            EXAMINATION FINDINGS:
          </span>
          <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400 py-0.5 flex-wrap font-sans">
            <span>
              BP: <strong className="text-slate-900 dark:text-white">{latestVitals?.bloodPressure || '120/80 mmHg'}</strong>
            </span>
            <span>
              Pulse: <strong className="text-slate-900 dark:text-white">{latestVitals?.heartRate ? `${latestVitals.heartRate} bpm` : '72 bpm'}</strong>
            </span>
            <span>
              SpO₂: <strong className="text-slate-900 dark:text-white">{latestVitals?.spO2 ? `${latestVitals.spO2}%` : '98%'}</strong>
            </span>
            <span>
              Temp: <strong className="text-slate-900 dark:text-white">{latestVitals?.temperature ? `${latestVitals.temperature}°F` : '98.6°F'}</strong>
            </span>
            <span>
              Blood: <strong className="text-slate-900 dark:text-white">{patient.bloodGroup}</strong>
            </span>
          </div>
          {isReadOnly ? (
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 py-1">
              {examinationFindings || 'Systemic examination within normal limits.'}
            </p>
          ) : (
            <input
              type="text"
              value={examinationFindings}
              onChange={(e) => onExaminationFindingsChange?.(e.target.value)}
              placeholder="Physical examination notes & observations..."
              className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 py-1 outline-none"
            />
          )}
        </div>

        {/ * Guide Section 3: Provisional Diagnosis * /}
        <div className="relative z-10">
          <span className="text-xs font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase block">
            PROVISIONAL DIAGNOSIS:
          </span>
          {isReadOnly ? (
            <p className="text-xs font-bold text-sky-700 dark:text-sky-400 py-1">
              {provisionalDiagnosis || 'Under clinical observation'}
            </p>
          ) : (
            <input
              type="text"
              value={provisionalDiagnosis}
              onChange={(e) => onProvisionalDiagnosisChange?.(e.target.value)}
              placeholder="Clinical Diagnosis..."
              className="w-full text-xs font-bold text-sky-700 dark:text-sky-400 bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 py-1 outline-none"
            />
          )}
        </div>

        {/ * Guide Section 4: Plan of Care * /}
        <div className="relative z-10 space-y-2">
          {isReadOnly ? (
            planOfCare && (
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Advice &amp; Instructions:
                </span>
                <p className="whitespace-pre-wrap text-slate-800 dark:text-slate-200">{planOfCare}</p>
              </div>
            )
          ) : (
            <textarea
              rows={2}
              value={planOfCare}
              onChange={(e) => onPlanOfCareChange?.(e.target.value)}
              placeholder="Type clinical advice..."
              className="w-full text-xs font-medium text-slate-800 dark:text-slate-200 bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 py-1 outline-none resize-none focus:border-sky-500 transition-colors"
            />
          )}
        </div>

        {/ * Guide Section 5: Follow Up Visit * /}
        <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs font-bold pt-2 border-t border-slate-200 dark:border-zinc-800">
          <span className="uppercase text-slate-900 dark:text-slate-100">FOLLOW UP VISIT :</span>
          {isReadOnly ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-sky-600 text-white shadow-xs">
              {followUp}
            </span>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              {followUpOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => onFollowUpChange?.(opt)}
                  className="px-3 py-1 rounded-full text-[11px] font-bold border transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        ── */}
      </div>

      {/* ── Sleek Hospital Doctor Stamp & Footer (Matching Screenshot 2 1:1) ─ */}
      <div className="px-4 sm:px-8 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-900/60 shrink-0 text-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Left: Consultation Validity & Helpline */}
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {hospital.medicoLegalDisclaimer}
            </p>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Emergency 24x7 Helpline:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{hospital.emergencyHelplines}</strong>{' '}
              &nbsp;·&nbsp; {hospital.website}
            </div>
          </div>

          {/* Right: Clean Doctor Stamp Badge (matching Image 2) */}
          <div className="px-4 py-2.5 rounded-xl border-2 border-dashed border-blue-400/80 dark:border-blue-600/80 bg-blue-50/40 dark:bg-blue-950/30 text-right shadow-xs">
            <div className="font-serif italic text-sm font-black text-blue-700 dark:text-blue-400 leading-tight">
              {doctor.name}
            </div>
            <p className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 leading-tight">
              {doctor.qualifications} · {doctor.department || doctor.speciality}
            </p>
            <p className="text-[9px] font-bold text-blue-800 dark:text-blue-300 font-mono mt-0.5">
              Regn No: {doctor.regnNo || '22164'}
            </p>
            <div className="mt-1 flex items-center justify-end">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold tracking-wider uppercase">
                ✓ Digitally Signed &amp; Stamped
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Address */}
        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-zinc-800/60 text-center text-[9px] text-slate-400">
          {hospital.address} · Phone: {hospital.phones}
        </div>
      </div>
    </div>
  )
}
