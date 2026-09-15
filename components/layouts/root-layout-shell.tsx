'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { SiteHeader } from '@/components/layouts/site-header'

export function RootLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPrescribeRoute = pathname?.includes('/prescribe') || pathname?.startsWith('/prescription')

  if (isPrescribeRoute) {
    return <div className="h-screen w-full overflow-hidden bg-background">{children}</div>
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background/95 selection:bg-primary/20 selection:text-primary">
      <SiteHeader />
      <main className="flex-1 w-full">{children}</main>
      <footer className="w-full border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 AuraRx Pro Clinical EMR. Compliant with HIPAA & FHIR HL7 standards.</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Gateway Connected
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
