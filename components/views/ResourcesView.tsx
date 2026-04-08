'use client'

import { useMemo, useState } from 'react'
import { ResourceToolIcon } from '@/components/icons/ResourceToolIcons'
import {
  FilterPill,
  PageHeader,
  SettingsSection,
  SettingsRow,
} from '@/components/portal/PortalPrimitives'
import { useActiveRole } from '@/components/RoleProvider'
import {
  RESOURCES,
  RESOURCE_CATEGORIES,
  RESOURCE_SECTION_LABELS,
} from '@/lib/portal-data'
import { ResourceAccess, ResourceCategory, ResourceSection } from '@/types'

type CategoryFilter = 'All' | ResourceCategory

/** Tool icon + Open only: shared fixed height so the row aligns (does not change global BADGE_PILL_BASE). */
const RESOURCE_ROW_PILL_BASE =
  'inline-flex items-center justify-center box-border h-7 min-w-7 px-2 text-caption font-medium leading-[18px] rounded-[6px] whitespace-nowrap border'

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
                    <span
                      className={`${RESOURCE_ROW_PILL_BASE} border-transparent bg-surface-3 text-text-secondary`}
                      aria-label={item.tool}
                    >
                      <ResourceToolIcon tool={item.tool} />
                    </span>
                    {disabled ? (
                      <span className="text-caption text-text-muted">
                        {accessState === 'restricted' ? 'Restricted' : 'No access'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={`${RESOURCE_ROW_PILL_BASE} border-border bg-transparent text-text-secondary hover:text-text-primary hover:border-surface-4 transition-colors duration-100 cursor-pointer`}
                      >
                        Open
                      </button>
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
