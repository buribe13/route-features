import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, formatDistanceToNow } from 'date-fns'
import { getFeatureById } from '@/lib/notion'
import { StatusBadge, UrgencyBadge, FeatureTypeBadge } from '@/components/Badges'
import { ROLE_META } from '@/lib/portal-data'
import { PageHeader, SettingsSection, SettingsRow, SettingsButton } from '@/components/portal/PortalPrimitives'
import { ArrowLeftIcon } from '@/components/icons/ArrowIcons'
import { CreateBriefButton } from '@/components/agent-handoff/CreateBriefButton'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function FeaturePage({ params }: Props) {
  const feature = await getFeatureById(params.id)
  if (!feature) notFound()

  const lastUpdatedDate = feature.lastUpdated ? new Date(feature.lastUpdated) : null
  const createdDate = feature.createdAt ? new Date(feature.createdAt) : null

  return (
    <div className="max-w-2xl">
      <Link
        href="/feature-requests"
        className="text-caption text-text-muted hover:text-text-secondary transition-colors mb-6 inline-flex items-center gap-1.5"
      >
        <ArrowLeftIcon /> All requests
      </Link>

      <div className="mt-4 mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <FeatureTypeBadge type={feature.featureType} />
          <UrgencyBadge urgency={feature.urgency} />
          <StatusBadge status={feature.status} />
        </div>
        <h1 className="text-[20px] leading-[24px] font-medium tracking-[-0.01em] text-text-primary mb-2">{feature.name}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          {feature.submitter && (
            <span className="text-caption text-text-muted">by {feature.submitter}</span>
          )}
          {feature.org && (
            <>
              <span className="text-caption text-surface-4">·</span>
              <span className="text-caption text-text-secondary">{ROLE_META[feature.org].org}</span>
            </>
          )}
          {createdDate && (
            <>
              <span className="text-caption text-surface-4">·</span>
              <span className="text-caption text-text-muted">
                Submitted {format(createdDate, 'MMM d, yyyy')}
              </span>
            </>
          )}
        </div>
      </div>

      <SettingsSection title="Details">
        <div className="px-5 py-4">
          <p className="text-caption text-text-muted mb-1.5">Problem</p>
          <p className="text-body text-text-primary whitespace-pre-wrap">
            {feature.problem || <span className="text-text-muted italic">No description</span>}
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-caption text-text-muted mb-1.5">Desired outcome</p>
          <p className="text-body text-text-primary whitespace-pre-wrap">
            {feature.desiredOutcome || <span className="text-text-muted italic">No description</span>}
          </p>
        </div>
        {feature.links && (
          <div className="px-5 py-4">
            <p className="text-caption text-text-muted mb-1.5">Links / References</p>
            <a
              href={feature.links}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-accent-blue hover:underline break-all"
            >
              {feature.links}
            </a>
          </div>
        )}
      </SettingsSection>

      <div className="mt-6">
        <SettingsSection title="Last update">
          <div className="px-5 py-4">
            {lastUpdatedDate && (
              <p className="text-caption text-text-muted mb-2">
                {formatDistanceToNow(lastUpdatedDate, { addSuffix: true })}
                <span className="ml-2">· {format(lastUpdatedDate, 'MMM d, yyyy')}</span>
              </p>
            )}
            {feature.lastUpdateNote ? (
              <p className="text-body text-text-primary whitespace-pre-wrap">{feature.lastUpdateNote}</p>
            ) : (
              <p className="text-body text-text-muted italic">
                No update note yet. The team will fill this in as the request moves forward.
              </p>
            )}
          </div>
        </SettingsSection>
      </div>

      <div className="mt-6">
        <SettingsSection title="Collaboration">
          <div className="px-5 py-4 flex items-center justify-between">
            <p className="text-body text-text-secondary">
              Create or view a markdown brief for cross-team collaboration on this feature.
            </p>
            <CreateBriefButton featureId={params.id} featureName={feature.name} />
          </div>
        </SettingsSection>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/feature-requests"
          className="text-caption text-text-muted hover:text-text-secondary transition-colors"
        >
          <span className="inline-flex items-center gap-1.5"><ArrowLeftIcon /> Back to feed</span>
        </Link>
        <Link
          href="/submit"
          className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100"
        >
          Submit another request
        </Link>
      </div>
    </div>
  )
}
