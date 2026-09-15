'use client'

import * as React from 'react'
import { ColumnDef, HeaderContext, CellContext } from '@tanstack/react-table'
import Link from 'next/link'
import {
  Eye,
  FilePlus,
  Trash2,
  AlertCircle,
  Phone,
  Mail,
  Droplet,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Patient, PatientStatus } from '../types'
import { cn } from '@/lib/utils'

interface ColumnProps {
  onDelete?: (patient: Patient) => void
  onQuickPrescribe?: (patient: Patient) => void
}

export function getPatientColumns({
  onDelete,
  onQuickPrescribe,
}: ColumnProps = {}): ColumnDef<Patient, any>[] {
  return [
    // 1. Selection Checkbox
    {
      id: 'select',
      header: ({ table }: HeaderContext<Patient, unknown>) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          aria-label="Select all rows"
          className="size-4 rounded border-border text-primary accent-primary cursor-pointer transition-all"
        />
      ),
      cell: ({ row }: CellContext<Patient, unknown>) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          aria-label="Select row"
          className="size-4 rounded border-border text-primary accent-primary cursor-pointer transition-all"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // 2. Patient Identity & MRN
    {
      accessorKey: 'fullName',
      header: ({ column }: HeaderContext<Patient, unknown>) => {
        const isSorted = column.getIsSorted()
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors group whitespace-nowrap"
          >
            <span>Patient</span>
            {isSorted === 'asc' ? (
              <ArrowUp className="size-3.5 text-primary" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="size-3.5 text-primary" />
            ) : (
              <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        )
      },
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const p = row.original
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            {/* Apple Squircle Avatar with Status Ring */}
            <div className="relative shrink-0">
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.fullName}
                  className="size-10 rounded-2xl object-cover ring-1 ring-border/80 shadow-2xs"
                />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-500 font-semibold text-white shadow-2xs text-xs">
                  {p.firstName[0]}
                  {p.lastName[0]}
                </div>
              )}
              {p.status === 'Critical' && (
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <Link
                href={`/patients/${p.id}`}
                className="font-semibold text-foreground hover:text-primary transition-colors hover:underline underline-offset-2 truncate text-xs sm:text-sm"
              >
                {p.fullName}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="font-mono text-[10px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded-md border border-border/40 whitespace-nowrap leading-tight">
                  {p.mrn}
                </span>
                {p.allergies.length > 0 && (
                  <span
                    title={`Allergies: ${p.allergies.map((a: { substance: string }) => a.substance).join(', ')}`}
                    className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-md border border-amber-500/20 whitespace-nowrap"
                  >
                    <AlertCircle className="size-2.5" />
                    {p.allergies.length} Allergy
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      },
    },

    // 3. Demographics & Blood Group
    {
      accessorKey: 'age',
      header: 'Demographics',
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const p = row.original
        return (
          <div className="flex flex-col gap-1 min-w-[110px] whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-medium text-foreground">{p.age} yrs</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{p.gender}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Droplet className="size-2.5 fill-rose-500" />
                {p.bloodGroup}
              </span>
            </div>
          </div>
        )
      },
    },

    // 4. Contact Details
    {
      accessorKey: 'phone',
      header: 'Contact Info',
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const p = row.original
        return (
          <div className="flex flex-col text-xs gap-1 min-w-[150px]">
            <a
              href={`tel:${p.phone}`}
              className="flex items-center gap-1.5 text-foreground/90 hover:text-primary transition-colors truncate whitespace-nowrap"
            >
              <Phone className="size-3 text-muted-foreground shrink-0" />
              <span>{p.phone}</span>
            </a>
            <a
              href={`mailto:${p.email}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors truncate whitespace-nowrap text-[11px]"
            >
              <Mail className="size-3 text-muted-foreground shrink-0" />
              <span>{p.email}</span>
            </a>
          </div>
        )
      },
    },

    // 5. Medical Diagnoses / Conditions
    {
      accessorKey: 'conditions',
      header: 'Active Diagnoses',
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const p = row.original
        if (!p.conditions || p.conditions.length === 0) {
          return <span className="text-xs text-muted-foreground/60 italic whitespace-nowrap">None recorded</span>
        }

        const primaryCondition = p.conditions[0]
        const extraCount = p.conditions.length - 1

        return (
          <div className="flex items-center gap-1 min-w-[180px]">
            <span
              title={primaryCondition.name}
              className="inline-flex items-center rounded-lg bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-foreground truncate max-w-[160px] border border-border/50"
            >
              {primaryCondition.name}
            </span>
            {extraCount > 0 && (
              <span className="rounded-lg bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary border border-primary/20 shrink-0">
                +{extraCount}
              </span>
            )}
          </div>
        )
      },
    },

    // 6. Clinical Status Badge
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const status = row.original.status as PatientStatus
        const config: Record<PatientStatus, { dot: string; bg: string; text: string; border: string }> = {
          Active: {
            dot: 'bg-emerald-500',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-700 dark:text-emerald-400',
            border: 'border-emerald-500/20',
          },
          Critical: {
            dot: 'bg-rose-500',
            bg: 'bg-rose-500/10',
            text: 'text-rose-700 dark:text-rose-400',
            border: 'border-rose-500/20',
          },
          'Under Review': {
            dot: 'bg-amber-500',
            bg: 'bg-amber-500/10',
            text: 'text-amber-700 dark:text-amber-400',
            border: 'border-amber-500/20',
          },
          Scheduled: {
            dot: 'bg-sky-500',
            bg: 'bg-sky-500/10',
            text: 'text-sky-700 dark:text-sky-400',
            border: 'border-sky-500/20',
          },
          Discharged: {
            dot: 'bg-gray-400',
            bg: 'bg-muted',
            text: 'text-muted-foreground',
            border: 'border-border',
          },
        }

        const current = config[status] || config.Active

        return (
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border backdrop-blur-xs whitespace-nowrap',
              current.bg,
              current.text,
              current.border
            )}
          >
            <span className={cn('size-1.5 rounded-full shrink-0', current.dot)} />
            {status}
          </span>
        )
      },
    },

    // 7. Last Visit Date
    {
      accessorKey: 'lastVisitDate',
      header: ({ column }: HeaderContext<Patient, unknown>) => {
        const isSorted = column.getIsSorted()
        return (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground transition-colors group whitespace-nowrap"
          >
            <span>Last Visit</span>
            {isSorted === 'asc' ? (
              <ArrowUp className="size-3.5 text-primary" />
            ) : isSorted === 'desc' ? (
              <ArrowDown className="size-3.5 text-primary" />
            ) : (
              <ArrowUpDown className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        )
      },
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const date = row.original.lastVisitDate
        return (
          <div className="flex flex-col text-xs min-w-[100px] whitespace-nowrap">
            <span className="font-medium text-foreground">
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {row.original.primaryPhysician.name}
            </span>
          </div>
        )
      },
    },

    // 8. Row Action Menu & Navigation
    {
      id: 'actions',
      cell: ({ row }: CellContext<Patient, unknown>) => {
        const p = row.original
        return (
          <div className="flex items-center justify-end gap-1.5 min-w-[130px] whitespace-nowrap">
            <Link
              href={`/patients/${p.id}`}
              className="flex items-center gap-1 rounded-xl border border-border/60 bg-card/60 px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs hover:bg-muted/80 hover:text-primary transition-all active:scale-95 whitespace-nowrap"
            >
              <Eye className="size-3.5" />
              <span>View EHR</span>
            </Link>

            <button
              onClick={() => onQuickPrescribe?.(p)}
              title="New e-Prescription"
              className="flex size-7 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 shrink-0"
            >
              <FilePlus className="size-3.5" />
            </button>

            {onDelete && (
              <button
                onClick={() => onDelete(p)}
                title="Delete patient record"
                className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/20 transition-all active:scale-95 shrink-0"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        )
      },
      enableSorting: false,
    },
  ]
}
