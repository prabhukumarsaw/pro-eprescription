'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Users,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { usePatients } from '@/features/patients/hooks/use-patients'
import { cn } from '@/lib/utils'

type AptStatus = 'All' | 'Upcoming' | 'Completed' | 'Cancelled'

interface FlatAppointment {
  id: string
  patientId: string
  patientName: string
  patientMrn: string
  doctorName: string
  department: string
  date: string
  type: string
  status: string
  summary?: string
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function AppointmentsPage() {
  const { data: patientsData, isLoading } = usePatients({ page: 1, pageSize: 50 })

  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<AptStatus>('All')
  const [currentDate, setCurrentDate] = React.useState(new Date(2026, 8, 1)) // Sept 2026

  // Flatten appointments
  const allAppointments = React.useMemo<FlatAppointment[]>(() => {
    const patients = patientsData?.data || []
    const list: FlatAppointment[] = []
    for (const p of patients) {
      for (const apt of p.appointments || []) {
        list.push({
          ...apt,
          patientId: p.id,
          patientName: p.fullName,
          patientMrn: p.mrn,
        })
      }
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [patientsData])

  // Days with appointments (for mini-calendar highlighting)
  const apptDays = React.useMemo(() => {
    const days = new Set<number>()
    for (const apt of allAppointments) {
      const d = new Date(apt.date)
      if (d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth()) {
        days.add(d.getDate())
      }
    }
    return days
  }, [allAppointments, currentDate])

  const filtered = React.useMemo(() => {
    let res = allAppointments
    if (statusFilter !== 'All') res = res.filter((a) => a.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      res = res.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.patientMrn.toLowerCase().includes(q) ||
          a.doctorName.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q)
      )
    }
    return res
  }, [allAppointments, statusFilter, search])

  // Mini calendar
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const calendarCells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarCells.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d)
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)

  const statsCards = [
    {
      label: 'Total Appointments',
      value: allAppointments.length,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Upcoming',
      value: allAppointments.filter((a) => a.status === 'Upcoming').length,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Completed',
      value: allAppointments.filter((a) => a.status === 'Completed').length,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Patients with Visits',
      value: new Set(allAppointments.map((a) => a.patientId)).size,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ]

  return (
    <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Calendar className="size-3" />
              Scheduling
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Appointments
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            All clinical consultations, follow-ups, and visits
          </p>
        </div>
        <Link
          href="/patients"
          className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus className="size-3.5" />
          Schedule Appointment
        </Link>
      </div>

      {/* Stat Cards */}
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

      {/* Main Content: Calendar + List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Mini Calendar */}
        <div className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-all"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="text-xs font-semibold text-foreground">
              {MONTHS[month].slice(0, 3)} {year}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-muted/40 hover:bg-muted/70 transition-all"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Cells */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarCells.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
              const hasEvent = day !== null && apptDays.has(day)
              return (
                <div key={i} className="flex flex-col items-center py-1">
                  {day ? (
                    <button
                      className={cn(
                        'relative flex size-7 items-center justify-center rounded-lg text-[11px] font-medium transition-all',
                        isToday
                          ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                          : 'text-foreground hover:bg-muted/60'
                      )}
                    >
                      {day}
                      {hasEvent && !isToday && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />
                      )}
                    </button>
                  ) : (
                    <span className="size-7" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-2 text-[10px] text-muted-foreground">
            <span className="size-2 rounded-full bg-primary inline-block" />
            <span>Has scheduled visits</span>
          </div>

          {/* Quick upcoming */}
          <div className="mt-3 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Next Upcoming
            </p>
            {allAppointments
              .filter((a) => a.status === 'Upcoming')
              .slice(0, 3)
              .map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-xl border border-border/50 bg-muted/30 p-2.5 text-[11px]"
                >
                  <p className="font-semibold text-foreground truncate">{apt.patientName}</p>
                  <p className="text-muted-foreground truncate">{apt.type}</p>
                  <p className="text-primary font-medium">
                    {new Date(apt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-3 rounded-3xl border border-border/70 bg-card/60 shadow-xs backdrop-blur-xl overflow-hidden">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-b border-border/50 px-4 sm:px-5 py-3.5 bg-muted/20">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Search className="size-3.5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, doctor, department..."
                className="w-full rounded-xl border border-border/60 bg-background/70 py-1.5 pl-9 pr-7 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
            <div className="flex items-center shrink-0 rounded-xl border border-border/60 bg-muted/40 p-0.5">
              {(['All', 'Upcoming', 'Completed'] as AptStatus[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200',
                    statusFilter === f
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-5">Patient</th>
                  <th className="py-3 px-4">Visit Type</th>
                  <th className="py-3 px-4">Physician</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-5 text-right">EHR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="py-4 px-4">
                          <div className="h-3 rounded bg-muted/60" style={{ width: '70%' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle className="size-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium text-foreground">No appointments found</p>
                        <p className="text-xs text-muted-foreground">Adjust search or status filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((apt) => (
                    <tr key={apt.id} className="group hover:bg-muted/30 transition-colors">
                      {/* Patient */}
                      <td className="py-3.5 px-4 sm:px-5">
                        <Link
                          href={`/patients/${apt.patientId}`}
                          className="font-semibold text-foreground hover:text-primary transition-colors hover:underline"
                        >
                          {apt.patientName}
                        </Link>
                        <p className="text-[10px] font-mono text-muted-foreground">{apt.patientMrn}</p>
                      </td>

                      {/* Visit Type */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 px-2 py-1 text-[11px] font-medium text-foreground whitespace-nowrap">
                          <Stethoscope className="size-3 text-primary shrink-0" />
                          {apt.type}
                        </span>
                        {apt.summary && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[200px] truncate">{apt.summary}</p>
                        )}
                      </td>

                      {/* Physician */}
                      <td className="py-3.5 px-4">
                        <p className="text-foreground/90 whitespace-nowrap">{apt.doctorName}</p>
                        <p className="text-[10px] text-muted-foreground">{apt.department}</p>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4">
                        <span className="text-foreground/80 whitespace-nowrap">
                          {new Date(apt.date).toLocaleDateString('en-US', {
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
                            apt.status === 'Upcoming'
                              ? 'bg-sky-500/10 text-sky-600 border-sky-500/20'
                              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full',
                              apt.status === 'Upcoming' ? 'bg-sky-500 animate-pulse' : 'bg-emerald-500'
                            )}
                          />
                          {apt.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 sm:px-5 text-right">
                        <Link
                          href={`/patients/${apt.patientId}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-card/60 px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
                        >
                          View EHR
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filtered.length > 0 && (
            <div className="border-t border-border/50 px-5 py-3 bg-muted/20 text-[11px] text-muted-foreground">
              Showing <strong className="text-foreground">{filtered.length}</strong> consultations
              {' • '}
              <strong className="text-sky-600 dark:text-sky-400">
                {filtered.filter((a) => a.status === 'Upcoming').length}
              </strong>{' '}
              upcoming
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
