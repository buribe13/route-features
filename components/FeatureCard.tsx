import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { FeatureRequest } from '@/types'
import { StatusBadge, UrgencyBadge, FeatureTypeBadge } from './Badges'
import { ROLE_META } from '@/lib/portal-data'

interface FeatureCardProps {
  feature: FeatureRequest
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const timeAgo = feature.lastUpdated
    ? formatDistanceToNow(new Date(feature.lastUpdated), { addSuffix: true })
    : null

  return (
    <Link href={`/feature/${feature.id}`} className="block group">
      <article className="border border-subtle-20 rounded-[12px] p-5 hover:bg-surface-1 transition-all duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <FeatureTypeBadge type={feature.featureType} />
              <UrgencyBadge urgency={feature.urgency} />
            </div>
            <h2 className="text-body font-medium text-text-primary group-hover:text-white truncate pr-4 mb-1">
              {feature.name}
            </h2>
            {feature.problem && (
              <p className="text-caption text-text-muted line-clamp-2 leading-[18px]">
                {feature.problem}
              </p>
            )}
          </div>
          <div className="shrink-0">
            <StatusBadge status={feature.status} />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-subtle-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-wrap">
            {feature.submitter && (
              <span className="text-caption text-text-muted">{feature.submitter}</span>
            )}
            {feature.org && (
              <>
                <span className="text-caption text-surface-4">·</span>
                <span className="text-caption text-text-secondary">{ROLE_META[feature.org].org}</span>
              </>
            )}
            {feature.lastUpdateNote && (
              <>
                <span className="text-caption text-surface-4">·</span>
                <span className="text-caption text-text-muted truncate max-w-[240px]">
                  {feature.lastUpdateNote}
                </span>
              </>
            )}
          </div>
          {timeAgo && (
            <span className="text-caption text-text-muted shrink-0">{timeAgo}</span>
          )}
        </div>
      </article>
    </Link>
  )
}
