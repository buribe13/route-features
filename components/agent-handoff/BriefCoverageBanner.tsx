'use client'

import Link from 'next/link'
import { useHandoff } from './HandoffProvider'

export function BriefCoverageBanner() {
  const { briefs } = useHandoff()

  if (briefs.length === 0) return null

  const activeBriefs = briefs.filter((b) => b.status === 'active')
  const draftBriefs = briefs.filter((b) => b.status === 'draft')

  return (
    <div className="bg-surface-1 border border-subtle-20 rounded-[12px] px-5 py-4 mb-6 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-body text-text-primary">
          {briefs.length} brief{briefs.length !== 1 ? 's' : ''} tracked
        </p>
        <p className="text-caption text-text-muted mt-0.5">
          {activeBriefs.length} active, {draftBriefs.length} draft
        </p>
      </div>
      <Link
        href="/handoff"
        className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100 shrink-0 inline-flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Open handoff workspace
      </Link>
    </div>
  )
}
