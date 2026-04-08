'use client'

import { useMemo } from 'react'
import { useActiveRole } from '@/components/RoleProvider'
import {
  ActionLinkCard,
  PageHeader,
  ProgressBar,
  SettingsBadge,
  SettingsSection,
  SettingsRow,
} from '@/components/portal/PortalPrimitives'
import { UrgencyBadge } from '@/components/Badges'
import { DASHBOARD_ACTIONS, ROLE_META, SPRINT_CONTEXT, SPRINT_DEPENDENCIES } from '@/lib/portal-data'

export function DashboardView() {
  const { activeRole } = useActiveRole()

  const stats = useMemo(() => {
    const delivering = SPRINT_DEPENDENCIES.filter((item) => item.from === activeRole && item.status !== 'done').length
    const waiting = SPRINT_DEPENDENCIES.filter((item) => item.to === activeRole && item.status !== 'done').length
    const blocked = SPRINT_DEPENDENCIES.filter((item) => item.status === 'blocked').length
    return { delivering, waiting, blocked }
  }, [activeRole])

  const actions = DASHBOARD_ACTIONS.filter((item) => item.role === activeRole)
  const activity = SPRINT_DEPENDENCIES.slice(0, 4)

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Sprint overview for ${ROLE_META[activeRole].label}, ${ROLE_META[activeRole].org}.`}
      />

      <SettingsSection title="Sprint Stats">
        <SettingsRow label="Delivering this sprint" description="Items you still owe another org">
          <span className="text-body font-mono text-text-primary">{stats.delivering}</span>
        </SettingsRow>
        <SettingsRow label="Waiting to receive" description="Incoming dependencies still in flight">
          <span className="text-body font-mono text-text-primary">{stats.waiting}</span>
        </SettingsRow>
        <SettingsRow label="Blocked system-wide" description="Cross-org work currently at risk">
          <span className="text-body font-mono text-text-primary">{stats.blocked}</span>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title={SPRINT_CONTEXT.id}>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-body text-text-primary">{SPRINT_CONTEXT.theme}</p>
            <span className="text-caption font-mono text-text-secondary">{SPRINT_CONTEXT.progress}%</span>
          </div>
          <p className="text-caption text-text-muted mb-4">{SPRINT_CONTEXT.range}</p>
          <ProgressBar value={SPRINT_CONTEXT.progress} />
        </div>
      </SettingsSection>

      <section className="space-y-3">
        <h3 className="text-caption text-text-muted">Action items</h3>
        {actions.map((action) => (
          <ActionLinkCard key={action.id} href={action.href}>
            <div className="flex items-center justify-between gap-3">
              <p className="text-body text-text-primary">{action.title}</p>
              <UrgencyBadge urgency={action.urgency} />
            </div>
          </ActionLinkCard>
        ))}
      </section>

      <SettingsSection title="Cross-Org Activity">
        {activity.map((item) => (
          <SettingsRow
            key={item.id}
            label={item.feature}
            description={`${ROLE_META[item.from].org} → ${ROLE_META[item.to].org}`}
          >
            <SettingsBadge>{item.status.replace('_', ' ')}</SettingsBadge>
          </SettingsRow>
        ))}
      </SettingsSection>
    </div>
  )
}
