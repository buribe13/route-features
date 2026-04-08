'use client'

import { useEffect, useMemo, useState } from 'react'
import { useActiveRole } from '@/components/RoleProvider'
import { HANDOFF_CHECKLIST } from '@/lib/portal-data'
import {
  PageHeader,
  ProgressBar,
  SettingsSection,
  SettingsRow,
  SettingsButton,
} from '@/components/portal/PortalPrimitives'
import { ArrowRightIcon } from '@/components/icons/ArrowIcons'

const STORAGE_KEY = 'la28-handoff-checklist'

export function HandoffView() {
  const { activeRole } = useActiveRole()
  const [items, setItems] = useState(HANDOFF_CHECKLIST)

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setItems(parsed)
      }
    } catch {
      // ignore invalid session state
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const completed = useMemo(() => items.filter((item) => item.done).length, [items])
  const total = items.length
  const allComplete = completed === total
  const progress = Math.round((completed / total) * 100)

  function toggleItem(id: number) {
    if (activeRole !== 'design') return
    setItems((current) => current.map((item) => (item.id === id ? { ...item, done: !item.done } : item)))
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Handoff"
        description="Sprint-close delivery from Design Agency to LA Metro Engineering."
      />

      <SettingsSection title="Sprint 3 Progress">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-body text-text-primary inline-flex items-center gap-1">Design Agency <ArrowRightIcon /> LA Metro Engineering</p>
            <span className="text-body font-mono text-text-primary">{completed}/{total}</span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-caption text-text-muted">{progress}% complete</span>
              {allComplete && <span className="text-caption text-text-secondary">Ready to submit.</span>}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Checklist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(item.id)}
            disabled={activeRole !== 'design'}
            className={`w-full text-left flex items-center gap-3 px-5 py-4 ${
              activeRole === 'design' ? 'hover:bg-surface-2' : 'cursor-default'
            } transition-colors duration-100`}
          >
            <span
              className={`inline-flex w-4 h-4 shrink-0 rounded-[4px] border items-center justify-center text-[11px] transition-colors ${
                item.done ? 'bg-text-primary text-surface-0 border-text-primary' : 'border-surface-4 text-transparent'
              }`}
            >
              ✓
            </span>
            <div className="min-w-0">
              <span className={`block text-body ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                {item.label}
              </span>
              {item.note && <span className="block text-caption text-text-muted mt-0.5">{item.note}</span>}
            </div>
          </button>
        ))}
      </SettingsSection>

      <div>
        {activeRole === 'design' && (
          <button
            type="button"
            disabled={!allComplete}
            className={`w-full rounded-[6px] px-4 py-3 text-body font-medium transition-colors ${
              allComplete
                ? 'bg-text-primary text-surface-0 hover:bg-white'
                : 'bg-surface-2 text-text-muted border border-border-subtle cursor-not-allowed'
            }`}
          >
            {allComplete ? 'Submit Handoff to Metro Engineering' : `${total - completed} items remain before submission`}
          </button>
        )}

        {activeRole === 'engineer' && (
          <div className="flex gap-3">
            <SettingsButton>Request Changes</SettingsButton>
            <SettingsButton variant="primary" disabled={!allComplete}>
              Acknowledge Receipt
            </SettingsButton>
          </div>
        )}

        {activeRole === 'pm' && (
          <p className="text-body text-text-muted">Handoff in progress. {completed}/{total} items complete.</p>
        )}
      </div>
    </div>
  )
}
