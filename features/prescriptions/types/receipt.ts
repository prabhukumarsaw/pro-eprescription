import { Patient } from '@/features/patients/types'

export interface HospitalConfig {
  name: string
  subtitle: string
  slogan: string
  logoInitial: string
  opdCode: string
  establishedText: string
  address: string
  phones: string
  emergencyHelplines: string
  website: string
  medicoLegalDisclaimer: string
}

export interface DoctorStampConfig {
  name: string
  qualifications: string
  speciality: string
  regnNo: string
  department: string
}

export interface RxReceiptItem {
  id: string
  drug: string
  dosage?: string
  frequency: string
  duration: string
  form?: string
  instructions?: string
  unitPrice?: number
  quantity?: number
}

export interface BillingBreakdownItem {
  id: string
  description: string
  category: 'Consultation' | 'Pharmacy' | 'Facility' | 'Diagnostics'
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ReceiptBillingData {
  receiptNumber: string
  invoiceDate: string
  paymentMethod: 'Direct Cash' | 'Health Insurance / TPA' | 'Credit / Debit Card' | 'Online UPI'
  paymentStatus: 'PAID' | 'COVERED BY TPA' | 'PENDING'
  items: BillingBreakdownItem[]
  subtotal: number
  tax: number
  insuranceDiscount: number
  totalPayable: number
  transactionRef: string
}

export interface ReceiptAuditTrail {
  authorizedAt: string
  authorizedDoctor: string
  councilRegn: string
  validUntil: string
  encounterType: string
  ehrRecordId: string
  verificationCode: string
}
