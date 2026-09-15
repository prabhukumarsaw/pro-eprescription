'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Pill,
  Search,
  X,
  FilePlus,
  Filter,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Users,
  TrendingUp,
} from 'lucide-react'
import { usePatients } from '@/features/patients/hooks/use-patients'
import { PrescriptionItem } from '@/features/patients/types'
import { cn } from '@/lib/utils'

type RxFilter = 'All' | 'Active' | 'Completed' | 'Cancelled'

interface FlatRx extends PrescriptionItem {
  patientName: string
  patientId: string
  patientMrn: string
  patientStatus: string
  prescribedDate: string
}

export default function PrescriptionsPage() {
  const { data: patientsData, isLoading, refetch, isFetching } = usePatients({
    page: 1,
    pageSize: 50,
  })

  const [rxFilter, setRxFilter] = React.useState<RxFilter>('All')
  const [search, setSearch] = React.useState('')

  // Flatten all prescriptions from all patients
  const allRx = React.useMemo<FlatRx[]>(() => {
    const patients = patientsData?.data || []
    const list: FlatRx[] = []
    for (const p of patients) {
      const allMeds = [
        ...(p.activePrescriptions || []),
        ...(p.prescriptionHistory || []),
      ]
      for (const rx of allMeds) {
        list.push({
          ...rx,
          patientName: p.fullName,
          patientId: p.id,
          patientMrn: p.mrn,
          patientStatus: p.status,
          prescribedDate: rx.startDate || p.lastVisitDate,
        })
      }
    }
    return list.sort((a, b) => new Date(b.prescribedDate).getTime() - new Date(a.prescribedDate).getTime())
  }, [patientsData])

  const filtered = React.useMemo(() => {
    let res = allRx
    if (rxFilter !== 'All') {
      res = res.filter((rx) => rx.status === rxFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(
        (rx) =>
          rx.medicineName.toLowerCase().includes(q) ||
          rx.patientName.toLowerCase().includes(q) ||
          rx.patientMrn.toLowerCase().includes(q) ||
          rx.frequency.toLowerCase().includes(q) ||
          rx.prescribedBy?.toLowerCase().includes(q)
      )
    }
    return res
  }, [allRx, rxFilter, search])

  const statsCards = [
    {
      label: 'Total Active Rx',
      value: allRx.filter((r) => r.status === 'Active').length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Completed Courses',
      value: allRx.filter((r) => r.status === 'Completed').length,
      icon: Clock,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      label: 'Unique Medications',
      value: new Set(allRx.map((r) => r.medicineName)).size,
      icon: Pill,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      label: 'Patients on Rx',
      value: new Set(allRx.map((r) => r.patientId)).size,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ]

  const STATUS_FILTERS: RxFilter[] = ['All', 'Active', 'Completed', 'Cancelled']

  return (
    <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Pill className="size-3" />
              Rx Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Prescriptions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All active and historical medication orders across patient records
          </p>
        </div>
        <Link
          href="/patients"
          className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95"
        >
          <FilePlus className="size-3.5" />
          New e-Prescription
        </Link>
      </div>

      {/* Stat Pills */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={i}
              className={cn(
                'rounded-3xl border p-4 flex items-center gap-3 bg-card/60 backdrop-blur-xl shadow-2xs',
                s.bg
              )}
            >
              <Icon className={cn('size-5 shrink-0', s.color)} />
              <div>
                <div className="text-xl font-bold text-foreground">{isLoading ? '…' : s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl border border-border/70 bg-card/50 p-3.5 sm:p-4 shadow-xs backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <Search className="size-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by drug name, patient, MRN, prescriber..."
              className="w-full rounded-2xl border border-border/70 bg-background/70 py-2.5 pl-10 pr-8 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Status Segmented Control */}
          <div className="flex items-center shrink-0 rounded-2xl border border-border/60 bg-muted/40 p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setRxFilter(f)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200',
                  rxFilter === f
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 rounded-2xl border border-border/60 bg-card/60 px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/60 transition-all shadow-xs shrink-0"
          >
            <RefreshCw className={cn('size-3.5', isFetching && 'animate-spin')} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-xs backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border/50 px-4 sm:px-5 py-3.5 bg-muted/20">
          <div className="flex items-center gap-2">
            <Pill className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Medication Orders
            </span>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {filtered.length} records
            </span>
          </div>
          {isFetching && <RefreshCw className="size-3 text-muted-foreground animate-spin" />}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/50 bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-5">Drug / Dosage</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Prescribed By</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 sm:px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-4 px-4">
                        <div className="h-3 rounded bg-muted/60" style={{ width: `${60 + j * 5}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
                        <Pill className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">No prescriptions found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search or status filter</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((rx, i) => (
                  <tr
                    key={`${rx.id}-${i}`}
                    className="group hover:bg-muted/30 transition-colors duration-150"
                  >
                    {/* Drug Name */}
                    <td className="py-3.5 px-4 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                          <Pill className="size-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{rx.medicineName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {rx.dosage} • {rx.form}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/patients/${rx.patientId}`}
                        className="font-medium text-foreground hover:text-primary transition-colors hover:underline whitespace-nowrap"
                      >
                        {rx.patientName}
                      </Link>
                      <p className="text-[10px] font-mono text-muted-foreground">{rx.patientMrn}</p>
                    </td>

                    {/* Frequency */}
                    <td className="py-3.5 px-4">
                      <span className="text-foreground/90 whitespace-nowrap">{rx.frequency}</span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4">
                      <span className="whitespace-nowrap text-foreground/80">{rx.duration}</span>
                    </td>

                    {/* Prescribed By */}
                    <td className="py-3.5 px-4">
                      <span className="text-muted-foreground whitespace-nowrap">{rx.prescribedBy || 'Dr. Marcus Webb'}</span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4">
                      <span className="text-foreground/80 whitespace-nowrap">
                        {new Date(rx.prescribedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border whitespace-nowrap',
                          rx.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                            : rx.status === 'Completed'
                            ? 'bg-sky-500/10 text-sky-600 border-sky-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            rx.status === 'Active'
                              ? 'bg-emerald-500'
                              : rx.status === 'Completed'
                              ? 'bg-sky-500'
                              : 'bg-gray-400'
                          )}
                        />
                        {rx.status || 'Active'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 sm:px-5 text-right">
                      <Link
                        href={`/patients/${rx.patientId}/prescribe`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 whitespace-nowrap"
                      >
                        <FilePlus className="size-3" />
                        Refill Rx
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {!isLoading && filtered.length > 0 && (
          <div className="border-t border-border/50 px-5 py-3 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              Showing{' '}
              <strong className="text-foreground">{filtered.length}</strong> medication orders
            </span>
            <span>
              <strong className="text-emerald-600 dark:text-emerald-400">
                {filtered.filter((r) => r.status === 'Active').length}
              </strong>{' '}
              active
              {' • '}
              <strong className="text-sky-600 dark:text-sky-400">
                {filtered.filter((r) => r.status === 'Completed').length}
              </strong>{' '}
              completed
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
