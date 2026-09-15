'use client'

import * as React from 'react'
import {
  X,
  Printer,
  Download,
  CheckCircle,
  Stethoscope,
  ShieldCheck,
  QrCode,
  Pill,
  Calendar,
  AlertTriangle,
} from 'lucide-react'
import { Patient, PrescriptionItem } from '@/features/patients/types'

interface PrescriptionSlipModalProps {
  isOpen: boolean
  onClose: () => void
  patient: Patient
  prescriptions: PrescriptionItem[]
  diagnosis?: string
  doctorNotes?: string
  rxNumber?: string
  prescribedDate?: string
}

export function PrescriptionSlipModal({
  isOpen,
  onClose,
  patient,
  prescriptions,
  diagnosis = 'Clinical Evaluation & Follow-up',
  doctorNotes = 'Follow advised regimen. Return for follow-up in 4 weeks.',
  rxNumber = `RX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
  prescribedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
}: PrescriptionSlipModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl backdrop-blur-2xl font-sans my-8">
        {/* Top Control Bar (Non-printable) */}
        <div className="flex items-center justify-between pb-6 border-b border-border/50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle className="size-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Digital e-Prescription Authorized
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                Rx ID: {rxNumber} • FHIR Compliant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-all active:scale-95"
            >
              <Printer className="size-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Medical Prescription Slip */}
        <div className="mt-6 space-y-6 bg-background rounded-2xl p-6 sm:p-8 border border-border/60 shadow-xs">
          {/* Clinic Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md">
                <Stethoscope className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  AuraRx Medical Health Institute
                </h2>
                <p className="text-xs text-muted-foreground">
                  Division of Ambulatory Care & Precision Medicine
                </p>
                <p className="text-[11px] text-muted-foreground">
                  100 Innovation Way, Cupertino, CA 95014 • Lic #CA-MD-98211
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="font-mono text-sm font-bold text-primary block">{rxNumber}</span>
              <span className="text-muted-foreground text-[11px] block">Date: {prescribedDate}</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                <ShieldCheck className="size-3" />
                Digitally Signed & Validated
              </span>
            </div>
          </div>

          {/* Patient Details & Allergy Alert Bar */}
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/50 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Patient Name</span>
              <strong className="text-foreground text-sm">{patient.fullName}</strong>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">MRN & Age</span>
              <span className="font-mono text-foreground font-semibold">{patient.mrn}</span> ({patient.age} yrs, {patient.gender})
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Blood Group</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">{patient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Known Allergies</span>
              <span className="font-medium text-foreground">
                {patient.allergies.length > 0
                  ? patient.allergies.map((a) => a.substance).join(', ')
                  : 'None Documented (NKDA)'}
              </span>
            </div>
          </div>

          {/* Primary Diagnosis */}
          {diagnosis && (
            <div className="text-xs flex items-center gap-2">
              <span className="font-semibold text-muted-foreground">Clinical Indication:</span>
              <span className="rounded-lg bg-primary/10 text-primary px-2.5 py-0.5 font-medium border border-primary/20">
                {diagnosis}
              </span>
            </div>
          )}

          {/* Rx Medications Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-primary font-bold text-base">
              <span className="text-2xl font-serif">℞</span>
              <span>Prescribed Medications</span>
            </div>

            <div className="rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/40">
              {prescriptions.map((item, index) => (
                <div key={item.id || index} className="p-4 bg-card/40 space-y-1.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">
                        {index + 1}. {item.medicineName}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                        {item.dosage}
                      </span>
                      <span className="text-muted-foreground text-[11px]">({item.form})</span>
                    </div>

                    <span className="font-medium text-muted-foreground text-[11px]">
                      Duration: <strong className="text-foreground">{item.duration}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">Dosage Schedule: </span>
                      {item.frequency}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Refills Authorized: </span>
                      {item.refillsRemaining ?? 0}
                    </div>
                  </div>

                  {item.instructions && (
                    <p className="text-[11px] text-foreground/90 bg-muted/30 p-2 rounded-lg border border-border/30">
                      <strong>Instructions:</strong> {item.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Advice & Follow-up */}
          {doctorNotes && (
            <div className="rounded-2xl bg-muted/30 p-3.5 border border-border/40 text-xs space-y-1">
              <span className="font-semibold text-foreground block">Physician Clinical Advice & Notes:</span>
              <p className="text-[11px] text-muted-foreground">{doctorNotes}</p>
            </div>
          )}

          {/* Doctor Signature & Security QR Code Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t-2 border-dashed border-border/60">
            <div className="flex items-center gap-3">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 border border-border/60 p-2">
                <QrCode className="size-full text-foreground/80" />
              </div>
              <div className="text-[11px] text-muted-foreground font-mono space-y-0.5">
                <span className="font-bold text-foreground block">Electronic Rx Verification</span>
                <span>SHA-256: e8f9...39a1</span>
                <span>Scan for pharmacy dispensary record</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-serif italic text-lg text-primary tracking-wide font-bold">
                Dr. Marcus Webb, MD
              </div>
              <div className="text-[10px] text-muted-foreground font-sans">
                Cardiology & Internal Medicine • NPI #1982740192
              </div>
              <div className="text-[9px] text-muted-foreground/80">
                Authorized Electronic Prescribing Signature
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
          <button
            onClick={onClose}
            className="rounded-xl border border-border/70 bg-card px-5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
