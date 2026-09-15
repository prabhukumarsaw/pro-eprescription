'use client'

import * as React from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePatient } from '@/features/patients/hooks/use-patients'
import { OpdReceiptSheet } from '@/features/prescriptions/components/OpdReceiptSheet'
import { ReceiptToolbar } from '@/features/prescriptions/components/ReceiptToolbar'
import { exportOpdReceiptPdf } from '@/features/prescriptions/utils/exportOpdReceiptPdf'
import {
  getHospitalConfig,
  getDoctorConfig,
} from '@/features/prescriptions/utils/receipt-defaults'
import { Stethoscope, CheckCircle2, X } from 'lucide-react'

export default function PatientReceiptPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const patientId = params.id as string
  const justIssued = searchParams.get('issued') === 'true'

  const { data: patient, isLoading } = usePatient(patientId)

  // Module States
  const [zoom, setZoom] = React.useState<number>(1)
  const [isExporting, setIsExporting] = React.useState(false)
  const [showIssuedBanner, setShowIssuedBanner] = React.useState(justIssued)
  const [savedCanvasData, setSavedCanvasData] = React.useState<string | null>(null)

  // Retrieve persistent handwriting canvas notes for this patient
  React.useEffect(() => {
    if (typeof window !== 'undefined' && patientId) {
      const stored =
        sessionStorage.getItem(`rx_canvas_${patientId}`) ||
        localStorage.getItem(`rx_canvas_${patientId}`)
      if (stored) {
        setSavedCanvasData(stored)
      }
    }
  }, [patientId])

  // Dynamic Configurations
  const hospital = React.useMemo(() => {
    return getHospitalConfig()
  }, [])

  const doctor = React.useMemo(() => {
    return getDoctorConfig(patient)
  }, [patient])

  const guardianText = React.useMemo(() => {
    if (patient?.emergencyContact?.name) {
      return `${patient.emergencyContact.name} (${patient.emergencyContact.relationship || 'Guardian'})`
    }
    return 'Self / Independent'
  }, [patient])

  const rxRows = React.useMemo(() => {
    return (patient?.activePrescriptions || []).map((p) => ({
      id: p.id,
      drug: `${p.medicineName} ${p.dosage || ''}`.trim(),
      dosage: p.dosage || 'Tablet',
      frequency: p.frequency || '1-0-1',
      duration: p.duration || '5 Days',
    }))
  }, [patient])

  const provisionalDiagnosis = React.useMemo(() => {
    return (
      patient?.conditions?.map((c) => c.name).join(', ') ||
      'Pregnancy 24 Weeks Gestation'
    )
  }, [patient])

  const latestVitals = patient?.vitals?.[0]
  const examinationFindings = React.useMemo(() => {
    return ''
  }, [])

  const planOfCare = React.useMemo(() => {
    const rxInstructions = patient?.activePrescriptions
      ?.map((p) => p.instructions)
      .filter(Boolean)
    if (rxInstructions && rxInstructions.length > 0) {
      return Array.from(new Set(rxInstructions)).join('\n')
    }
    return ''
  }, [patient])

  // Enhanced 1:1 Stable PDF Export
  const handleExport = React.useCallback(async () => {
    if (!patient) return
    setIsExporting(true)
    try {
      await exportOpdReceiptPdf({
        patient,
        rxRows,
        provisionalDiagnosis,
        examinationFindings,
        planOfCare,
        attendingDoctor: doctor.name,
        attendingSpeciality: doctor.speciality,
        guardianText,
        followUp: '5 Days',
        canvasData: savedCanvasData,
        hospitalConfig: hospital,
        doctorConfig: doctor,
      })
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setIsExporting(false)
    }
  }, [patient, rxRows, provisionalDiagnosis, examinationFindings, planOfCare, doctor, guardianText, hospital, savedCanvasData])

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse text-primary">
            <Stethoscope className="size-6" />
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            Loading Hospital OPD Card &amp; Receipt…
          </p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <p className="text-sm font-semibold text-destructive">Patient record not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e2e8f0] dark:bg-black font-sans">
      {/* ── Top Toolbar (Hidden when printing) ── */}
      <ReceiptToolbar
        patientId={patient.id}
        patientName={patient.fullName}
        patientMrn={patient.mrn}
        zoom={zoom}
        onZoomChange={setZoom}
        onExportPdf={handleExport}
        isExporting={isExporting}
        doctorName={doctor.name}
      />

      {/* ── Issued Alert Banner ── */}
      {showIssuedBanner && (
        <div className="bg-emerald-600 text-white px-4 py-2 flex items-center justify-between text-xs shadow-md print:hidden animate-in fade-in slide-in-from-top duration-300">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 stroke-[2.5]" />
              <span className="font-bold">
                OPD Card &amp; Prescription Authorized Successfully
              </span>
            </div>
            <button
              onClick={() => setShowIssuedBanner(false)}
              className="text-white/80 hover:text-white p-0.5 rounded-md"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ── Main Receipt Sheet View ── */}
      <main className="flex-1 flex justify-center items-start p-2 sm:p-6 md:p-8 overflow-x-auto print:p-0 print:m-0 print:overflow-visible">
        <div
          style={{
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: 'top center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full flex justify-center print:transform-none"
        >
          <OpdReceiptSheet
            patient={patient}
            attendingDoctor={doctor.name}
            attendingSpeciality={doctor.speciality}
            guardianText={guardianText}
            presentingComplaints=""
            examinationFindings=""
            provisionalDiagnosis=""
            planOfCare=""
            rxDrugs={rxRows}
            followUp="5 Days"
            isReadOnly={true}
            hospitalConfig={hospital}
            doctorConfig={doctor}
            canvasSlot={
              savedCanvasData ? (
                <div className="w-full relative min-h-[480px] flex flex-col items-center justify-start p-0 m-0 border-0 shadow-none bg-transparent">
                  <img
                    src={savedCanvasData}
                    alt="Physician Handwriting"
                    className="w-full h-auto object-contain max-h-[760px] print:max-h-none print:w-full select-none border-0 shadow-none bg-transparent"
                  />
                </div>
              ) : (
                <div className="w-full min-h-[480px] p-0 m-0 border-0 shadow-none bg-transparent" />
              )
            }
            className="print:shadow-none print:border-none print:rounded-none"
          />
        </div>
      </main>
    </div>
  )
}
