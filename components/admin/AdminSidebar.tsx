'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Users,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-brand-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex-shrink-0" />
          <div>
            <p className="font-display text-sm font-semibold text-dark leading-none">Emma Frey</p>
            <p className="text-[10px] text-brand-muted mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-brand-muted hover:bg-secondary hover:text-dark'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-brand-border space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-brand-muted hover:bg-secondary hover:text-dark transition-all"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Storefront
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-brand-muted hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
