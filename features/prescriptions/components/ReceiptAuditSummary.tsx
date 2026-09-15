'use client'

import * as React from 'react'
import { Patient } from '@/features/patients/types'
import {
  ReceiptAuditTrail,
  HospitalConfig,
  DoctorStampConfig,
} from '../types/receipt'
import {
  ShieldCheck,
  Award,
  Calendar,
  Clock,
  KeyRound,
  FileCheck2,
  AlertTriangle,
  Building2,
  PhoneCall,
} from 'lucide-react'

export interface ReceiptAuditSummaryProps {
  patient: Patient
  audit: ReceiptAuditTrail
  hospital: HospitalConfig
  doctor: DoctorStampConfig
}

export function ReceiptAuditSummary({
  patient,
  audit,
  hospital,
  doctor,
}: ReceiptAuditSummaryProps) {
  return (
    <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-200">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 flex items-center justify-between gap-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">EHR Audit &amp; Medico-Legal Verification</h2>
            <p className="text-xs text-slate-400">
              Statutory Medical Council Registration &amp; Digital Consultation Trail
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-end">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cryptographically Verified</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-1 font-mono">{audit.verificationCode}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* ── Practitioner Credential Matrix ── */}
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Award className="size-5" />
              </div>
              <div>
                <h3 className="font-serif italic font-bold text-base text-blue-700 dark:text-blue-300">
                  {doctor.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {doctor.qualifications} · Department of {doctor.department}
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-blue-200 dark:border-blue-800 text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Statutory Registration
              </span>
              <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                {audit.councilRegn}
              </span>
            </div>
          </div>
        </div>

        {/* ── Consultation Validity & Timeline ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <Clock className="size-3.5 text-sky-600" />
              <span>Encounter Type</span>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-200">{audit.encounterType}</p>
            <p className="text-[10px] text-slate-400">Authorized in OPD Care System</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <Calendar className="size-3.5 text-emerald-600" />
              <span>Consultation Validity</span>
            </div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Valid until {audit.validUntil}</p>
            <p className="text-[10px] text-slate-400">7-Day complimentary review window</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-1">
            <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1">
              <KeyRound className="size-3.5 text-amber-600" />
              <span>EHR Immutable Record</span>
            </div>
            <p className="font-bold font-mono text-slate-800 dark:text-slate-200">{audit.ehrRecordId}</p>
            <p className="text-[10px] text-slate-400">Synchronized with central registry</p>
          </div>
        </div>

        {/* ── Hospital Emergency Protocol & Disclaimer ── */}
        <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/50 p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <PhoneCall className="size-4 text-rose-600" />
            <span>24x7 Emergency Protocols &amp; Helplines</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            For urgent adverse drug events, acute symptoms, or immediate clinical escalation, contact Aurarx Emergency Care:
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border font-mono font-bold text-slate-800 dark:text-slate-200">
              Emergency: {hospital.emergencyHelplines}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border font-mono font-bold text-slate-800 dark:text-slate-200">
              Hospital PBX: {hospital.phones}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-zinc-700 text-[11px] text-slate-500 italic">
            Notice: {hospital.medicoLegalDisclaimer}. Prescriptions must be dispensed by a registered pharmacist against verified doctor credentials.
          </div>
        </div>
      </div>
    </div>
  )
}
