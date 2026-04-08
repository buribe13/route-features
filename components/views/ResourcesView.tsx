'use client'

import { useMemo, useState } from 'react'
import {
  FilterPill,
  PageHeader,
  SettingsBadge,
  SettingsSection,
  SettingsRow,
  SettingsButton,
} from '@/components/portal/PortalPrimitives'
import { useActiveRole } from '@/components/RoleProvider'
import {
  RESOURCES,
  RESOURCE_CATEGORIES,
  RESOURCE_SECTION_LABELS,
} from '@/lib/portal-data'
import { ResourceAccess, ResourceCategory, ResourceSection } from '@/types'

type CategoryFilter = 'All' | ResourceCategory

export function ResourcesView() {
  const { activeRole } = useActiveRole()
  const [category, setCategory] = useState<CategoryFilter>('All')

  const filtered = useMemo(() => {
    return RESOURCES.filter((item) => (category === 'All' ? true : item.category === category))
  }, [category])

  const sections: ResourceSection[] = ['all', 'design', 'metro', 'restricted']

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resources"
        description="Design, engineering, planning, and restricted assets across both orgs."
      />

      <div className="flex items-center gap-2 flex-wrap">
        {RESOURCE_CATEGORIES.map((item) => (
          <FilterPill key={item} label={item} active={category === item} onClick={() => setCategory(item)} />
        ))}
      </div>

      {sections.map((section) => {
        const items = filtered.filter((item) => item.section === section)
        if (items.length === 0) return null
        return (
          <SettingsSection key={section} title={RESOURCE_SECTION_LABELS[section]}>
            {items.map((item) => {
              const accessState = getAccessState(item.access, activeRole)
              const disabled = accessState !== 'open'
              return (
                <SettingsRow
                  key={item.id}
                  label={item.name}
                  description={item.description}
                >
                  <div className="flex items-center gap-2">
                    <SettingsBadge>{item.tool}</SettingsBadge>
                    {disabled ? (
                      <span className="text-caption text-text-muted">
                        {accessState === 'restricted' ? 'Restricted' : 'No access'}
                      </span>
                    ) : (
                      <SettingsButton>Open</SettingsButton>
                    )}
                  </div>
                </SettingsRow>
              )
            })}
          </SettingsSection>
        )
      })}
    </div>
  )
}

function getAccessState(access: ResourceAccess, role: 'design' | 'pm' | 'engineer') {
  if (access === 'all') return 'open'
  if (access === 'design') return role === 'design' ? 'open' : 'no-access'
  if (access === 'metro') return role === 'pm' || role === 'engineer' ? 'open' : 'no-access'
  return 'restricted'
}
