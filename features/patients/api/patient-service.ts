import {
  Patient,
  PatientFilterParams,
  PaginatedResult,
  PatientStats,
} from '../types'

// Mock Patient Database with rich, realistic clinical records
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-101',
    mrn: 'MRN-2026-0891',
    firstName: 'Eleanor',
    lastName: 'Vance',
    fullName: 'Eleanor Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'eleanor.vance@applehealth.io',
    phone: '+1 (555) 234-8901',
    dateOfBirth: '1988-04-12',
    age: 38,
    gender: 'Female',
    bloodGroup: 'O+',
    status: 'Active',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Cupertino',
      state: 'CA',
      zipCode: '95014',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Thomas Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 234-8902',
    },
    primaryPhysician: {
      name: 'Dr. Marcus Webb',
      department: 'Cardiology',
      email: 'm.webb@medcenter.org',
    },
    lastVisitDate: '2026-09-10',
    nextAppointmentDate: '2026-09-24',
    conditions: [
      {
        id: 'c-1',
        code: 'I10',
        name: 'Essential (primary) hypertension',
        category: 'Chronic',
        diagnosedDate: '2023-05-14',
        notes: 'Well controlled with daily ACE inhibitor.',
      },
      {
        id: 'c-2',
        code: 'E11.9',
        name: 'Type 2 Diabetes Mellitus',
        category: 'Chronic',
        diagnosedDate: '2024-02-18',
        notes: 'HbA1c steady at 6.4%.',
      },
    ],
    allergies: [
      {
        id: 'al-1',
        substance: 'Penicillin G',
        reaction: 'Severe Anaphylactic urticaria',
        severity: 'Severe',
        diagnosedDate: '2019-11-03',
      },
      {
        id: 'al-2',
        substance: 'Peanuts',
        reaction: 'Mild throat itching & facial hives',
        severity: 'Moderate',
        diagnosedDate: '2010-06-20',
      },
    ],
    vitals: [
      {
        id: 'v-1',
        date: '2026-09-10T10:30:00Z',
        bloodPressure: '118/76',
        heartRate: 72,
        temperature: 98.6,
        spO2: 99,
        respiratoryRate: 16,
        bloodGlucose: 104,
        bmi: 23.4,
        weightKg: 64.5,
        heightCm: 166,
        recordedBy: 'Nurse S. Jenkins, RN',
      },
      {
        id: 'v-2',
        date: '2026-08-12T09:15:00Z',
        bloodPressure: '124/82',
        heartRate: 78,
        temperature: 98.4,
        spO2: 98,
        respiratoryRate: 15,
        bloodGlucose: 112,
        bmi: 23.6,
        weightKg: 65.0,
        heightCm: 166,
        recordedBy: 'Nurse R. Alvarez, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-1',
        medicineName: 'Lisinopril',
        dosage: '10mg',
        form: 'Tablet',
        frequency: '1-0-0 (Morning with water)',
        duration: '90 Days',
        startDate: '2026-08-01',
        endDate: '2026-10-30',
        status: 'Active',
        prescribedBy: 'Dr. Marcus Webb',
        instructions: 'Take 1 tablet every morning on an empty stomach. Monitor BP weekly.',
        refillsRemaining: 2,
      },
      {
        id: 'rx-2',
        medicineName: 'Metformin Hydrochloride ER',
        dosage: '500mg',
        form: 'Tablet',
        frequency: '1-0-1 (With dinner)',
        duration: '60 Days',
        startDate: '2026-08-15',
        endDate: '2026-10-15',
        status: 'Active',
        prescribedBy: 'Dr. Marcus Webb',
        instructions: 'Take with evening meal to prevent GI upset.',
        refillsRemaining: 3,
      },
    ],
    prescriptionHistory: [
      {
        id: 'rx-old-1',
        medicineName: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        form: 'Capsule',
        frequency: '1-1-1 (8 hourly)',
        duration: '7 Days',
        startDate: '2025-12-05',
        endDate: '2025-12-12',
        status: 'Completed',
        prescribedBy: 'Dr. Sarah Connor',
        instructions: 'Finished standard course for bacterial pharyngitis.',
        refillsRemaining: 0,
      },
    ],
    appointments: [
      {
        id: 'apt-1',
        date: '2026-09-24T14:00:00Z',
        doctorName: 'Dr. Marcus Webb',
        department: 'Cardiology',
        type: 'Follow-up',
        status: 'Upcoming',
        summary: 'Review quarterly BP trends and lipid panel results.',
      },
      {
        id: 'apt-2',
        date: '2026-09-10T10:30:00Z',
        doctorName: 'Dr. Marcus Webb',
        department: 'Cardiology',
        type: 'Regular Checkup',
        status: 'Completed',
        summary: 'Blood pressure is normalized. Continued Lisinopril dosage without modification.',
      },
    ],
    notes: 'Patient reports increased physical activity (4x 45-min walks weekly).',
    insuranceProvider: 'Blue Shield Platinum Premier',
    insurancePolicyNumber: 'BS-8902348-CA',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'pat-102',
    mrn: 'MRN-2026-0742',
    firstName: 'Alexander',
    lastName: 'Chen',
    fullName: 'Alexander Chen',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'alexander.chen@techmed.org',
    phone: '+1 (555) 442-9981',
    dateOfBirth: '1979-11-28',
    age: 46,
    gender: 'Male',
    bloodGroup: 'A+',
    status: 'Critical',
    address: {
      street: '104 Infinity Loop Suite 300',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95129',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Grace Chen',
      relationship: 'Sister',
      phone: '+1 (555) 442-9983',
    },
    primaryPhysician: {
      name: 'Dr. Liam Sterling',
      department: 'Pulmonology & Critical Care',
      email: 'l.sterling@medcenter.org',
    },
    lastVisitDate: '2026-09-14',
    nextAppointmentDate: '2026-09-18',
    conditions: [
      {
        id: 'c-3',
        code: 'J44.1',
        name: 'Chronic Obstructive Pulmonary Disease (COPD) with exacerbation',
        category: 'Chronic',
        diagnosedDate: '2021-08-10',
        notes: 'Severe wheezing and dyspnea during physical exertion.',
      },
      {
        id: 'c-4',
        code: 'I48.91',
        name: 'Unspecified Atrial Fibrillation',
        category: 'Chronic',
        diagnosedDate: '2025-04-12',
      },
    ],
    allergies: [
      {
        id: 'al-3',
        substance: 'Sulfa Drugs (Sulfamethoxazole)',
        reaction: 'Severe skin rash & Stevens-Johnson risk',
        severity: 'Severe',
        diagnosedDate: '2018-03-12',
      },
    ],
    vitals: [
      {
        id: 'v-3',
        date: '2026-09-14T08:20:00Z',
        bloodPressure: '148/96',
        heartRate: 98,
        temperature: 99.8,
        spO2: 91,
        respiratoryRate: 24,
        bloodGlucose: 138,
        bmi: 27.8,
        weightKg: 84.0,
        heightCm: 174,
        recordedBy: 'Nurse D. Zhao, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-3',
        medicineName: 'Albuterol / Ipratropium Inhaler',
        dosage: '90mcg/18mcg',
        form: 'Inhaler',
        frequency: '2 puffs every 4-6 hrs as needed',
        duration: '30 Days',
        startDate: '2026-09-14',
        endDate: '2026-10-14',
        status: 'Active',
        prescribedBy: 'Dr. Liam Sterling',
        instructions: 'Rinse mouth after use. Seek emergency care if SpO2 drops below 90%.',
        refillsRemaining: 4,
      },
      {
        id: 'rx-4',
        medicineName: 'Prednisone',
        dosage: '20mg',
        form: 'Tablet',
        frequency: '1-0-0 (Morning with breakfast)',
        duration: '5 Days Taper',
        startDate: '2026-09-14',
        endDate: '2026-09-19',
        status: 'Active',
        prescribedBy: 'Dr. Liam Sterling',
        instructions: 'Short-course steroid burst for acute flare-up.',
        refillsRemaining: 0,
      },
    ],
    prescriptionHistory: [],
    appointments: [
      {
        id: 'apt-3',
        date: '2026-09-18T09:00:00Z',
        doctorName: 'Dr. Liam Sterling',
        department: 'Pulmonology',
        type: 'Emergency',
        status: 'Upcoming',
        summary: 'Urgent follow-up for post-exacerbation spirometry evaluation.',
      },
    ],
    notes: 'Requires continuous pulse oximetry monitoring at home.',
    insuranceProvider: 'Kaiser Permanente Senior Advantage',
    insurancePolicyNumber: 'KP-9901124-CA',
    createdAt: '2023-09-15T09:00:00Z',
    updatedAt: '2026-09-14T14:30:00Z',
  },
  {
    id: 'pat-103',
    mrn: 'MRN-2026-0419',
    firstName: 'Sophia',
    lastName: 'Rodriguez',
    fullName: 'Sophia Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'sophia.rodriguez@clinics.org',
    phone: '+1 (555) 781-3320',
    dateOfBirth: '1995-07-03',
    age: 31,
    gender: 'Female',
    bloodGroup: 'B+',
    status: 'Active',
    address: {
      street: '512 Santana Row Apt 4B',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95128',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Carlos Rodriguez',
      relationship: 'Father',
      phone: '+1 (555) 781-3329',
    },
    primaryPhysician: {
      name: 'Dr. Elena Rostova',
      department: 'Obstetrics & Gynecology',
      email: 'e.rostova@medcenter.org',
    },
    lastVisitDate: '2026-09-02',
    nextAppointmentDate: '2026-10-02',
    conditions: [
      {
        id: 'c-5',
        name: 'Pregnancy 24 Weeks Gestation',
        category: 'Acute',
        diagnosedDate: '2026-04-10',
        notes: 'Routine low-risk prenatal tracking.',
      },
    ],
    allergies: [],
    vitals: [
      {
        id: 'v-4',
        date: '2026-09-02T11:00:00Z',
        bloodPressure: '110/70',
        heartRate: 76,
        temperature: 98.6,
        spO2: 100,
        respiratoryRate: 16,
        bloodGlucose: 89,
        bmi: 24.1,
        weightKg: 62.0,
        heightCm: 160,
        recordedBy: 'Nurse A. Martinez, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-5',
        medicineName: 'Prenatal Multivitamin with DHA & Folic Acid',
        dosage: '800mcg',
        form: 'Capsule',
        frequency: '0-1-0 (After lunch)',
        duration: '180 Days',
        startDate: '2026-04-15',
        endDate: '2026-10-15',
        status: 'Active',
        prescribedBy: 'Dr. Elena Rostova',
        instructions: 'Daily nutritional support.',
        refillsRemaining: 3,
      },
    ],
    prescriptionHistory: [],
    appointments: [
      {
        id: 'apt-4',
        date: '2026-10-02T11:30:00Z',
        doctorName: 'Dr. Elena Rostova',
        department: 'Obstetrics',
        type: 'Regular Checkup',
        status: 'Upcoming',
        summary: '28-week glucose tolerance test and anatomy check.',
      },
    ],
    insuranceProvider: 'Anthem Blue Cross PPO',
    insurancePolicyNumber: 'ANT-5671192-CA',
    createdAt: '2024-05-18T10:00:00Z',
    updatedAt: '2026-09-02T12:00:00Z',
  },
  {
    id: 'pat-104',
    mrn: 'MRN-2026-0311',
    firstName: 'Julian',
    lastName: 'Blackwood',
    fullName: 'Julian Blackwood',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'j.blackwood@nexus.io',
    phone: '+1 (555) 612-4490',
    dateOfBirth: '1962-01-19',
    age: 64,
    gender: 'Male',
    bloodGroup: 'AB-',
    status: 'Under Review',
    address: {
      street: '188 Mission St Penthouse',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Victoria Blackwood',
      relationship: 'Spouse',
      phone: '+1 (555) 612-4495',
    },
    primaryPhysician: {
      name: 'Dr. Raymond Holt',
      department: 'Orthopedics & Sports Medicine',
      email: 'r.holt@medcenter.org',
    },
    lastVisitDate: '2026-08-28',
    nextAppointmentDate: '2026-09-29',
    conditions: [
      {
        id: 'c-6',
        code: 'M17.11',
        name: 'Unilateral primary osteoarthritis, right knee',
        category: 'Chronic',
        diagnosedDate: '2022-09-15',
        notes: 'Post-arthroscopy recovery phase.',
      },
    ],
    allergies: [
      {
        id: 'al-4',
        substance: 'Aspirin (NSAIDs)',
        reaction: 'Gastric hemorrhage and bronchospasm',
        severity: 'Severe',
        diagnosedDate: '2015-04-09',
      },
    ],
    vitals: [
      {
        id: 'v-5',
        date: '2026-08-28T14:00:00Z',
        bloodPressure: '128/84',
        heartRate: 68,
        temperature: 98.7,
        spO2: 98,
        respiratoryRate: 14,
        bmi: 25.2,
        weightKg: 78.5,
        heightCm: 176,
        recordedBy: 'Nurse T. Brooks, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-6',
        medicineName: 'Celecoxib',
        dosage: '100mg',
        form: 'Capsule',
        frequency: '1-0-1 (With meals)',
        duration: '30 Days',
        startDate: '2026-08-28',
        endDate: '2026-09-28',
        status: 'Active',
        prescribedBy: 'Dr. Raymond Holt',
        instructions: 'Selective COX-2 inhibitor for knee joint pain.',
        refillsRemaining: 1,
      },
    ],
    prescriptionHistory: [],
    appointments: [
      {
        id: 'apt-5',
        date: '2026-09-29T15:00:00Z',
        doctorName: 'Dr. Raymond Holt',
        department: 'Orthopedics',
        type: 'Follow-up',
        status: 'Upcoming',
        summary: 'Evaluate post-op mobility and physical therapy range-of-motion.',
      },
    ],
    insuranceProvider: 'UnitedHealthcare Choice Plus',
    insurancePolicyNumber: 'UHC-1099238-CA',
    createdAt: '2023-01-12T11:00:00Z',
    updatedAt: '2026-08-28T16:00:00Z',
  },
  {
    id: 'pat-105',
    mrn: 'MRN-2026-0922',
    firstName: 'Amara',
    lastName: 'Okonkwo',
    fullName: 'Amara Okonkwo',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    email: 'amara.okonkwo@healthsync.com',
    phone: '+1 (555) 902-1144',
    dateOfBirth: '1991-10-05',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O-',
    status: 'Scheduled',
    address: {
      street: '220 Palo Alto Ave',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Kofi Okonkwo',
      relationship: 'Brother',
      phone: '+1 (555) 902-1149',
    },
    primaryPhysician: {
      name: 'Dr. Maya Lin',
      department: 'Dermatology',
      email: 'm.lin@medcenter.org',
    },
    lastVisitDate: '2026-07-22',
    nextAppointmentDate: '2026-09-20',
    conditions: [
      {
        id: 'c-7',
        code: 'L40.0',
        name: 'Psoriasis Vulgaris',
        category: 'Chronic',
        diagnosedDate: '2020-05-19',
      },
    ],
    allergies: [],
    vitals: [
      {
        id: 'v-6',
        date: '2026-07-22T09:45:00Z',
        bloodPressure: '116/74',
        heartRate: 70,
        temperature: 98.4,
        spO2: 99,
        respiratoryRate: 15,
        bmi: 22.0,
        weightKg: 58.0,
        heightCm: 162,
        recordedBy: 'Nurse L. Gomez, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-7',
        medicineName: 'Clobetasol Propionate 0.05% Topical Foam',
        dosage: '100g canister',
        form: 'Drops',
        frequency: 'Apply thin layer twice daily',
        duration: '14 Days',
        startDate: '2026-07-22',
        endDate: '2026-08-05',
        status: 'Completed',
        prescribedBy: 'Dr. Maya Lin',
        instructions: 'Apply to affected plaque areas only.',
        refillsRemaining: 1,
      },
    ],
    prescriptionHistory: [],
    appointments: [
      {
        id: 'apt-6',
        date: '2026-09-20T10:00:00Z',
        doctorName: 'Dr. Maya Lin',
        department: 'Dermatology',
        type: 'Consultation',
        status: 'Upcoming',
        summary: 'Evaluation of biologic therapy response.',
      },
    ],
    insuranceProvider: 'Cigna Open Access Plus',
    insurancePolicyNumber: 'CIG-8839201-CA',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2026-07-22T10:00:00Z',
  },
  {
    id: 'pat-106',
    mrn: 'MRN-2026-0105',
    firstName: 'Mateo',
    lastName: 'Silva',
    fullName: 'Mateo Silva',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    email: 'mateo.silva@biolabs.com',
    phone: '+1 (555) 338-7712',
    dateOfBirth: '2001-03-14',
    age: 25,
    gender: 'Male',
    bloodGroup: 'A-',
    status: 'Discharged',
    address: {
      street: '880 Castro Street',
      city: 'Mountain View',
      state: 'CA',
      zipCode: '94041',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Lucia Silva',
      relationship: 'Mother',
      phone: '+1 (555) 338-7719',
    },
    primaryPhysician: {
      name: 'Dr. Marcus Webb',
      department: 'General Medicine',
      email: 'm.webb@medcenter.org',
    },
    lastVisitDate: '2026-08-10',
    conditions: [
      {
        id: 'c-8',
        name: 'Acute Appendicitis - Post Laparoscopic Appendectomy',
        category: 'Resolved',
        diagnosedDate: '2026-07-28',
      },
    ],
    allergies: [
      {
        id: 'al-5',
        substance: 'Latex',
        reaction: 'Contact dermatitis & swelling',
        severity: 'Moderate',
        diagnosedDate: '2019-02-11',
      },
    ],
    vitals: [
      {
        id: 'v-7',
        date: '2026-08-10T11:00:00Z',
        bloodPressure: '120/78',
        heartRate: 74,
        temperature: 98.6,
        spO2: 99,
        respiratoryRate: 16,
        bmi: 22.8,
        weightKg: 70.0,
        heightCm: 175,
        recordedBy: 'Nurse K. Patel, RN',
      },
    ],
    activePrescriptions: [],
    prescriptionHistory: [
      {
        id: 'rx-8',
        medicineName: 'Cephalexin',
        dosage: '500mg',
        form: 'Capsule',
        frequency: '1-0-1 (Every 12 hrs)',
        duration: '7 Days',
        startDate: '2026-07-29',
        endDate: '2026-08-05',
        status: 'Completed',
        prescribedBy: 'Dr. Marcus Webb',
        instructions: 'Post-op prophylactic antibiotics.',
        refillsRemaining: 0,
      },
    ],
    appointments: [],
    insuranceProvider: 'Aetna Open Choice',
    insurancePolicyNumber: 'AET-4019283-CA',
    createdAt: '2026-07-28T14:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'pat-107',
    mrn: 'MRN-2026-1180',
    firstName: 'Dr. Clara',
    lastName: 'Oswald',
    fullName: 'Dr. Clara Oswald',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'clara.oswald@academichealth.edu',
    phone: '+1 (555) 774-1290',
    dateOfBirth: '1986-12-01',
    age: 39,
    gender: 'Female',
    bloodGroup: 'O+',
    status: 'Active',
    address: {
      street: '430 University Ave',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94301',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Arthur Oswald',
      relationship: 'Brother',
      phone: '+1 (555) 774-1299',
    },
    primaryPhysician: {
      name: 'Dr. Marcus Webb',
      department: 'Cardiology',
      email: 'm.webb@medcenter.org',
    },
    lastVisitDate: '2026-09-12',
    nextAppointmentDate: '2026-10-12',
    conditions: [
      {
        id: 'c-9',
        code: 'G43.909',
        name: 'Migraine without aura, not intractable',
        category: 'Chronic',
        diagnosedDate: '2021-04-14',
      },
    ],
    allergies: [],
    vitals: [
      {
        id: 'v-8',
        date: '2026-09-12T15:30:00Z',
        bloodPressure: '115/72',
        heartRate: 64,
        temperature: 98.5,
        spO2: 100,
        respiratoryRate: 14,
        bmi: 21.5,
        weightKg: 56.5,
        heightCm: 162,
        recordedBy: 'Nurse S. Jenkins, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-9',
        medicineName: 'Sumatriptan Succinate',
        dosage: '50mg',
        form: 'Tablet',
        frequency: '1 tablet at migraine onset',
        duration: 'As needed (Max 2/day)',
        startDate: '2026-06-01',
        endDate: '2026-12-01',
        status: 'Active',
        prescribedBy: 'Dr. Marcus Webb',
        instructions: 'Take immediately with water at first sign of migraine aura/headache.',
        refillsRemaining: 5,
      },
    ],
    prescriptionHistory: [],
    appointments: [],
    insuranceProvider: 'Blue Shield of California',
    insurancePolicyNumber: 'BS-9918231-CA',
    createdAt: '2024-02-11T09:00:00Z',
    updatedAt: '2026-09-12T16:00:00Z',
  },
  {
    id: 'pat-108',
    mrn: 'MRN-2026-1492',
    firstName: 'Devon',
    lastName: 'Kaufman',
    fullName: 'Devon Kaufman',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'devon.kaufman@quantum.org',
    phone: '+1 (555) 890-3411',
    dateOfBirth: '1974-06-25',
    age: 52,
    gender: 'Male',
    bloodGroup: 'B-',
    status: 'Active',
    address: {
      street: '910 Santana Heights',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95128',
      country: 'United States',
    },
    emergencyContact: {
      name: 'Sarah Kaufman',
      relationship: 'Spouse',
      phone: '+1 (555) 890-3419',
    },
    primaryPhysician: {
      name: 'Dr. Liam Sterling',
      department: 'Endocrinology',
      email: 'l.sterling@medcenter.org',
    },
    lastVisitDate: '2026-09-08',
    conditions: [
      {
        id: 'c-10',
        code: 'E03.9',
        name: 'Hypothyroidism, unspecified',
        category: 'Chronic',
        diagnosedDate: '2019-10-10',
      },
    ],
    allergies: [],
    vitals: [
      {
        id: 'v-9',
        date: '2026-09-08T10:00:00Z',
        bloodPressure: '122/80',
        heartRate: 72,
        temperature: 98.6,
        spO2: 99,
        respiratoryRate: 15,
        bmi: 24.8,
        weightKg: 75.0,
        heightCm: 174,
        recordedBy: 'Nurse R. Alvarez, RN',
      },
    ],
    activePrescriptions: [
      {
        id: 'rx-10',
        medicineName: 'Levothyroxine Sodium',
        dosage: '75mcg',
        form: 'Tablet',
        frequency: '1-0-0 (30 mins before breakfast)',
        duration: '90 Days',
        startDate: '2026-07-01',
        endDate: '2026-10-01',
        status: 'Active',
        prescribedBy: 'Dr. Liam Sterling',
        instructions: 'Take with a full glass of water on an empty stomach.',
        refillsRemaining: 2,
      },
    ],
    prescriptionHistory: [],
    appointments: [],
    insuranceProvider: 'United Healthcare',
    insurancePolicyNumber: 'UHC-4401928-CA',
    createdAt: '2023-04-18T10:00:00Z',
    updatedAt: '2026-09-08T11:00:00Z',
  },
]

