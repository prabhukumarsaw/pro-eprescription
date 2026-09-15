'use client'

import * as React from 'react'
import { X, UserPlus, Droplet, Phone, Mail, Calendar, Sparkles } from 'lucide-react'
import { useCreatePatient } from '../hooks/use-patients'
import { Gender, BloodGroup, PatientStatus } from '../types'
import { cn } from '@/lib/utils'

interface NewPatientModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewPatientModal({ isOpen, onClose }: NewPatientModalProps) {
  const createMutation = useCreatePatient()

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '1995-05-15',
    age: 31,
    gender: 'Female' as Gender,
    bloodGroup: 'O+' as BloodGroup,
    status: 'Active' as PatientStatus,
    primaryCondition: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    notes: '',
  })

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert('Please provide both First Name and Last Name.')
      return
    }

    await createMutation.mutateAsync({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}@health.org`,
      phone: formData.phone || '+1 (555) 000-1122',
      dateOfBirth: formData.dateOfBirth,
      age: Number(formData.age) || 30,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      status: formData.status,
      conditions: formData.primaryCondition
        ? [
            {
              id: `c-${Date.now()}`,
              name: formData.primaryCondition,
              category: 'Acute',
              diagnosedDate: new Date().toISOString().split('T')[0],
            },
          ]
        : [],
      allergies: formData.allergies
        ? [
            {
              id: `al-${Date.now()}`,
              substance: formData.allergies,
              reaction: 'Moderate allergy reaction',
              severity: 'Moderate',
              diagnosedDate: new Date().toISOString().split('T')[0],
            },
          ]
        : [],
      emergencyContact: {
        name: formData.emergencyContactName || 'Family Member',
        relationship: 'Next of Kin',
        phone: formData.emergencyContactPhone || '+1 (555) 999-0000',
      },
      notes: formData.notes,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl font-sans">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-xs">
              <UserPlus className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Register New Patient</h3>
              <p className="text-xs text-muted-foreground">
                Create electronic health record & assign clinical profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="e.g. Olivia"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="e.g. Sterling"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="patient@example.com"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Age</label>
              <input
                type="number"
                min={0}
                max={120}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-2 py-2 text-xs text-foreground focus:border-primary focus:outline-none shadow-2xs"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Blood Type</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })
                }
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-2 py-2 text-xs text-foreground focus:border-primary focus:outline-none shadow-2xs"
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Primary Diagnosis / Condition</label>
              <input
                type="text"
                value={formData.primaryCondition}
                onChange={(e) => setFormData({ ...formData, primaryCondition: e.target.value })}
                placeholder="e.g. Hypertension, Asthma"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Known Allergies</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="e.g. Penicillin, Peanuts"
                className="mt-1 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/80 transition-all shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
            >
              {createMutation.isPending ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
