import { Geist, Geist_Mono, Roboto_Slab, Public_Sans } from "next/font/google"

import "./globals.css"
import { Providers } from "@/components/providers/providers"
import { cn } from "@/lib/utils"

const publicSansHeading = Public_Sans({ subsets: ["latin"], variable: "--font-heading" })
const robotoSlab = Roboto_Slab({ subsets: ["latin"], variable: "--font-serif" })

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable, "font-serif", robotoSlab.variable, publicSansHeading.variable)}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
