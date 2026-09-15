'use client'

import * as React from 'react'
import {
  Users,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Stethoscope,
  Pill,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
} from 'lucide-react'
import { usePatientStats, usePatients } from '@/features/patients/hooks/use-patients'
import { cn } from '@/lib/utils'

const MONTHLY_RX = [
  { month: 'Apr', count: 214, acute: 88, chronic: 126 },
  { month: 'May', count: 238, acute: 102, chronic: 136 },
  { month: 'Jun', count: 265, acute: 115, chronic: 150 },
  { month: 'Jul', count: 247, acute: 95, chronic: 152 },
  { month: 'Aug', count: 291, acute: 130, chronic: 161 },
  { month: 'Sep', count: 318, acute: 148, chronic: 170 },
]

const TOP_DRUGS = [
  { name: 'Lisinopril', count: 87, color: 'bg-sky-500', pct: 87 },
  { name: 'Metformin', count: 74, color: 'bg-emerald-500', pct: 74 },
  { name: 'Atorvastatin', count: 68, color: 'bg-indigo-500', pct: 68 },
  { name: 'Amoxicillin', count: 56, color: 'bg-amber-500', pct: 56 },
  { name: 'Azithromycin', count: 44, color: 'bg-rose-500', pct: 44 },
  { name: 'Amlodipine', count: 38, color: 'bg-purple-500', pct: 38 },
]

const CONDITION_DISTRIBUTION = [
  { name: 'Hypertension', count: 42, pct: 68, color: 'from-rose-500 to-rose-400' },
  { name: 'Type 2 Diabetes', count: 31, pct: 50, color: 'from-amber-500 to-amber-400' },
  { name: 'Asthma / COPD', count: 18, pct: 29, color: 'from-sky-500 to-sky-400' },
  { name: 'Hyperlipidemia', count: 28, pct: 45, color: 'from-indigo-500 to-indigo-400' },
  { name: 'Anxiety / MDD', count: 14, pct: 23, color: 'from-purple-500 to-purple-400' },
  { name: 'Arthritis', count: 11, pct: 18, color: 'from-emerald-500 to-emerald-400' },
]

const RECENT_ACTIVITY = [
  {
    type: 'rx',
    title: 'eRx Issued — Eleanor Vance',
    subtitle: 'Lisinopril 10mg + Metformin 500mg',
    time: '9 min ago',
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    icon: Pill,
  },
  {
    type: 'visit',
    title: 'Visit Completed — James Harrington',
    subtitle: 'Cardiology follow-up consultation',
    time: '31 min ago',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    icon: Stethoscope,
  },
  {
    type: 'alert',
    title: 'Critical Flag — Yuki Nakamura',
    subtitle: 'SpO2 at 88% — Immediate review required',
    time: '1 hr ago',
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    icon: AlertTriangle,
  },
  {
    type: 'register',
    title: 'New Patient — Maria Santos',
    subtitle: 'EHR registered. Initial intake complete.',
    time: '2 hr ago',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    icon: Users,
  },
  {
    type: 'rx',
    title: 'Rx Refill — Aisha Patel',
    subtitle: 'Atorvastatin 20mg refill authorized',
    time: '3 hr ago',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    icon: Pill,
  },
]

