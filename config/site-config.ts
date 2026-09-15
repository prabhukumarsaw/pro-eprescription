import hospitalData from './hospital.json'
import { HospitalConfig } from '@/features/prescriptions/types/receipt'

export interface ExtendedHospitalConfig extends HospitalConfig {
  phone: string
  telephone: string
  email: string
  opdTimings: string
}

export const siteHospitalConfig: ExtendedHospitalConfig = {
  ...hospitalData,
}

export default siteHospitalConfig
