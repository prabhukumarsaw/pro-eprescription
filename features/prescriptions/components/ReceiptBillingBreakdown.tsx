'use client'

import * as React from 'react'
import { Patient } from '@/features/patients/types'
import {
  ReceiptBillingData,
  HospitalConfig,
  DoctorStampConfig,
} from '../types/receipt'
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  FileCheck,
  ShieldAlert,
  Building,
  QrCode,
  Barcode,
} from 'lucide-react'

export interface ReceiptBillingBreakdownProps {
  patient: Patient
  billing: ReceiptBillingData
  hospital: HospitalConfig
  doctor: DoctorStampConfig
}

export function ReceiptBillingBreakdown({
  patient,
  billing,
  hospital,
  doctor,
}: ReceiptBillingBreakdownProps) {
  return (
    <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden text-slate-800 dark:text-slate-200">
      {/* ── Invoice Header ── */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 rounded-md bg-rose-600 text-white flex items-center justify-center font-black font-serif text-xs">
              {hospital.logoInitial}
            </div>
            <h2 className="text-xl font-bold tracking-tight">{hospital.name}</h2>
          </div>
          <p className="text-xs text-slate-400">{hospital.subtitle}</p>
          <p className="text-[11px] text-slate-400 mt-1 max-w-md">{hospital.address}</p>
        </div>

        <div className="text-left sm:text-right bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
            Official Invoice / Receipt
          </span>
          <p className="text-sm font-mono font-bold text-sky-400">{billing.receiptNumber}</p>
          <p className="text-[11px] text-slate-300 mt-0.5">{billing.invoiceDate}</p>
        </div>
      </div>

      {/* ── Bill-To & Doctor Meta Grid ── */}
      <div className="p-6 border-b border-slate-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        <div>
          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
            Billed Patient
          </span>
          <p className="font-bold text-base text-slate-900 dark:text-white uppercase">
            {patient.fullName}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            MRN: <strong className="font-mono text-sky-600">{patient.mrn}</strong> · {patient.age} Y / {patient.gender}
          </p>
          <p className="text-slate-600 dark:text-slate-400">Phone: {patient.phone}</p>
          <p className="text-slate-500 truncate mt-0.5">
            {patient.address.street}, {patient.address.city}, {patient.address.state}
          </p>
        </div>

        <div className="sm:text-right">
          <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
            Consulting Physician
          </span>
          <p className="font-bold text-sm text-slate-900 dark:text-white">{doctor.name}</p>
          <p className="text-slate-600 dark:text-slate-400">
            {doctor.qualifications} · {doctor.speciality}
          </p>
          <p className="text-blue-600 dark:text-sky-400 font-mono text-[11px]">
            Regn No: {doctor.regnNo}
          </p>
          {patient.insuranceProvider && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-medium text-[11px]">
              <CheckCircle2 className="size-3" />
              <span>Sponsor: {patient.insuranceProvider} ({patient.insurancePolicyNumber || 'Covered'})</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Itemized Line Items Table ── */}
      <div className="p-6">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Receipt className="size-4 text-sky-600" />
          <span>Itemized Pharmacy &amp; Services Breakdown</span>
        </h3>

        <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-zinc-800">
                <th className="p-3 w-10">#</th>
                <th className="p-3">Item Description</th>
                <th className="p-3 w-28">Category</th>
                <th className="p-3 w-20 text-center">Qty</th>
                <th className="p-3 w-24 text-right">Unit Price</th>
                <th className="p-3 w-24 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800">
              {billing.items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                  <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {item.description}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.category === 'Consultation'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                          : item.category === 'Pharmacy'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono">{item.quantity}</td>
                  <td className="p-3 text-right font-mono">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Financial Summary ── */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start gap-6">
          {/* Payment Status & Security Badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                <span>Status: {billing.paymentStatus}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium">
                via {billing.paymentMethod}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 text-[11px] space-y-1 max-w-sm">
              <p className="font-mono text-slate-600 dark:text-slate-400">
                Transaction Ref: <strong>{billing.transactionRef}</strong>
              </p>
              <p className="text-slate-500">
                Authorized for hospital pharmacy dispensing and cashless TPA settlement claim.
              </p>
            </div>
          </div>

          {/* Amount Tally */}
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{billing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Healthcare Cess / Tax (5%):</span>
              <span className="font-mono">₹{billing.tax.toFixed(2)}</span>
            </div>
            {billing.insuranceDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Insurance / TPA Coverage:</span>
                <span className="font-mono">-₹{billing.insuranceDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-300 dark:border-zinc-700 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Net Total Payable:</span>
              <span className="font-mono text-base text-sky-700 dark:text-sky-400">
                ₹{billing.totalPayable.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Address & Helpline ── */}
      <div className="bg-slate-50 dark:bg-zinc-800/50 px-6 py-3 border-t border-slate-200 dark:border-zinc-800 text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>Pharmacy Dispensing Helpline: {hospital.emergencyHelplines}</span>
        <span>Computer Generated Invoice · Authorized Hospital EHR System</span>
      </div>
    </div>
  )
}
