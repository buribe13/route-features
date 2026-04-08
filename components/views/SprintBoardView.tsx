'use client'

import {
  PageHeader,
  PortalStatusBadge,
  SettingsSection,
  SettingsRow,
  SettingsBadge,
} from '@/components/portal/PortalPrimitives'
import { UrgencyBadge } from '@/components/Badges'
import { useActiveRole } from '@/components/RoleProvider'
import { ArrowRightIcon } from '@/components/icons/ArrowIcons'
import { ROLE_META, SPRINT_DEPENDENCIES } from '@/lib/portal-data'
import { SprintDependency } from '@/types'

export function SprintBoardView() {
  const { activeRole } = useActiveRole()

  const delivering = SPRINT_DEPENDENCIES.filter((item) => item.from === activeRole)
  const waiting = SPRINT_DEPENDENCIES.filter((item) => item.to === activeRole)
  const otherActivity = SPRINT_DEPENDENCIES.filter((item) => item.from !== activeRole && item.to !== activeRole)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sprint Board"
        description={`Cross-org handoffs for ${ROLE_META[activeRole].label} during the current sprint.`}
      />

      {delivering.length > 0 && (
        <SettingsSection title="You're delivering">
          {delivering.map((item) => (
            <DependencyRow key={item.id} item={item} />
          ))}
        </SettingsSection>
      )}

      {waiting.length > 0 && (
        <SettingsSection title="You're waiting for">
          {waiting.map((item) => (
            <DependencyRow key={item.id} item={item} />
          ))}
        </SettingsSection>
      )}

      {otherActivity.length > 0 && (
        <SettingsSection title="Other Cross-Org Activity">
          {otherActivity.map((item) => (
            <DependencyRow key={item.id} item={item} />
          ))}
        </SettingsSection>
      )}
    </div>
  )
}

function DependencyRow({ item }: { item: SprintDependency }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-body text-text-primary font-medium">{item.feature}</p>
          <p className="text-caption text-text-muted mt-1">{item.desc}</p>
        </div>
        <PortalStatusBadge status={item.status} />
      </div>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <span className="text-caption text-text-secondary inline-flex items-center gap-1">
          {ROLE_META[item.from].org} <ArrowRightIcon /> {ROLE_META[item.to].org}
        </span>
        <span className="text-caption text-text-muted">·</span>
        <UrgencyBadge urgency={item.urgency} />
        <span className="text-caption text-text-muted">·</span>
        <span className="text-caption font-mono text-text-muted">{item.due}</span>
      </div>
    </div>
  )
}
