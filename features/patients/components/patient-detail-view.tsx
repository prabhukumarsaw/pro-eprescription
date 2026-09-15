'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart,
  Activity,
  Droplet,
  Wind,
  Scale,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  FilePlus,
  ArrowLeft,
  Pill,
  Clock,
  ShieldCheck,
  User,
  Plus,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  FileText,
  Thermometer,
  Printer,
} from 'lucide-react'
import { Patient, PrescriptionItem, VitalSign } from '../types'
import { useUpdatePatient } from '../hooks/use-patients'
import { cn } from '@/lib/utils'

interface PatientDetailViewProps {
  patient: Patient
}

export function PatientDetailView({ patient }: PatientDetailViewProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'vitals' | 'prescriptions' | 'conditions' | 'appointments'>('prescriptions')
  const [showRxModal, setShowRxModal] = React.useState(false)
  const updateMutation = useUpdatePatient()

  // Latest vitals record
  const latestVitals = patient.vitals?.[0] || {
    bloodPressure: '120/80',
    heartRate: 72,
    spO2: 99,
    temperature: 98.6,
    respiratoryRate: 16,
    bloodGlucose: 100,
    bmi: 22.5,
    weightKg: 65,
    heightCm: 168,
    date: new Date().toISOString(),
    recordedBy: 'Clinical Triage',
  }

  // Quick Prescription Form State
  const [newRx, setNewRx] = React.useState({
    medicineName: '',
    dosage: '',
    form: 'Tablet' as const,
    frequency: '1-0-1 (After Meals)',
    duration: '14 Days',
    instructions: '',
    refillsRemaining: 2,
  })

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRx.medicineName.trim()) return

    const prescriptionItem: PrescriptionItem = {
      id: `rx-${Date.now()}`,
      medicineName: newRx.medicineName,
      dosage: newRx.dosage || '500mg',
      form: newRx.form,
      frequency: newRx.frequency,
      duration: newRx.duration,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      prescribedBy: patient.primaryPhysician.name,
      instructions: newRx.instructions || 'Take as directed by doctor.',
      refillsRemaining: Number(newRx.refillsRemaining) || 0,
    }

    const updatedPrescriptions = [prescriptionItem, ...(patient.activePrescriptions || [])]
    await updateMutation.mutateAsync({
      id: patient.id,
      payload: { activePrescriptions: updatedPrescriptions },
    })

    setShowRxModal(false)
    setNewRx({
      medicineName: '',
      dosage: '',
      form: 'Tablet',
      frequency: '1-0-1 (After Meals)',
      duration: '14 Days',
      instructions: '',
      refillsRemaining: 2,
    })
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all shadow-2xs backdrop-blur-md active:scale-95"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Patient Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            title="Print patient record"
            className="flex items-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all shadow-2xs active:scale-95"
          >
            <Printer className="size-3.5" />
            <span className="hidden sm:inline">Print Record</span>
          </button>
          <button
            onClick={() => router.push(`/patients/${patient.id}/prescribe`)}
            className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95"
          >
            <FilePlus className="size-3.5" />
            <span>Write e-Prescription</span>
          </button>
        </div>
      </div>

      {/* Patient Apple Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-card/90 to-card/50 p-6 shadow-sm backdrop-blur-2xl">
        {/* Glow ambient accent */}
        <div className="absolute -top-12 -right-12 size-48 rounded-full bg-gradient-to-br from-primary/15 to-sky-400/10 blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & Demographics */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              {patient.avatarUrl ? (
                <img
                  src={patient.avatarUrl}
                  alt={patient.fullName}
                  className="size-20 rounded-3xl object-cover ring-2 ring-border/80 shadow-md"
                />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-xl font-bold text-white shadow-md">
                  {patient.firstName[0]}
                  {patient.lastName[0]}
                </div>
              )}
              <span
                className={cn(
                  'absolute -bottom-1 -right-1 size-4 rounded-full ring-2 ring-card shadow-xs',
                  patient.status === 'Critical'
                    ? 'bg-rose-500 animate-pulse'
                    : patient.status === 'Active'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                  {patient.fullName}
                </h1>
                <span className="font-mono text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-lg border border-border/60">
                  {patient.mrn}
                </span>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-semibold border',
                    patient.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                      : patient.status === 'Critical'
                      ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                  )}
                >
                  {patient.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                <span>
                  Age: <strong className="text-foreground">{patient.age} yrs</strong> ({patient.dateOfBirth})
                </span>
                <span>•</span>
                <span>
                  Gender: <strong className="text-foreground">{patient.gender}</strong>
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-1.5 py-0.5 font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Droplet className="size-2.5 fill-rose-500" />
                  Blood: {patient.bloodGroup}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3 text-muted-foreground/80" />
                  {patient.phone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3 text-muted-foreground/80" />
                  {patient.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-muted-foreground/80" />
                  {patient.address.city}, {patient.address.state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Doctor & Insurance Info Card */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/30 p-4 text-xs backdrop-blur-md w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2">
              <Stethoscope className="size-4 text-primary" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-medium">
                  Primary Physician
                </span>
                <span className="font-semibold text-foreground">
                  {patient.primaryPhysician.name}
                </span>
                <span className="text-[11px] text-muted-foreground ml-1">
                  ({patient.primaryPhysician.department})
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-muted-foreground block">Emergency Contact</span>
                <span className="font-medium text-foreground">
                  {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                </span>
              </div>
              <a
                href={`tel:${patient.emergencyContact.phone}`}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                {patient.emergencyContact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Apple Health Vitals Bento Grid */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Clinical Vitals & Biometrics
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Recorded {new Date(latestVitals.date).toLocaleDateString()} by {latestVitals.recordedBy}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Blood Pressure */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-2xs backdrop-blur-xl transition-all hover:shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Blood Pressure</span>
              <Heart className="size-4 text-rose-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {latestVitals.bloodPressure}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">mmHg</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Optimal
              </span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-2xs backdrop-blur-xl transition-all hover:shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Heart Rate</span>
              <Activity className="size-4 text-rose-500 animate-pulse" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {latestVitals.heartRate}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">BPM</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                Normal
              </span>
            </div>
          </div>

          {/* Oxygen Saturation */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-2xs backdrop-blur-xl transition-all hover:shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Blood Oxygen</span>
              <Wind className="size-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {latestVitals.spO2}%
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">SpO2</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.2 text-[10px] font-medium',
                  latestVitals.spO2 < 93
                    ? 'bg-rose-500/10 text-rose-600'
                    : 'bg-emerald-500/10 text-emerald-600'
                )}
              >
                {latestVitals.spO2 < 93 ? 'Hypoxic Flag' : '95-100%'}
              </span>
            </div>
          </div>

          {/* Body Mass Index */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-2xs backdrop-blur-xl transition-all hover:shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">BMI Index</span>
              <Scale className="size-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {latestVitals.bmi}
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {latestVitals.weightKg}kg / {latestVitals.heightCm}cm
              </span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-600">
                Normal
              </span>
            </div>
          </div>

          {/* Temperature */}
          <div className="rounded-3xl border border-border/60 bg-card/60 p-4 shadow-2xs backdrop-blur-xl transition-all hover:shadow-xs col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-medium">Temperature</span>
              <Thermometer className="size-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {latestVitals.temperature}°F
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">Oral Axillary</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-medium text-emerald-600">
                Afebrile
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Apple Segmented Tabs for EHR Sections */}
      <div className="space-y-4">
        <div className="flex items-center overflow-x-auto no-scrollbar rounded-2xl border border-border/60 bg-muted/40 p-1 backdrop-blur-md">
          {[
            { id: 'prescriptions', label: 'Prescriptions & Rx History', icon: Pill, count: patient.activePrescriptions?.length || 0 },
            { id: 'conditions', label: 'Conditions & Allergies', icon: ShieldCheck, count: (patient.conditions?.length || 0) + (patient.allergies?.length || 0) },
            { id: 'appointments', label: 'Consultations & Visits', icon: Calendar, count: patient.appointments?.length || 0 },
            { id: 'vitals', label: 'Vitals Log', icon: Activity, count: patient.vitals?.length || 0 },
          ].map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200',
                  isSelected
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab 1: Prescriptions & Rx History */}
        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Medications ({patient.activePrescriptions?.length || 0})
              </h3>
              <Link
                href={`/patients/${patient.id}/prescribe`}
                className="flex items-center gap-1.5 rounded-xl bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
              >
                <Plus className="size-3.5" />
                <span>Write Full Rx</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {patient.activePrescriptions && patient.activePrescriptions.length > 0 ? (
                patient.activePrescriptions.map((rx) => (
                  <div
                    key={rx.id}
                    className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/70 p-5 shadow-2xs backdrop-blur-xl space-y-3 transition-all hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                          <Pill className="size-4" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                            {rx.medicineName}
                            <span className="rounded-md bg-muted px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground">
                              {rx.dosage}
                            </span>
                          </h4>
                          <span className="text-[11px] text-muted-foreground">{rx.form}</span>
                        </div>
                      </div>

                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 border border-emerald-500/20">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs rounded-2xl bg-muted/40 p-3 border border-border/40">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Frequency</span>
                        <span className="font-medium text-foreground">{rx.frequency}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Duration</span>
                        <span className="font-medium text-foreground">{rx.duration}</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Instructions</span>
                        <p className="text-[11px] text-foreground/90">{rx.instructions}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>Prescribed by {rx.prescribedBy}</span>
                      <span className="font-medium text-primary">
                        {rx.refillsRemaining} refills left
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-3xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                  No active prescriptions recorded for this patient.
                </div>
              )}
            </div>

            {/* Past Medication History */}
            {patient.prescriptionHistory && patient.prescriptionHistory.length > 0 && (
              <div className="pt-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Past Medication History
                </h3>
                <div className="rounded-3xl border border-border/60 bg-card/40 divide-y divide-border/40 overflow-hidden">
                  {patient.prescriptionHistory.map((rx) => (
                    <div key={rx.id} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-foreground">{rx.medicineName} ({rx.dosage})</span>
                        <p className="text-[11px] text-muted-foreground">{rx.instructions}</p>
                      </div>
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Conditions & Allergies */}
        {activeTab === 'conditions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Diagnoses */}
            <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-primary" />
                Diagnosed Medical Conditions ({patient.conditions.length})
              </h3>
              <div className="space-y-2">
                {patient.conditions.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border/50 bg-muted/30 p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      {c.code && (
                        <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.2 rounded">
                          ICD-10: {c.code}
                        </span>
                      )}
                    </div>
                    {c.notes && <p className="text-[11px] text-muted-foreground">{c.notes}</p>}
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      Diagnosed on {c.diagnosedDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies Alerts */}
            <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-2xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="size-4 text-rose-500" />
                Documented Allergies ({patient.allergies.length})
              </h3>
              <div className="space-y-2">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map((al) => (
                    <div
                      key={al.id}
                      className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-700 dark:text-rose-300">
                          {al.substance}
                        </span>
                        <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                          {al.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Reaction: {al.reaction}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No documented drug or food allergies.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === 'appointments' && (
          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-2xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-4 text-primary" />
              Consultations & Visit History
            </h3>
            <div className="divide-y divide-border/40">
              {patient.appointments.map((apt) => (
                <div key={apt.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{apt.type} with {apt.doctorName}</span>
                    <span className="text-[11px] text-muted-foreground block">{apt.department} • {apt.summary}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-medium text-foreground block">
                      {new Date(apt.date).toLocaleDateString()}
                    </span>
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold mt-1',
                        apt.status === 'Upcoming'
                          ? 'bg-sky-500/10 text-sky-600'
                          : 'bg-emerald-500/10 text-emerald-600'
                      )}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Vitals Log */}
        {activeTab === 'vitals' && (
          <div className="rounded-3xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl space-y-3 shadow-2xs overflow-x-auto">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="size-4 text-primary" />
              Historical Vitals Log
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground text-[11px]">
                  <th className="py-2">Date</th>
                  <th className="py-2">Blood Pressure</th>
                  <th className="py-2">Heart Rate</th>
                  <th className="py-2">SpO2</th>
                  <th className="py-2">BMI</th>
                  <th className="py-2">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {patient.vitals.map((v) => (
                  <tr key={v.id}>
                    <td className="py-2.5 font-medium">{new Date(v.date).toLocaleDateString()}</td>
                    <td className="py-2.5">{v.bloodPressure} mmHg</td>
                    <td className="py-2.5">{v.heartRate} bpm</td>
                    <td className="py-2.5">{v.spO2}%</td>
                    <td className="py-2.5">{v.bmi}</td>
                    <td className="py-2.5 text-muted-foreground">{v.recordedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* e-Prescription Modal Sheet */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Pill className="size-4 text-primary" />
              Prescribe Medication for {patient.fullName}
            </h3>
            <form onSubmit={handleAddPrescription} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Medicine Name & Generic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amoxicillin, Atorvastatin, Lisinopril"
                  value={newRx.medicineName}
                  onChange={(e) => setNewRx({ ...newRx, medicineName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Dosage Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500mg, 10ml"
                    value={newRx.dosage}
                    onChange={(e) => setNewRx({ ...newRx, dosage: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1-0-1 (Twice Daily)"
                    value={newRx.frequency}
                    onChange={(e) => setNewRx({ ...newRx, frequency: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 14 Days, 1 Month"
                    value={newRx.duration}
                    onChange={(e) => setNewRx({ ...newRx, duration: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Refills</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={newRx.refillsRemaining}
                    onChange={(e) => setNewRx({ ...newRx, refillsRemaining: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Clinical Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Take after breakfast with water. Avoid grapefruit."
                  value={newRx.instructions}
                  onChange={(e) => setNewRx({ ...newRx, instructions: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setShowRxModal(false)}
                  className="rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
                >
                  {updateMutation.isPending ? 'Issuing Rx...' : 'Authorize & Sign Rx'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
