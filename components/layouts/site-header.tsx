'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  FileText,
  Calendar,
  Activity,
  Search,
  Bell,
  Sun,
  Moon,
  Stethoscope,
  Menu,
  X,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Patients', href: '/patients', icon: Users },
  // { label: 'Prescriptions', href: '/prescriptions', icon: FileText },
  // { label: 'Appointments', href: '/appointments', icon: Calendar },
  // { label: 'Clinical Analytics', href: '/analytics', icon: Activity },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-2xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <Link
            href="/patients"
            className="group flex items-center gap-2.5 transition-transform duration-200 active:scale-95 shrink-0"
          >
            <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-teal-400 p-0.5 shadow-md shadow-indigo-500/20 ring-1 ring-white/20 dark:shadow-indigo-900/40">
              <div className="flex size-full items-center justify-center rounded-[14px] bg-background/20 backdrop-blur-xs text-white">
                <Stethoscope className="size-5" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-foreground font-sans">
                  Framework Futuristic
                </span>
                {/* <span className="hidden xs:inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.2 text-[10px] font-medium text-primary border border-primary/20 leading-none">
                  Clinical OS
                </span> */}
              </div>
              <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
                Smart e-Prescription
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {/* <nav className="hidden lg:flex items-center gap-1 pl-2">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 font-sans whitespace-nowrap',
                    isActive
                      ? 'bg-foreground text-background shadow-xs font-semibold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-foreground" />
                  )}
                </Link>
              )
            })}
          </nav> */}
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Search Apple Pill (Desktop) */}
          <div className="relative hidden xl:flex items-center">
            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground shadow-xs transition-colors hover:border-border hover:bg-muted/70">
              <Search className="size-3.5 text-muted-foreground/80 shrink-0" />
              <span className="font-sans truncate max-w-[180px]">Search records, MRN, Rx...</span>
              <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded bg-background/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground border border-border/60">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative flex size-8 sm:size-8.5 items-center justify-center rounded-full border border-border/50 bg-background/60 text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground active:scale-95 shrink-0"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </button>

          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              className="flex size-8 sm:size-8.5 items-center justify-center rounded-full border border-border/50 bg-background/60 text-muted-foreground transition-all hover:bg-muted/60 hover:text-foreground active:scale-95 shrink-0"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="size-4 text-amber-400" />
              ) : (
                <Moon className="size-4 text-indigo-600" />
              )}
            </button>
          )}

          {/* Doctor Profile Chip */}
          <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-border/60 bg-muted/30 p-1 sm:pr-2.5 transition-all hover:bg-muted/60 shrink-0">
            <div className="flex size-6 sm:size-6.5 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-[10px] sm:text-[11px] font-bold text-white shadow-xs shrink-0">
              MW
            </div>
            <div className="hidden md:flex flex-col text-left font-sans">
              <span className="text-[11px] font-semibold leading-tight text-foreground whitespace-nowrap">
                Super Admin
              </span>
              <span className="text-[9px] text-muted-foreground leading-none whitespace-nowrap">
                Administrator
              </span>
            </div>
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
            className="lg:hidden flex size-8 sm:size-8.5 items-center justify-center rounded-full border border-border/60 bg-card/60 text-foreground transition-colors hover:bg-muted shrink-0"
          >
            {mobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-2xl px-4 py-3 space-y-1 animate-in slide-in-from-top-2 duration-200 font-sans shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
