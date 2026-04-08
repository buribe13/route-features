'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/RoleProvider'
import { PORTAL_TABS, ROLE_META } from '@/lib/portal-data'

function isTabActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href === '/feature-requests') {
    return pathname === '/feature-requests' || pathname.startsWith('/feature/') || pathname === '/submit'
  }
  return pathname === href
}

export function Header() {
  const pathname = usePathname()
  const { activeRole, logout } = useAuth()
  const meta = ROLE_META[activeRole]

  return (
    <header className="border-b border-[#1f1f1f] bg-[#0a0a0a] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-body tracking-tight text-[#f0f0f0]">
              <span className="inline-flex w-5 h-5 rounded-[6px] bg-white shrink-0" aria-hidden="true" />
              LA28 Route Portal
            </Link>

            <div className="flex items-center gap-5">
              <span className="text-caption text-[#888888]">
                {meta.label} · {meta.org}
              </span>
              <Link
                href="/submit"
                className="text-body text-[#888888] hover:text-[#f0f0f0] transition-colors duration-150"
              >
                Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-body text-[#555555] hover:text-[#f0f0f0] transition-colors duration-150"
              >
                Log out
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-5 overflow-x-auto pb-1">
            {PORTAL_TABS.map((tab) => {
              const active = isTabActive(pathname, tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`text-body border-b-2 pb-2 transition-colors duration-150 whitespace-nowrap ${
                    active
                      ? 'font-semibold text-[#f0f0f0] border-[#f0f0f0]'
                      : 'font-normal text-[#555555] border-transparent hover:text-[#888888]'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