const maxCount = Math.max(...MONTHLY_RX.map((d) => d.count))

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = usePatientStats()
  const { data: patientsData } = usePatients({ page: 1, pageSize: 5 })

  const kpiCards = [
    {
      label: 'Total Patients',
      value: statsLoading ? '…' : stats?.totalPatients ?? 0,
      change: '+12%',
      up: true,
      sub: 'vs. last month',
      icon: Users,
      accent: 'from-blue-500/15 to-indigo-500/10',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Active Prescriptions',
      value: statsLoading ? '…' : stats?.activePrescriptionsCount ?? 0,
      change: '+8.3%',
      up: true,
      sub: 'courses active',
      icon: FileText,
      accent: 'from-sky-500/15 to-cyan-500/10',
      iconColor: 'text-sky-500',
    },
    {
      label: "Today's Consultations",
      value: statsLoading ? '…' : stats?.todayAppointments ?? 0,
      change: '+2',
      up: true,
      sub: 'vs. yesterday',
      icon: Calendar,
      accent: 'from-emerald-500/15 to-teal-500/10',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Critical Patients',
      value: statsLoading ? '…' : stats?.criticalPatients ?? 0,
      change: '-1',
      up: false,
      sub: 'requiring immediate care',
      icon: Heart,
      accent: 'from-rose-500/15 to-amber-500/10',
      iconColor: 'text-rose-500',
    },
    {
      label: 'Avg. Rx per Visit',
      value: '2.4',
      change: '+0.2',
      up: true,
      sub: 'medications / encounter',
      icon: Pill,
      accent: 'from-purple-500/15 to-pink-500/10',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Adherence Rate',
      value: '91%',
      change: '+3.1%',
      up: true,
      sub: 'medication compliance',
      icon: TrendingUp,
      accent: 'from-amber-500/15 to-orange-500/10',
      iconColor: 'text-amber-500',
    },
  ]

  return (
    <div className="mx-auto max-w-[1600px] w-full px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              <Activity className="size-3" />
              Clinical Intelligence
            </span>
            <span className="text-[11px] text-muted-foreground">Live data refresh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Clinical Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            AuraRx Pro Dashboard — September 2026
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-2xl border border-border/60 bg-card/60 px-3.5 py-2 shadow-xs backdrop-blur-md">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time • Last synced just now
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className={cn(
                'group relative overflow-hidden rounded-3xl border border-border/60 p-4 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br',
                card.accent
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-muted-foreground leading-tight">
                  {card.label}
                </span>
                <Icon className={cn('size-4 shrink-0', card.iconColor)} />
              </div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px]">
                {card.up ? (
                  <ArrowUpRight className="size-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="size-3 text-rose-500" />
                )}
                <span className={card.up ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}>
                  {card.change}
                </span>
                <span className="text-muted-foreground truncate">{card.sub}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Rx Volume Bar Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Monthly Prescription Volume</h2>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Acute vs. Chronic medication orders</p>
            </div>
            <span className="text-xs font-bold text-foreground">{MONTHLY_RX[MONTHLY_RX.length - 1].count} this month</span>
          </div>
          <div className="flex items-end gap-2 h-36 w-full">
            {MONTHLY_RX.map((d, i) => {
              const isLast = i === MONTHLY_RX.length - 1
              const acutePct = (d.acute / maxCount) * 100
              const chronicPct = (d.chronic / maxCount) * 100
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className={cn('text-[10px] font-bold', isLast ? 'text-foreground' : 'text-muted-foreground')}>
                    {d.count}
                  </span>
                  <div className="w-full flex flex-col gap-0.5 rounded-xl overflow-hidden">
                    <div
                      className={cn('w-full rounded-t-lg transition-all duration-700', isLast ? 'bg-primary' : 'bg-primary/30')}
                      style={{ height: `${acutePct * 0.9}px` }}
                    />
                    <div
                      className={cn('w-full rounded-b-lg transition-all duration-700', isLast ? 'bg-sky-400/60' : 'bg-sky-400/20')}
                      style={{ height: `${chronicPct * 0.9}px` }}
                    />
                  </div>
                  <span className={cn('text-[10px]', isLast ? 'text-foreground font-semibold' : 'text-muted-foreground')}>
                    {d.month}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/40 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" />Acute / Short-term</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-sky-400/60" />Chronic / Maintenance</span>
          </div>
        </div>

        {/* Top Conditions */}
        <div className="rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Condition Distribution</h2>
          </div>
          <div className="space-y-3">
            {CONDITION_DISTRIBUTION.map((cond) => (
              <div key={cond.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-foreground truncate">{cond.name}</span>
                  <span className="text-muted-foreground shrink-0 ml-2">{cond.count} pts</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-700', cond.color)}
                    style={{ width: `${cond.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Drugs + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Top Prescribed Drugs */}
        <div className="lg:col-span-2 rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Top Prescribed Drugs</h2>
          </div>
          <div className="space-y-3">
            {TOP_DRUGS.map((drug, i) => (
              <div key={drug.name} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-muted-foreground w-4 shrink-0">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">{drug.name}</span>
                    <span className="text-muted-foreground">{drug.count} Rx</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', drug.color)}
                      style={{ width: `${drug.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-3 rounded-3xl border border-border/70 bg-card/60 p-5 shadow-xs backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Recent Clinical Activity</h2>
            </div>
            <span className="text-[11px] font-medium text-primary hover:underline cursor-pointer">View all</span>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn('flex size-8 shrink-0 items-center justify-center rounded-2xl border', item.color)}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 mt-0.5">{item.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Patient Health Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Patient Age', value: '47.2 yrs', sub: 'Across all records', icon: Users, color: 'text-blue-500' },
          { label: 'Male / Female', value: '48% / 52%', sub: 'Gender distribution', icon: Activity, color: 'text-pink-500' },
          { label: 'Critical Alerts Sent', value: '7 today', sub: '3 resolved, 4 pending', icon: AlertTriangle, color: 'text-rose-500' },
          { label: 'e-Prescriptions Today', value: '34', sub: '18 acute, 16 chronic', icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((item, i) => {
          const Icon = item.icon
          return (
            <div key={i} className="rounded-3xl border border-border/60 bg-card/50 p-4 backdrop-blur-xl shadow-2xs hover:shadow-xs transition-all">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={cn('size-4', item.color)} />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-xl font-bold text-foreground">{item.value}</div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
