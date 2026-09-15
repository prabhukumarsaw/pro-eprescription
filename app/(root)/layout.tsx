import * as React from 'react'
import { RootLayoutShell } from '@/components/layouts/root-layout-shell'

export default function PrescriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <RootLayoutShell>{children}</RootLayoutShell>
}
