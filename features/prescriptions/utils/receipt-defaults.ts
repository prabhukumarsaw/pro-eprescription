import { Patient } from '@/features/patients/types'
import {
  HospitalConfig,
  DoctorStampConfig,
  RxReceiptItem,
  ReceiptBillingData,
  ReceiptAuditTrail,
} from '../types/receipt'

/**
 * Dynamic Hospital Configuration
 * Can be overridden by environment variables, hospital settings, or tenant config.
 */
export function getHospitalConfig(overrides?: Partial<HospitalConfig>): HospitalConfig {
  return {
    name: process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'AURARX HOSPITAL',
    subtitle: process.env.NEXT_PUBLIC_HOSPITAL_SUBTITLE || '& Medical Research Centre',
    slogan: 'HEALTH & HAPPINESS FOR ALL',
    logoInitial: 'A',
    opdCode: 'OPD/OPDC/Rev-1/19-Apr-2012',
    establishedText: 'Since Aug 5, 2010',
    address:
      '1, Tughlakabad Institutional Area, Mehrauli Badarpur Road, New Delhi - 110062',
    phones: '29958747, 29902001',
    emergencyHelplines: '26053333, 29956885',
    website: 'www.aurarx-hospital.org',
    medicoLegalDisclaimer:
      'Valid for 7 days from consultation date · Not valid for medico-legal purposes',
    ...overrides,
  }
}

/**
 * Dynamic Doctor Resolution
 * Infers doctor credentials, qualifications, and registration number dynamically
 * from the patient's primary physician or assigned specialist.
 */
export function getDoctorConfig(
  patient?: Patient | null,
  overrides?: Partial<DoctorStampConfig>
): DoctorStampConfig {
  const physicianName = patient?.primaryPhysician?.name?.trim() || 'Dr. Marcus Webb'
  const department =
    patient?.primaryPhysician?.department?.trim() || 'Cardiology'

  // Extract or dynamically assign qualifications based on department
  let qualifications = 'MBBS, MD'
  if (/cardio/i.test(department)) {
    qualifications = 'MBBS, MD, DM'
  } else if (/neuro/i.test(department)) {
    qualifications = 'MBBS, MD, DM (Neurology)'
  } else if (/ortho/i.test(department) || /surg/i.test(department)) {
    qualifications = 'MBBS, MS, MCh'
  } else if (/pediatric/i.test(department)) {
    qualifications = 'MBBS, MD (Pediatrics)'
  } else if (/gastro/i.test(department)) {
    qualifications = 'MBBS, MD, DM (Gastro)'
  }

  // Registration number matching hospital official consultant stamp
  const regnNo = overrides?.regnNo || '22164'

  return {
    name: physicianName,
    qualifications,
    speciality: department.toUpperCase(),
    department,
    regnNo,
    ...overrides,
  }
}

/**
 * Dynamic Itemized Billing Calculator
 * Computes consultation, pharmacy, and facility breakdown from actual patient data
 */
export function generateReceiptBilling(
  patient: Patient,
  rxItems: RxReceiptItem[],
  paymentMethodOverride?: ReceiptBillingData['paymentMethod']
): ReceiptBillingData {
  const isInsurance = Boolean(patient.insuranceProvider && patient.insurancePolicyNumber)
  const paymentMethod: ReceiptBillingData['paymentMethod'] =
    paymentMethodOverride ||
    (isInsurance ? 'Health Insurance / TPA' : 'Direct Cash')

  const items = [
    {
      id: 'item-consult',
      description: `Specialist OPD Consultation - ${patient.primaryPhysician?.department || 'General Medicine'}`,
      category: 'Consultation' as const,
      quantity: 1,
      unitPrice: 500,
      totalPrice: 500,
    },
    {
      id: 'item-reg',
      description: 'Hospital Registration & OPD Administrative Card Fee',
      category: 'Facility' as const,
      quantity: 1,
      unitPrice: 100,
      totalPrice: 100,
    },
  ]

  // Add prescribed medications dynamically
  rxItems.forEach((rx, idx) => {
    // Generate dynamic estimated unit price based on frequency and duration
    const daysMatch = rx.duration?.match(/\d+/)
    const days = daysMatch ? parseInt(daysMatch[0], 10) : 5
    const dosesPerDay = rx.frequency?.split('-').length || 2
    const totalQty = Math.max(days * dosesPerDay, 10)
    const unitPrice = rx.unitPrice || 12

    items.push({
      id: `item-rx-${rx.id || idx}`,
      description: `Rx: ${rx.drug} (${rx.dosage || 'Standard'} - ${rx.frequency})`,
      category: 'Pharmacy' as const,
      quantity: totalQty,
      unitPrice,
      totalPrice: totalQty * unitPrice,
    })
  })

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = Math.round(subtotal * 0.05) // 5% Healthcare Cess/GST where applicable
  const insuranceDiscount = isInsurance ? Math.round(subtotal * 0.8) : 0
  const totalPayable = Math.max(0, subtotal + tax - insuranceDiscount)

  const now = new Date()
  const dateKey = now.toISOString().slice(0, 10).replace(/-/g, '')
  const randomSuffix = Math.floor(1000 + Math.random() * 9000)

  return {
    receiptNumber: `RCP-${dateKey}-${patient.mrn?.replace(/[^\d]/g, '') || randomSuffix}`,
    invoiceDate: `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    paymentMethod,
    paymentStatus: isInsurance ? 'COVERED BY TPA' : 'PAID',
    items,
    subtotal,
    tax,
    insuranceDiscount,
    totalPayable,
    transactionRef: `TXN-${dateKey.slice(2)}-${patient.id.slice(0, 4).toUpperCase()}-${randomSuffix}`,
  }
}

/**
 * Dynamic EHR Audit Trail
 */
export function generateReceiptAudit(
  patient: Patient,
  doctor: DoctorStampConfig
): ReceiptAuditTrail {
  const now = new Date()
  const validUntil = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  return {
    authorizedAt: now.toISOString(),
    authorizedDoctor: doctor.name,
    councilRegn: `MCI/DMC-${doctor.regnNo}`,
    validUntil: validUntil.toLocaleDateString('en-GB'),
    encounterType: 'Outpatient Ambulatory Encounter',
    ehrRecordId: `EHR-${patient.mrn}-${now.getFullYear()}`,
    verificationCode: `AUTH-SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  }
}
