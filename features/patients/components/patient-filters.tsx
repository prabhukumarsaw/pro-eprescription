'use client'

import * as React from 'react'
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Droplet,
  UserCheck,
} from 'lucide-react'
import { usePatientParams } from '../hooks/use-patient-params'
import { PatientStatus, BloodGroup, Gender } from '../types'
import { cn } from '@/lib/utils'

const STATUS_OPTIONS: { label: string; value: PatientStatus | 'All' }[] = [
  { label: 'All Patients', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Critical', value: 'Critical' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'Discharged', value: 'Discharged' },
]

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export function PatientFilters() {
  const {
    params,
    setQuery,
    setStatus,
    setBloodGroup,
    setGender,
    resetFilters,
  } = usePatientParams()

  const [searchInput, setSearchInput] = React.useState(params.query || '')
  const [showAdvanced, setShowAdvanced] = React.useState(false)

  React.useEffect(() => {
    setSearchInput(params.query || '')
  }, [params.query])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchInput(val)
    setQuery(val)
  }

  const clearSearch = () => {
    setSearchInput('')
    setQuery('')
  }

  const hasActiveFilters =
    Boolean(params.query) ||
    params.status !== 'All' ||
    params.gender !== 'All' ||
    params.bloodGroup !== 'All'

  return (
    <div className="flex flex-col gap-3 font-sans w-full">
      {/* Top Filter Bar (Responsive Flex Layout) */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Apple Squircle Search Box */}
        <div className="relative flex-1 min-w-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
            <Search className="size-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search by name, MRN, diagnosis, email, phone..."
            className="w-full rounded-2xl border border-border/70 bg-card/70 py-2.5 pl-10 pr-9 text-xs sm:text-sm text-foreground shadow-xs backdrop-blur-md transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-card focus:outline-none focus:ring-3 focus:ring-primary/10"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls & Segmented Pills */}
        <div className="flex items-center justify-between sm:justify-end gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {/* Apple Segmented Control for Status */}
          <div className="flex items-center shrink-0 rounded-2xl border border-border/60 bg-muted/40 p-1 backdrop-blur-md shadow-2xs">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = params.status === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={cn(
                    'relative rounded-xl px-2.5 sm:px-3 py-1 text-xs font-medium whitespace-nowrap transition-all duration-200',
                    isSelected
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {opt.label}
                  {opt.value === 'Critical' && (
                    <span className="ml-1.5 size-1.5 rounded-full bg-rose-500 inline-block align-middle" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Filter Toggle Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={cn(
                'flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-medium transition-all shadow-xs backdrop-blur-md whitespace-nowrap',
                showAdvanced || hasActiveFilters
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <SlidersHorizontal className="size-3.5" />
              <span className="hidden xs:inline">Filters</span>
              {hasActiveFilters && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  !
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                title="Reset all filters"
                className="flex size-8 items-center justify-center rounded-2xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all shadow-xs shrink-0"
              >
                <RotateCcw className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 rounded-2xl border border-border/50 bg-card/40 p-4 shadow-2xs backdrop-blur-xl animate-in fade-in-50 duration-200">
          {/* Blood Group Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Droplet className="size-3 text-rose-500" />
              Blood Group
            </label>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setBloodGroup('All')}
                className={cn(
                  'rounded-lg px-2 py-0.5 text-xs font-medium transition-all',
                  params.bloodGroup === 'All'
                    ? 'bg-foreground text-background font-semibold'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                )}
              >
                All
              </button>
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBloodGroup(bg)}
                  className={cn(
                    'rounded-lg px-2 py-0.5 text-xs font-medium transition-all',
                    params.bloodGroup === bg
                      ? 'bg-rose-500 text-white font-semibold shadow-xs'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <UserCheck className="size-3 text-sky-500" />
              Gender
            </label>
            <div className="flex flex-wrap gap-1">
              {(['All', 'Female', 'Male', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={cn(
                    'rounded-lg px-2.5 py-0.5 text-xs font-medium transition-all',
                    params.gender === g
                      ? 'bg-foreground text-background font-semibold'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between sm:col-span-2 md:col-span-1">
            <div className="text-[11px] text-muted-foreground">
              Parameters are synced in real-time with URL query state.
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 text-xs pt-1">
          <span className="text-[11px] font-medium text-muted-foreground">Active:</span>
          {params.query && (
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              Keyword: "{params.query}"
              <button onClick={() => setQuery('')} className="hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          {params.status !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-medium text-sky-600 dark:text-sky-400">
              Status: {params.status}
              <button onClick={() => setStatus('All')} className="hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          {params.bloodGroup !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
              Blood: {params.bloodGroup}
              <button onClick={() => setBloodGroup('All')} className="hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          {params.gender !== 'All' && (
            <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-600 dark:text-purple-400">
              Gender: {params.gender}
              <button onClick={() => setGender('All')} className="hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-[11px] text-muted-foreground underline underline-offset-2 hover:text-foreground ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
