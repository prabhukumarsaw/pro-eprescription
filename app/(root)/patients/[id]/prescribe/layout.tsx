/**
 * Prescribe layout — full screen, no header/footer.
 * The iPad prescription pad manages its own navigation.
 */
import * as React from 'react'

export default function PrescribeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden">
      {children}
    </div>
  )
}