// In-memory persistent state (simulating real backend database)
let patientStore: Patient[] = [...INITIAL_PATIENTS]

/**
 * Standard API Client Service Layer
 * Designed to cleanly swap with fetch() / axios / GraphQL queries in production.
 */
export const PatientService = {
  /**
   * Fetch paginated & filtered list of patients
   */
  async getPatients(params: PatientFilterParams = {}): Promise<PaginatedResult<Patient>> {
    // Simulate natural micro network latency
    await new Promise((resolve) => setTimeout(resolve, 200))

    const {
      query = '',
      status = 'All',
      gender = 'All',
      bloodGroup = 'All',
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      page = 1,
      pageSize = 10,
    } = params

    let filtered = [...patientStore]

    // Text search matching name, MRN, email, phone, conditions
    if (query.trim()) {
      const q = query.toLowerCase().trim()
      filtered = filtered.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.conditions.some((c) => c.name.toLowerCase().includes(q))
      )
    }

    // Status filter
    if (status && status !== 'All') {
      filtered = filtered.filter((p) => p.status === status)
    }

    // Gender filter
    if (gender && gender !== 'All') {
      filtered = filtered.filter((p) => p.gender === gender)
    }

    // Blood Group filter
    if (bloodGroup && bloodGroup !== 'All') {
      filtered = filtered.filter((p) => p.bloodGroup === bloodGroup)
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA: any = (a as any)[sortBy]
      let valB: any = (b as any)[sortBy]

      if (sortBy === 'fullName' || sortBy === 'lastName') {
        valA = a.fullName.toLowerCase()
        valB = b.fullName.toLowerCase()
      } else if (sortBy === 'lastVisitDate' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA || 0).getTime()
        valB = new Date(valB || 0).getTime()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    // Pagination
    const total = filtered.length
    const totalPages = Math.ceil(total / pageSize) || 1
    const currentPage = Math.max(1, Math.min(page, totalPages))
    const startIndex = (currentPage - 1) * pageSize
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize)

    return {
      data: paginatedData,
      meta: {
        total,
        page: currentPage,
        pageSize,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    }
  },

  /**
   * Get single patient by ID or MRN
   */
  async getPatientById(id: string): Promise<Patient | null> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const patient = patientStore.find(
      (p) => p.id === id || p.mrn.toLowerCase() === id.toLowerCase()
    )
    return patient ? JSON.parse(JSON.stringify(patient)) : null
  },

  /**
   * Calculate high-level summary KPIs / Statistics
   */
  async getStats(): Promise<PatientStats> {
    await new Promise((resolve) => setTimeout(resolve, 120))
    const totalPatients = patientStore.length
    const activePatients = patientStore.filter((p) => p.status === 'Active').length
    const criticalPatients = patientStore.filter((p) => p.status === 'Critical').length
    const todayAppointments = patientStore.filter((p) =>
      p.appointments.some((a) => a.status === 'Upcoming')
    ).length
    const activePrescriptionsCount = patientStore.reduce(
      (acc, p) => acc + (p.activePrescriptions?.length || 0),
      0
    )

    return {
      totalPatients,
      activePatients,
      criticalPatients,
      todayAppointments,
      activePrescriptionsCount,
      newThisMonth: 3,
    }
  },

  /**
   * Create a new patient record
   */
  async createPatient(payload: Partial<Patient>): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const id = `pat-${Date.now().toString().slice(-4)}`
    const mrn = `MRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'New Patient'

    const newPatient: Patient = {
      id,
      mrn,
      firstName: payload.firstName || 'Unknown',
      lastName: payload.lastName || 'Patient',
      fullName,
      email: payload.email || `${id}@patients.health`,
      phone: payload.phone || '+1 (555) 000-0000',
      dateOfBirth: payload.dateOfBirth || '1990-01-01',
      age: payload.age || 35,
      gender: payload.gender || 'Other',
      bloodGroup: payload.bloodGroup || 'O+',
      status: payload.status || 'Active',
      address: payload.address || {
        street: '100 Medical Plaza',
        city: 'Cupertino',
        state: 'CA',
        zipCode: '95014',
        country: 'United States',
      },
      emergencyContact: payload.emergencyContact || {
        name: 'Emergency Contact',
        relationship: 'Family',
        phone: '+1 (555) 111-2222',
      },
      primaryPhysician: payload.primaryPhysician || {
        name: 'Dr. Marcus Webb',
        department: 'General Practice',
        email: 'm.webb@medcenter.org',
      },
      lastVisitDate: new Date().toISOString().split('T')[0],
      conditions: payload.conditions || [],
      allergies: payload.allergies || [],
      vitals: payload.vitals || [
        {
          id: `v-${Date.now()}`,
          date: new Date().toISOString(),
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 98.6,
          spO2: 99,
          respiratoryRate: 16,
          bmi: 22.5,
          weightKg: 68,
          heightCm: 172,
          recordedBy: 'Clinical Triage System',
        },
      ],
      activePrescriptions: payload.activePrescriptions || [],
      prescriptionHistory: [],
      appointments: payload.appointments || [],
      notes: payload.notes || 'Newly registered patient file.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    patientStore.unshift(newPatient)
    return newPatient
  },

  /**
   * Update an existing patient record
   */
  async updatePatient(id: string, payload: Partial<Patient>): Promise<Patient> {
    await new Promise((resolve) => setTimeout(resolve, 250))
    const index = patientStore.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Patient with ID ${id} not found.`)
    }

    const current = patientStore[index]
    const updated: Patient = {
      ...current,
      ...payload,
      updatedAt: new Date().toISOString(),
    }
    patientStore[index] = updated
    return updated
  },

  /**
   * Delete a patient record
   */
  async deletePatient(id: string): Promise<{ success: boolean }> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    patientStore = patientStore.filter((p) => p.id !== id)
    return { success: true }
  },
}
