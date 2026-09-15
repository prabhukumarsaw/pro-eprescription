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

    </div>
  )
}
