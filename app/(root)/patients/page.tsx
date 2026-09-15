'use client'

import * as React from 'react'
import { PatientStatCards } from '@/features/patients/components/patient-stat-cards'
import { PatientFilters } from '@/features/patients/components/patient-filters'
import { PatientsTable } from '@/features/patients/components/patients-table'
import { NewPatientModal } from '@/features/patients/components/new-patient-modal'

export default function PatientsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-[1600px] w-full p-8 text-center text-xs font-semibold text-muted-foreground animate-pulse">
          Loading patients directory…
        </div>
      }
    >
      <PatientsPageContent />
    </React.Suspense>
  )
}

function PatientsPageContent() {
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = React.useState(false)

  return (
    <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-4 sm:space-y-6 font-sans">
      {/* KPI Stat Cards (Apple Health Curved Glass) */}
      <PatientStatCards />

      {/* Real-Time Filter Bar (nuqs URL State Sync) */}
      <div className="rounded-3xl border border-border/70 bg-card/50 p-3.5 sm:p-5 shadow-xs backdrop-blur-xl w-full">
        <PatientFilters />
      </div>

      {/* Advanced TanStack Table */}
      <PatientsTable
        onAddPatientClick={() => setIsNewPatientModalOpen(true)}
      />

      {/* Add Patient Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
      />
    </div>
  )
}
