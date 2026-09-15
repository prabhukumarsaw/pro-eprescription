'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { usePatient } from '@/features/patients/hooks/use-patients'
import { PatientDetailView } from '@/features/patients/components/patient-detail-view'

export default function PatientDetailPage() {
  const params = useParams()
  const patientId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : ''

  const { data: patient, isLoading, isError, refetch } = usePatient(patientId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground font-sans">
          Loading electronic health record...
        </p>
      </div>
    )
  }

  if (isError || !patient) {
    return (
      <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center gap-4 text-center font-sans">
        <div className="flex size-14 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500">
          <AlertCircle className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">Patient Record Not Found</h2>
          <p className="text-xs text-muted-foreground max-w-md">
            The requested medical record ID ({patientId}) could not be retrieved from the clinical registry.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Link
            href="/patients"
            className="flex items-center gap-2 rounded-2xl border border-border/70 bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Directory</span>
          </Link>
          <button
            onClick={() => refetch()}
            className="rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8">
      <PatientDetailView patient={patient} />
    </div>
  )
}
