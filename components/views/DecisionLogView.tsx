'use client'

import { useMemo, useState } from 'react'
import {
  FilterPill,
  OrgLabel,
  PageHeader,
  SettingsBadge,
  SettingsSection,
} from '@/components/portal/PortalPrimitives'
import { useActiveRole } from '@/components/RoleProvider'
import { DECISION_LOG_ITEMS } from '@/lib/portal-data'
import { DecisionStatus } from '@/types'

type DecisionFilter = 'all' | DecisionStatus

export function DecisionLogView() {
  const { activeRole } = useActiveRole()
  const [filter, setFilter] = useState<DecisionFilter>('all')

  const decisions = useMemo(() => {
    return DECISION_LOG_ITEMS.filter((item) => (filter === 'all' ? true : item.status === filter))
  }, [filter])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Decision Log"
        description="Cross-org product and technical decisions with ownership and rationale."
      />

      <div className="flex items-center gap-2 flex-wrap">
        <FilterPill label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterPill label="Adopted" active={filter === 'adopted'} onClick={() => setFilter('adopted')} />
        <FilterPill label="Open" active={filter === 'open'} onClick={() => setFilter('open')} />
      </div>

      <SettingsSection title="Decisions">
        {decisions.map((item) => {
          const ownedByActiveRole = item.owner === activeRole
          return (
            <div key={item.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-body text-text-primary font-medium">{item.title}</p>
                  <p className="text-caption text-text-secondary mt-1 italic">&quot;{item.rationale}&quot;</p>
                </div>
                <SettingsBadge variant={item.status === 'adopted' ? 'active' : 'warning'}>
                  {item.status === 'adopted' ? 'Adopted' : 'Open'}
                </SettingsBadge>
              </div>
              <div className="mt-3 flex items-center gap-2.5 flex-wrap">
                <OrgLabel role={item.owner} />
                <span className="text-caption text-text-muted">·</span>
                <span className="text-caption font-mono text-text-muted">{item.date}</span>
                <span className="text-caption text-text-muted">·</span>
                <SettingsBadge>{item.tag}</SettingsBadge>
                {ownedByActiveRole && (
                  <SettingsBadge variant="active">Your decision</SettingsBadge>
                )}
              </div>
            </div>
          )
        })}
      </SettingsSection>
    </div>
  )
}
