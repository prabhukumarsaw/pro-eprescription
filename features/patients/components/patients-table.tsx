'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  RowSelectionState,
  SortingState,
  VisibilityState,
  HeaderGroup,
  Header,
  Row,
  Cell,
  OnChangeFn,
} from '@tanstack/react-table'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Trash2,
  Users,
  AlertCircle,
  Plus,
  RefreshCw,
  Columns3,
  Check,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePatients, useDeletePatient } from '../hooks/use-patients'
import { usePatientParams } from '../hooks/use-patient-params'
import { getPatientColumns } from './patient-columns'
import { Patient } from '../types'
import { cn } from '@/lib/utils'

interface PatientsTableProps {
  onAddPatientClick?: () => void
  onQuickPrescribeClick?: (patient: Patient) => void
}

export function PatientsTable({
  onAddPatientClick,
  onQuickPrescribeClick,
}: PatientsTableProps) {
  const router = useRouter()
  const { params, setPage, setPageSize, setSort, resetFilters } = usePatientParams()
  const { data: response, isLoading, isError, refetch, isFetching } = usePatients(params)
  const deleteMutation = useDeletePatient()

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [showColumnToggle, setShowColumnToggle] = React.useState(false)
  const columnToggleRef = React.useRef<HTMLDivElement>(null)

  // Close column toggle dropdown on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (columnToggleRef.current && !columnToggleRef.current.contains(e.target as Node)) {
        setShowColumnToggle(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const patients = React.useMemo(() => response?.data || [], [response?.data])
  const meta = response?.meta || {
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  }

  // Handle single patient delete with confirmation
  const handleDeletePatient = async (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete patient record for ${patient.fullName}?`)) {
      await deleteMutation.mutateAsync(patient.id)
    }
  }

  // Quick prescribe: navigate to prescribe page
  const handleQuickPrescribe = (patient: Patient) => {
    if (onQuickPrescribeClick) {
      onQuickPrescribeClick(patient)
    } else {
      router.push(`/patients/${patient.id}/prescribe`)
    }
  }

  const columns = React.useMemo(
    () =>
      getPatientColumns({
        onDelete: handleDeletePatient,
        onQuickPrescribe: handleQuickPrescribe,
      }),
    [onQuickPrescribeClick]
  )

  const sorting: SortingState = React.useMemo(() => {
    if (!params.sortBy) return []
    return [{ id: params.sortBy, desc: params.sortOrder === 'desc' }]
  }, [params.sortBy, params.sortOrder])

  const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
    const newSorting =
      typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue
    if (newSorting.length > 0) {
      setSort(newSorting[0].id, newSorting[0].desc ? 'desc' : 'asc')
    }
  }

  const table = useReactTable<Patient>({
    data: patients,
    columns,
    state: {
      rowSelection,
      sorting,
      columnVisibility,
    },
    enableRowSelection: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: meta.totalPages,
    onRowSelectionChange: setRowSelection,
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  const selectedCount = Object.keys(rowSelection).filter((k) => rowSelection[k]).length

  // Bulk Export Handler
  const handleBulkExport = () => {
    const selectedPatients = table
      .getSelectedRowModel()
      .rows.map((r: Row<Patient>) => r.original)
    const exportData = selectedPatients.length > 0 ? selectedPatients : patients
    const jsonStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonStr)
    downloadAnchor.setAttribute('download', `patients-export-${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Bulk Delete Handler
  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows
    if (selectedRows.length === 0) return
    if (window.confirm(`Delete ${selectedRows.length} selected patient records?`)) {
      for (const row of selectedRows) {
        await deleteMutation.mutateAsync(row.original.id)
      }
      setRowSelection({})
    }
  }

  return (
    <div className="flex flex-col gap-4 font-sans w-full">
      {/* Table Container Card with Apple Squircle Curves */}
      <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 shadow-sm backdrop-blur-xl transition-all">
        {/* Sub-header Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 px-4 sm:px-5 py-3.5 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              Patient Directory
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-primary border border-primary/20">
              {meta.total} Total
            </span>
            {isFetching && (
              <RefreshCw className="size-3 text-muted-foreground animate-spin ml-1" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Column Visibility Toggle */}
            <div className="relative" ref={columnToggleRef}>
              <button
                onClick={() => setShowColumnToggle(!showColumnToggle)}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-all shadow-2xs active:scale-95 whitespace-nowrap',
                  showColumnToggle
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border/60 bg-background/60 text-foreground hover:bg-muted/70'
                )}
              >
                <Columns3 className="size-3.5" />
                <span className="hidden sm:inline">Columns</span>
              </button>

              {showColumnToggle && (
                <div className="absolute right-0 top-full z-30 mt-2 min-w-[180px] rounded-2xl border border-border/80 bg-card p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in-50 slide-in-from-top-2 duration-150">
                  <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Toggle Columns
                  </p>
                  {table.getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                      <button
                        key={col.id}
                        onClick={() => col.toggleVisibility()}
                        className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-foreground hover:bg-muted/60 transition-colors"
                      >
                        <span
                          className={cn(
                            'flex size-4 shrink-0 items-center justify-center rounded-md border transition-all',
                            col.getIsVisible()
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border/70 bg-transparent'
                          )}
                        >
                          {col.getIsVisible() && <Check className="size-2.5" />}
                        </span>
                        <span className="capitalize">
                          {typeof col.columnDef.header === 'string'
                            ? col.columnDef.header
                            : col.id === 'select' ? 'Select' : col.id === 'actions' ? 'Actions' : col.id}
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={handleBulkExport}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/70 transition-all shadow-2xs active:scale-95 whitespace-nowrap"
            >
              <Download className="size-3.5 text-muted-foreground" />
              <span>Export {selectedCount > 0 ? `(${selectedCount})` : 'JSON'}</span>
            </button>

            {onAddPatientClick && (
              <button
                onClick={onAddPatientClick}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-95 whitespace-nowrap"
              >
                <Plus className="size-3.5" />
                <span>New Patient</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Responsive Table View with Smooth Apple Scrollbar */}
        <div className="w-full overflow-x-auto no-scrollbar sm:scroll-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<Patient>) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-border/50 bg-muted/40 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
                >
                  {headerGroup.headers.map((header: Header<Patient, unknown>) => (
                    <th key={header.id} className="py-3 px-3 sm:px-4 first:pl-4 sm:first:pl-5 last:pr-4 sm:last:pr-5">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-3 sm:px-4 pl-4 sm:pl-5">
                      <div className="size-4 rounded bg-muted/70" />
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-muted/70" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 rounded bg-muted/70" />
                          <div className="h-2.5 w-16 rounded bg-muted/50" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="h-3 w-20 rounded bg-muted/60" />
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="h-3 w-24 rounded bg-muted/60" />
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="h-4 w-28 rounded-lg bg-muted/60" />
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="h-5 w-16 rounded-full bg-muted/60" />
                    </td>
                    <td className="py-4 px-3 sm:px-4">
                      <div className="h-3 w-20 rounded bg-muted/60" />
                    </td>
                    <td className="py-4 px-3 sm:px-4 pr-4 sm:pr-5 text-right">
                      <div className="h-7 w-20 rounded-xl bg-muted/60 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                // Error State
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
                        <AlertCircle className="size-5" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Failed to load patient records
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="mt-2 rounded-xl bg-primary px-3 py-1.5 text-xs text-primary-foreground font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={columns.length} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-3xl bg-muted/60 text-muted-foreground">
                        <Users className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-foreground">
                          No matching patients found
                        </h4>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Try adjusting your search criteria, blood group filters, or status toggles.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={resetFilters}
                          className="rounded-xl border border-border/70 bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80 transition-all shadow-xs"
                        >
                          Clear All Filters
                        </button>
                        {onAddPatientClick && (
                          <button
                            onClick={onAddPatientClick}
                            className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
                          >
                            Add New Patient
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                // Active Patient Rows
                table.getRowModel().rows.map((row: Row<Patient>) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'group transition-colors duration-150 hover:bg-muted/40',
                      row.getIsSelected() && 'bg-primary/5 dark:bg-primary/10'
                    )}
                  >
                    {row.getVisibleCells().map((cell: Cell<Patient, unknown>) => (
                      <td key={cell.id} className="py-3 px-3 sm:px-4 first:pl-4 sm:first:pl-5 last:pr-4 sm:last:pr-5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Apple-Style Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 px-4 sm:px-5 py-3.5 bg-muted/20">
          {/* Left: Rows Per Page & Summary */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs text-muted-foreground">
            <span>
              Showing{' '}
              <strong className="text-foreground">
                {meta.total > 0 ? (meta.page - 1) * meta.pageSize + 1 : 0}
              </strong>{' '}
              to{' '}
              <strong className="text-foreground">
                {Math.min(meta.page * meta.pageSize, meta.total)}
              </strong>{' '}
              of <strong className="text-foreground">{meta.total}</strong> results
            </span>

            <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
              <span>Show</span>
              <select
                value={params.pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-lg border border-border/70 bg-card/80 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right: Apple Squircle Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(1)}
              disabled={meta.page <= 1}
              title="First Page"
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <button
              onClick={() => setPage(meta.page - 1)}
              disabled={!meta.hasPrevPage}
              title="Previous Page"
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {/* Current Page Indicator */}
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs font-semibold text-foreground">{meta.page}</span>
              <span className="text-xs text-muted-foreground">/</span>
              <span className="text-xs text-muted-foreground">{meta.totalPages}</span>
            </div>

            <button
              onClick={() => setPage(meta.page + 1)}
              disabled={!meta.hasNextPage}
              title="Next Page"
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            >
              <ChevronRight className="size-3.5" />
            </button>
            <button
              onClick={() => setPage(meta.totalPages)}
              disabled={meta.page >= meta.totalPages}
              title="Last Page"
              className="flex size-7 items-center justify-center rounded-xl border border-border/60 bg-card/60 text-muted-foreground hover:bg-muted/70 hover:text-foreground disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
            >
              <ChevronsRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Apple-Style Bulk Selection Action Bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-full border border-border/80 bg-background/95 px-4 sm:px-5 py-2.5 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5 duration-200">
          <span className="text-xs font-semibold text-foreground whitespace-nowrap">
            {selectedCount} selected
          </span>
          <div className="h-4 w-px bg-border hidden xs:block" />
          <button
            onClick={handleBulkExport}
            className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
          >
            <Download className="size-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors whitespace-nowrap"
          >
            <Trash2 className="size-3.5" />
            <span>Delete</span>
          </button>
          <button
            onClick={() => setRowSelection({})}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}
