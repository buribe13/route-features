'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/RoleProvider'
import { PORTAL_TABS, ROLE_META } from '@/lib/portal-data'

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  '/sprint-board': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  '/feature-requests': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 2v12M8 2v8M12 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  '/decision-log': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 8l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/handoff': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8h12M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  '/resources': (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

function isTabActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href === '/feature-requests') {
    return pathname === '/feature-requests' || pathname.startsWith('/feature/') || pathname === '/submit'
  }
  return pathname.startsWith(href)
}

export function Sidebar() {
  const pathname = usePathname()
  const { activeRole, logout } = useAuth()
  const meta = ROLE_META[activeRole]

  return (
    <aside className="w-[220px] shrink-0 bg-surface-1 rounded-[12px] flex flex-col sticky top-10 self-start max-h-[calc(100vh-80px)]">
      <div className="px-4 pt-5 pb-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/la28-logo.png" alt="LA28 logo" width={20} height={20} className="shrink-0 rounded-[4px]" />
          <span className="text-body font-medium text-text-primary">LA28 Route Portal</span>
        </Link>
      </div>
      <div className="mx-4 border-t border-subtle-20" />

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {PORTAL_TABS.map((tab) => {
          const active = isTabActive(pathname, tab.href)
          const icon = NAV_ICONS[tab.href]
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-body transition-colors duration-100 ${
                active
                  ? 'bg-surface-2 text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span className={`shrink-0 ${active ? 'text-text-primary' : 'text-text-muted'}`}>
                {icon}
              </span>
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-4 border-t border-subtle-20" />
      <div className="px-2 pt-3 pb-3 space-y-0.5">
        <Link
          href="/submit"
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-body transition-colors duration-100 ${
            pathname === '/submit'
              ? 'bg-surface-2 text-text-primary font-medium'
              : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Submit
        </Link>

        <div
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-body text-text-muted hover:bg-surface-2 hover:text-text-secondary transition-colors duration-100"
          role="status"
          aria-label={`Signed in as ${meta.label}`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M3.5 14v-.5c0-2.2 1.9-4 4.5-4s4.5 1.8 4.5 4v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="min-w-0 truncate">{meta.label}</span>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-body text-text-muted hover:bg-surface-2 hover:text-text-secondary transition-colors duration-100"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <path d="M6 2H4a2 2 0 00-2 2v8a2 2 0 002 2h2M10 11l3-3-3-3M6 8h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  )
}
