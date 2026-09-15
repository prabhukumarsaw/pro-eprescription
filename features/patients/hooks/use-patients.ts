'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PatientService } from '../api/patient-service'
import { PatientFilterParams, Patient } from '../types'

export const PATIENT_QUERY_KEYS = {
  all: ['patients'] as const,
  lists: () => [...PATIENT_QUERY_KEYS.all, 'list'] as const,
  list: (params: PatientFilterParams) => [...PATIENT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PATIENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PATIENT_QUERY_KEYS.details(), id] as const,
  stats: () => [...PATIENT_QUERY_KEYS.all, 'stats'] as const,
}

/**
 * Fetch filtered patients with TanStack Query
 */
export function usePatients(params: PatientFilterParams = {}) {
  return useQuery({
    queryKey: PATIENT_QUERY_KEYS.list(params),
    queryFn: () => PatientService.getPatients(params),
    staleTime: 1000 * 30, // 30s
  })
}

/**
 * Fetch single patient details
 */
export function usePatient(id: string) {
  return useQuery({
    queryKey: PATIENT_QUERY_KEYS.detail(id),
    queryFn: () => PatientService.getPatientById(id),
    enabled: !!id,
    staleTime: 1000 * 60, // 1 min
  })
}

/**
 * Fetch patient summary stats for dashboard cards
 */
export function usePatientStats() {
  return useQuery({
    queryKey: PATIENT_QUERY_KEYS.stats(),
    queryFn: () => PatientService.getStats(),
    staleTime: 1000 * 60,
  })
}

/**
 * Mutation to create patient
 */
export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Partial<Patient>) => PatientService.createPatient(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.stats() })
    },
  })
}

/**
 * Mutation to update patient
 */
export function useUpdatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Patient> }) =>
      PatientService.updatePatient(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.detail(data.id) })
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.stats() })
    },
  })
}

/**
 * Mutation to delete patient
 */
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => PatientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: PATIENT_QUERY_KEYS.stats() })
    },
  })
}
