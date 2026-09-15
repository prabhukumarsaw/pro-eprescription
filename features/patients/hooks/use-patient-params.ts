'use client'

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'
import { PatientStatus, Gender, BloodGroup } from '../types'

export function usePatientParams() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault('').withOptions({ shallow: false, throttleMs: 300 }))
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault('All').withOptions({ shallow: false }))
  const [gender, setGender] = useQueryState('gender', parseAsString.withDefault('All').withOptions({ shallow: false }))
  const [bloodGroup, setBloodGroup] = useQueryState('blood', parseAsString.withDefault('All').withOptions({ shallow: false }))
  const [sortBy, setSortBy] = useQueryState('sort', parseAsString.withDefault('updatedAt').withOptions({ shallow: false }))
  const [sortOrder, setSortOrder] = useQueryState('order', parseAsString.withDefault('desc').withOptions({ shallow: false }))
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1).withOptions({ shallow: false }))
  const [pageSize, setPageSize] = useQueryState('size', parseAsInteger.withDefault(10).withOptions({ shallow: false }))

  const resetFilters = () => {
    setQuery('')
    setStatus('All')
    setGender('All')
    setBloodGroup('All')
    setPage(1)
  }

  return {
    params: {
      query,
      status: status as PatientStatus | 'All',
      gender: gender as Gender | 'All',
      bloodGroup: bloodGroup as BloodGroup | 'All',
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc',
      page,
      pageSize,
    },
    setQuery: (val: string) => {
      setQuery(val || null)
      setPage(1)
    },
    setStatus: (val: PatientStatus | 'All') => {
      setStatus(val === 'All' ? null : val)
      setPage(1)
    },
    setGender: (val: Gender | 'All') => {
      setGender(val === 'All' ? null : val)
      setPage(1)
    },
    setBloodGroup: (val: BloodGroup | 'All') => {
      setBloodGroup(val === 'All' ? null : val)
      setPage(1)
    },
    setSort: (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      setSortBy(newSortBy)
      setSortOrder(newSortOrder)
      setPage(1)
    },
    setPage,
    setPageSize: (newSize: number) => {
      setPageSize(newSize)
      setPage(1)
    },
    resetFilters,
  }
}
