'use client'

import * as React from 'react'
import {
  Users,
  AlertTriangle,
  FileCheck,
  CalendarCheck,
} from 'lucide-react'
import { usePatientStats } from '../hooks/use-patients'
import { cn } from '@/lib/utils'

export function PatientStatCards() {
  const { data: stats, isLoading } = usePatientStats()

  const cards = [
    {
      title: 'Total Patients',
      value: isLoading ? '...' : stats?.totalPatients ?? 0,
      badge: '+12% this mo',
      badgeColor: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400',
      icon: Users,
      gradient: 'from-blue-500/10 to-indigo-500/10',
      iconColor: 'text-blue-500 dark:text-blue-400',
      borderColor: 'hover:border-blue-500/30',
      description: 'Active medical records',
    },
    {
      title: 'Active Prescriptions',
      value: isLoading ? '...' : stats?.activePrescriptionsCount ?? 0,
      badge: '98.4% Adherence',
      badgeColor: 'text-sky-600 bg-sky-500/10 border-sky-500/20 dark:text-sky-400',
      icon: FileCheck,
      gradient: 'from-sky-500/10 to-cyan-500/10',
      iconColor: 'text-sky-500 dark:text-sky-400',
      borderColor: 'hover:border-sky-500/30',
      description: 'Monitored Rx courses',
    },
    {
      title: 'Critical & High Risk',
      value: isLoading ? '...' : stats?.criticalPatients ?? 0,
      badge: 'Immediate Action',
      badgeColor: 'text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400',
      icon: AlertTriangle,
      gradient: 'from-rose-500/10 to-amber-500/10',
      iconColor: 'text-rose-500 dark:text-rose-400',
      borderColor: 'hover:border-rose-500/30',
      description: 'COPD & severe flags',
    },
    {
      title: "Today's Consultations",
      value: isLoading ? '...' : stats?.todayAppointments ?? 0,
      badge: 'On Schedule',
      badgeColor: 'text-purple-600 bg-purple-500/10 border-purple-500/20 dark:text-purple-400',
      icon: CalendarCheck,
      gradient: 'from-purple-500/10 to-pink-500/10',
      iconColor: 'text-purple-500 dark:text-purple-400',
      borderColor: 'hover:border-purple-500/30',
      description: 'Clinical checkups',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className={cn(
              'group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card/90 to-card/40 p-4 sm:p-5 shadow-xs backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
              card.borderColor
            )}
          >
            {/* Ambient background glow */}
            <div
              className={cn(
                'absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br blur-2xl transition-all duration-500 group-hover:scale-125 opacity-70 pointer-events-none',
                card.gradient
              )}
            />

            <div className="relative flex flex-col justify-between h-full space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                <div
                  className={cn(
                    'flex size-8 items-center justify-center rounded-2xl bg-muted/60 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 shrink-0',
                    card.iconColor
                  )}
                >
                  <Icon className="size-4" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-[11px] text-muted-foreground leading-tight">
                    {card.description}
                  </span>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none shrink-0 whitespace-nowrap',
                      card.badgeColor
                    )}
                  >
                    {card.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
