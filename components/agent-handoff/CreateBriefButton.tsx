'use client'

import Link from 'next/link'
import { useHandoff } from './HandoffProvider'

export function CreateBriefButton({
  featureId,
  featureName,
}: {
  featureId: string
  featureName: string
}) {
  const { briefs, draftBriefFromFeature } = useHandoff()
  const existingBrief = briefs.find((b) => b.featureIds.includes(featureId))

  if (existingBrief) {
    return (
      <Link
        href="/handoff"
        className="text-caption text-accent-blue hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100 inline-flex items-center gap-1.5"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path d="M3 2h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        View brief
      </Link>
    )
  }

  return (
    <Link
      href="/handoff"
      onClick={() => draftBriefFromFeature(featureId, featureName)}
      className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100 inline-flex items-center gap-1.5"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Create brief
    </Link>
  )
}
