export type PatientStatus = 'Active' | 'Under Review' | 'Critical' | 'Discharged' | 'Scheduled'

export type Gender = 'Male' | 'Female' | 'Other'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export interface VitalSign {
  id: string
  date: string
  bloodPressure: string // e.g. "120/80 mmHg"
  heartRate: number // bpm
  temperature: number // °F
  spO2: number // %
  oxygenSaturation?: number // alias for spO2
  respiratoryRate: number // breaths/min
  bloodGlucose?: number // mg/dL
  bmi: number
  weightKg: number
  heightCm: number
  recordedBy: string
}

export interface PrescriptionItem {
  id: string
  medicineName: string
  dosage: string // e.g. "500mg"
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Inhaler' | 'Drops'
  frequency: string // e.g. "1-0-1 (After Meals)"
  duration: string // e.g. "7 Days"
  startDate: string
  endDate?: string
  status: 'Active' | 'Completed' | 'Discontinued'
  prescribedBy: string
  instructions: string
  refillsRemaining: number
}

export interface Allergy {
  id: string
  substance: string
  reaction: string
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Life-Threatening'
  diagnosedDate: string
}

export interface MedicalCondition {
  id: string
  code?: string // ICD-10
  name: string
  category: 'Chronic' | 'Acute' | 'Resolved'
  diagnosedDate: string
  notes?: string
}

export interface AppointmentRecord {
  id: string
  date: string
  doctorName: string
  department: string
  type: 'Regular Checkup' | 'Follow-up' | 'Emergency' | 'Consultation' | 'Lab Review'
  status: 'Completed' | 'Upcoming' | 'Cancelled'
  summary?: string
}

export interface Patient {
  id: string
  mrn: string // Medical Record Number e.g. "MRN-2026-0891"
  firstName: string
  lastName: string
  fullName: string
  avatarUrl?: string
  email: string
  phone: string
  dateOfBirth: string // YYYY-MM-DD
  age: number
  gender: Gender
  bloodGroup: BloodGroup
  status: PatientStatus
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  primaryPhysician: {
    name: string
    department: string
    email: string
  }
  lastVisitDate: string
  nextAppointmentDate?: string
  conditions: MedicalCondition[]
  allergies: Allergy[]
  vitals: VitalSign[]
  activePrescriptions: PrescriptionItem[]
  prescriptionHistory: PrescriptionItem[]
  appointments: AppointmentRecord[]
  notes?: string
  handwrittenPrescriptionCanvas?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  createdAt: string
  updatedAt: string
}

export interface PatientFilterParams {
  query?: string
  status?: PatientStatus | 'All'
  gender?: Gender | 'All'
  bloodGroup?: BloodGroup | 'All'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface PatientStats {
  totalPatients: number
  activePatients: number
  criticalPatients: number
  todayAppointments: number
  activePrescriptionsCount: number
  newThisMonth: number
}
