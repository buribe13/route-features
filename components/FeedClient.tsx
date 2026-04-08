'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FeatureRequest, FeatureType, Urgency } from '@/types'
import { FeatureCard } from './FeatureCard'
import { FilterPill, EmptyState } from '@/components/portal/PortalPrimitives'

const FEATURE_TYPES: FeatureType[] = ['UX', 'Workflow', 'Monetization', 'Teams', 'Performance', 'Other']
const URGENCIES: Urgency[] = ['High', 'Medium', 'Low']

interface FeedClientProps {
  features: FeatureRequest[]
}

export function FeedClient({ features }: FeedClientProps) {
  const [typeFilter, setTypeFilter] = useState<FeatureType | null>(null)
  const [urgencyFilter, setUrgencyFilter] = useState<Urgency | null>(null)

  const filtered = useMemo(() => {
    return features.filter((f) => {
      if (typeFilter && f.featureType !== typeFilter) return false
      if (urgencyFilter && f.urgency !== urgencyFilter) return false
      return true
    })
  }, [features, typeFilter, urgencyFilter])

  return (
    <div>
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-caption text-text-muted w-14 shrink-0">Type</span>
          <FilterPill label="All" active={typeFilter === null} onClick={() => setTypeFilter(null)} />
          {FEATURE_TYPES.map((t) => (
            <FilterPill
              key={t}
              label={t}
              active={typeFilter === t}
              onClick={() => setTypeFilter(typeFilter === t ? null : t)}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-caption text-text-muted w-14 shrink-0">Urgency</span>
          <FilterPill label="All" active={urgencyFilter === null} onClick={() => setUrgencyFilter(null)} />
          {URGENCIES.map((u) => (
            <FilterPill
              key={u}
              label={u}
              active={urgencyFilter === u}
              onClick={() => setUrgencyFilter(urgencyFilter === u ? null : u)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-caption text-text-muted">
          {filtered.length} {filtered.length === 1 ? 'request' : 'requests'}
          {(typeFilter || urgencyFilter) ? ' — filtered' : ''}
        </p>
        <Link
          href="/submit"
          className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100"
        >
          + Submit request
        </Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="No requests match these filters." />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      )}
    </div>
  )
}
