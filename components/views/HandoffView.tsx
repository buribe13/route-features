'use client'

import { useCallback, useEffect, useMemo, useRef, useState, FormEvent } from 'react'
import { useActiveRole } from '@/components/RoleProvider'
import { useHandoff } from '@/components/agent-handoff/HandoffProvider'
import { HANDOFF_CHECKLIST, ROLE_META } from '@/lib/portal-data'
import {
  PageHeader,
  ProgressBar,
  SettingsSection,
  SettingsButton,
} from '@/components/portal/PortalPrimitives'
import { DocumentLightbox } from '@/components/portal/DocumentLightbox'
import { ArrowRightIcon } from '@/components/icons/ArrowIcons'
import { BADGE_PILL_BASE, BriefStatusBadge } from '@/components/Badges'
import type {
  BriefOrigin,
  SubprojectBrief,
  HandoffChecklistItem,
  AssistantAction,
} from '@/types'

const STORAGE_KEY = 'la28-handoff-checklist'

const ORIGIN_LABELS: Record<BriefOrigin, string> = {
  feature: 'Feature',
  subproject: 'Subproject',
  collaboration: 'Collaboration',
}

const ACTION_KIND_LABELS: Record<string, { label: string; className: string }> = {
  answer: { label: 'Answer', className: 'bg-surface-3 text-text-secondary' },
  suggestion: { label: 'Suggestion', className: 'bg-[#0f2a1a] text-accent-green' },
  ticket_draft: { label: 'Ticket draft', className: 'bg-[#2a2500] text-accent-yellow' },
  ticket_created: { label: 'Ticket created', className: 'bg-[#0f2a1a] text-accent-green' },
  brief_draft: { label: 'Brief draft', className: 'bg-[#0f1624] text-accent-blue' },
  brief_saved: { label: 'Brief saved', className: 'bg-[#0f2a1a] text-accent-green' },
  error: { label: 'Error', className: 'bg-[#2a0f0f] text-accent-red' },
}

type LightboxState =
  | { type: 'brief'; brief: SubprojectBrief }
  | { type: 'checklist'; item: HandoffChecklistItem }
  | { type: 'action'; action: AssistantAction }
  | null

function ActionBubble({
  kind,
  content,
  onClick,
}: {
  kind: string
  content: string
  onClick: () => void
}) {
  const kindColors: Record<string, string> = {
    answer: 'bg-surface-2 text-text-primary',
    suggestion: 'bg-[#0f2a1a] text-accent-green',
    ticket_draft: 'bg-[#2a2500] text-accent-yellow',
    ticket_created: 'bg-[#0f2a1a] text-accent-green',
    brief_draft: 'bg-[#0f1624] text-accent-blue',
    brief_saved: 'bg-[#0f2a1a] text-accent-green',
    error: 'bg-[#2a0f0f] text-accent-red',
  }
  const kindLabel = ACTION_KIND_LABELS[kind]?.label ?? 'Agent'
  return (
    <button
      type="button"
      onClick={onClick}
      title="Click for details"
      className={`group w-full rounded-[12px] px-4 py-3 text-body whitespace-pre-wrap text-left transition-opacity hover:opacity-80 flex items-start gap-3 ${kindColors[kind] ?? 'bg-surface-2 text-text-primary'}`}
    >
      <span className="text-caption font-medium shrink-0 mt-[2px] opacity-80">
        {kindLabel}
      </span>
      <span className="flex-1 min-w-0">{content}</span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 mt-[3px] opacity-50 group-hover:opacity-100 transition-opacity"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function HandoffView() {
  const { activeRole } = useActiveRole()
  const {
    briefs,
    actions,
    submitInput,
    pendingDraft,
    confirmDraft,
    dismissDraft,
    pendingBriefDraft,
    updatePendingBriefDraft,
    savePendingBrief,
    dismissBriefDraft,
  } = useHandoff()
  const [items, setItems] = useState(HANDOFF_CHECKLIST)
  const [input, setInput] = useState('')
  const [lightbox, setLightbox] = useState<LightboxState>(null)
  const [isSavingBrief, setIsSavingBrief] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = window.sessionStorage.getItem(STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) setItems(parsed)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [actions])

  const completed = useMemo(() => items.filter((i) => i.done).length, [items])
  const total = items.length
  const allComplete = completed === total
  const progress = Math.round((completed / total) * 100)

  function toggleItem(id: number) {
    if (activeRole !== 'design') return
    setItems((cur) => cur.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    submitInput(input)
    setInput('')
  }

  const closeLightbox = useCallback(() => setLightbox(null), [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Handoff workspace"
        description="Collaborate on markdown briefs, track deliverables, and manage cross-team handoffs."
      />

      {/* ------------------------------------------------------------------ */}
      {/* Inline agent panel                                                  */}
      {/* ------------------------------------------------------------------ */}
      <SettingsSection title="Agent">
        <div className="flex flex-col">
          <div
            ref={scrollRef}
            className="px-5 py-4 space-y-3 max-h-[280px] overflow-y-auto"
          >
            {actions.length === 0 ? (
              <p className="text-caption text-text-muted">
                Draft briefs with <span className="text-text-secondary">@brief</span>,
                create tickets with <span className="text-text-secondary">@ticket</span>,
                or ask about any subproject.
              </p>
            ) : (
              <>
                <p className="text-caption text-text-muted">
                  Activity log. Click any item for details.
                </p>
                {actions.map((a) => (
                  <ActionBubble
                    key={a.id}
                    kind={a.kind}
                    content={a.content}
                    onClick={() => setLightbox({ type: 'action', action: a })}
                  />
                ))}
              </>
            )}
          </div>

          {pendingDraft && (
            <div className="px-5 py-2 border-t border-subtle-20 bg-surface-2 flex items-center gap-2">
              <p className="flex-1 text-caption text-accent-yellow truncate">
                Confirm ticket: {pendingDraft.name}
              </p>
              <button
                type="button"
                onClick={confirmDraft}
                className="text-caption px-3 py-1 rounded-[6px] bg-text-primary text-surface-0 font-medium hover:bg-white transition-colors"
              >
                Create
              </button>
              <button
                type="button"
                onClick={dismissDraft}
                className="text-caption px-3 py-1 rounded-[6px] border border-border text-text-secondary hover:text-text-primary transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}

          {pendingBriefDraft && (
            <div className="px-5 py-3 border-t border-subtle-20 bg-surface-2 space-y-2">
              <p className="text-caption text-accent-blue">
                New brief draft: {pendingBriefDraft.title}
              </p>
              <input
                type="text"
                value={pendingBriefDraft.title}
                onChange={(e) => updatePendingBriefDraft({ title: e.target.value })}
                className="w-full bg-surface-0 border border-subtle-20 rounded-[6px] text-body text-text-primary px-3 py-2 outline-none focus:border-surface-4 transition-colors mb-2"
                placeholder="Brief title"
              />
              <input
                type="text"
                value={pendingBriefDraft.summary}
                onChange={(e) => updatePendingBriefDraft({ summary: e.target.value })}
                className="w-full bg-surface-0 border border-subtle-20 rounded-[6px] text-caption text-text-secondary px-3 py-2 outline-none focus:border-surface-4 transition-colors mb-2"
                placeholder="One-line summary"
              />
              <textarea
                className="w-full bg-surface-0 border border-subtle-20 rounded-[6px] text-body text-text-primary p-3 resize-y min-h-[120px] outline-none focus:border-surface-4 transition-colors"
                value={pendingBriefDraft.body}
                onChange={(e) => updatePendingBriefDraft({ body: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (isSavingBrief) return
                    setIsSavingBrief(true)
                    try {
                      await savePendingBrief()
                    } finally {
                      setIsSavingBrief(false)
                    }
                  }}
                  disabled={isSavingBrief}
                  className="text-caption px-3 py-1 rounded-[6px] bg-text-primary text-surface-0 font-medium hover:bg-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingBrief ? 'Saving...' : 'Save brief'}
                </button>
                <button
                  type="button"
                  onClick={dismissBriefDraft}
                  disabled={isSavingBrief}
                  className="text-caption px-3 py-1 rounded-[6px] border border-border text-text-secondary hover:text-text-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="px-5 py-3 border-t border-subtle-20 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="@brief, @ticket, or ask a question..."
              className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 p-1.5 rounded-[6px] text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              aria-label="Send"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L7 9M14 2l-4 12-3-5-5-3 12-4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </SettingsSection>

      {/* ------------------------------------------------------------------ */}
      {/* Universal brief tracking                                            */}
      {/* ------------------------------------------------------------------ */}
      <SettingsSection title="All briefs">
        {briefs.length === 0 ? (
          <div className="px-5 py-4">
            <p className="text-caption text-text-muted">Loading briefs...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_80px_90px_80px_80px] gap-2 px-5 py-2">
              <span className="text-caption text-text-muted font-medium">Title</span>
              <span className="text-caption text-text-muted font-medium text-center">Status</span>
              <span className="text-caption text-text-muted font-medium">Origin</span>
              <span className="text-caption text-text-muted font-medium">Owner</span>
              <span className="text-caption text-text-muted font-medium">Updated</span>
            </div>
            {briefs.map((brief) => (
              <button
                key={brief.slug}
                type="button"
                onClick={() => setLightbox({ type: 'brief', brief })}
                className="w-full text-left grid grid-cols-[1fr_80px_90px_80px_80px] gap-2 px-5 py-3 hover:bg-surface-2 transition-colors duration-100"
              >
                <div className="min-w-0">
                  <span className="block text-body text-text-primary truncate">
                    {brief.title}
                  </span>
                  {brief.receivingTeam && (
                    <span className="text-caption text-text-muted inline-flex items-center gap-1">
                      {ROLE_META[brief.ownerRole]?.org} <ArrowRightIcon /> {ROLE_META[brief.receivingTeam]?.org}
                    </span>
                  )}
                </div>
                <div className="flex justify-center self-center">
                  <BriefStatusBadge status={brief.status} />
                </div>
                <span className="text-caption text-text-secondary self-center">
                  {ORIGIN_LABELS[brief.origin] ?? brief.origin}
                </span>
                <span className="text-caption text-text-muted self-center truncate">
                  {ROLE_META[brief.ownerRole]?.org}
                </span>
                <span className="text-caption text-text-muted self-center">
                  {brief.updatedAt}
                </span>
              </button>
            ))}
          </>
        )}
      </SettingsSection>

      {/* ------------------------------------------------------------------ */}
      {/* Sprint progress + checklist                                         */}
      {/* ------------------------------------------------------------------ */}
      <SettingsSection title="Sprint 3 progress">
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-body text-text-primary inline-flex items-center gap-1">
              Design Agency <ArrowRightIcon /> LA Metro Engineering
            </p>
            <span className="text-body font-mono text-text-primary">
              {completed}/{total}
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar value={progress} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-caption text-text-muted">{progress}% complete</span>
              {allComplete && (
                <span className="text-caption text-text-secondary">Ready to submit.</span>
              )}
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Checklist">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox({ type: 'checklist', item })}
            className="w-full text-left flex items-center gap-3 px-5 py-4 hover:bg-surface-2 transition-colors duration-100"
          >
            <span
              className={`inline-flex w-4 h-4 shrink-0 rounded-[4px] border items-center justify-center text-[11px] transition-colors ${
                item.done
                  ? 'bg-text-primary text-surface-0 border-text-primary'
                  : 'border-surface-4 text-transparent'
              }`}
            >
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <span
                className={`block text-body ${item.done ? 'text-text-muted line-through' : 'text-text-primary'}`}
              >
                {item.label}
              </span>
              {item.note && (
                <span className="block text-caption text-text-muted mt-0.5">{item.note}</span>
              )}
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 text-text-muted">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </SettingsSection>

      {/* ------------------------------------------------------------------ */}
      {/* Role actions                                                        */}
      {/* ------------------------------------------------------------------ */}
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
            {allComplete
              ? 'Submit Handoff to Metro Engineering'
              : `${total - completed} items remain before submission`}
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
          <p className="text-body text-text-muted">
            Handoff in progress. {completed}/{total} items complete.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Lightbox: brief detail                                              */}
      {/* ------------------------------------------------------------------ */}
      <DocumentLightbox
        open={lightbox?.type === 'brief'}
        onClose={closeLightbox}
        title={lightbox?.type === 'brief' ? lightbox.brief.title : ''}
        subtitle={
          lightbox?.type === 'brief'
            ? `${ORIGIN_LABELS[lightbox.brief.origin]} · ${ROLE_META[lightbox.brief.ownerRole]?.org}${lightbox.brief.receivingTeam ? ` · Receiving: ${ROLE_META[lightbox.brief.receivingTeam]?.org}` : ''} · Updated ${lightbox.brief.updatedAt}`
            : undefined
        }
        badge={
          lightbox?.type === 'brief' ? (
            <div className="flex items-center gap-2">
              <BriefStatusBadge status={lightbox.brief.status} />
              {lightbox.brief.featureIds.length > 0 && (
                <span className="text-caption text-text-muted">
                  {lightbox.brief.featureIds.length} linked feature{lightbox.brief.featureIds.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          ) : undefined
        }
      >
        {lightbox?.type === 'brief' && (
          <div className="space-y-5">
            {lightbox.brief.summary && (
              <p className="text-body text-text-primary leading-relaxed">
                {lightbox.brief.summary}
              </p>
            )}

            {lightbox.brief.risks && lightbox.brief.risks.length > 0 && (
              <div>
                <h3 className="text-caption text-accent-amber font-medium mb-2">Risks</h3>
                <ul className="space-y-1.5">
                  {lightbox.brief.risks.map((r, i) => (
                    <li key={i} className="text-body text-text-secondary flex items-start gap-2">
                      <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-accent-amber" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {lightbox.brief.openQuestions && lightbox.brief.openQuestions.length > 0 && (
              <div>
                <h3 className="text-caption text-accent-blue font-medium mb-2">Open questions</h3>
                <ul className="space-y-1.5">
                  {lightbox.brief.openQuestions.map((q, i) => (
                    <li key={i} className="text-body text-text-secondary flex items-start gap-2">
                      <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-accent-blue" />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-subtle-20">
              <h3 className="text-caption text-text-muted font-medium mb-3">Document</h3>
              <div className="bg-surface-0 border border-subtle-20 rounded-[12px] p-5">
                <pre className="text-body text-text-secondary whitespace-pre-wrap leading-relaxed font-[inherit]">
                  {lightbox.brief.body}
                </pre>
              </div>
            </div>
          </div>
        )}
      </DocumentLightbox>

      {/* ------------------------------------------------------------------ */}
      {/* Lightbox: checklist item                                            */}
      {/* ------------------------------------------------------------------ */}
      <DocumentLightbox
        open={lightbox?.type === 'checklist'}
        onClose={closeLightbox}
        title={lightbox?.type === 'checklist' ? lightbox.item.label : ''}
        subtitle="Handoff checklist item"
        badge={
          lightbox?.type === 'checklist' ? (
            <span
              className={`${BADGE_PILL_BASE} ${
                lightbox.item.done
                  ? 'bg-[#0f2a1a] text-accent-green'
                  : 'bg-[#2a2500] text-accent-yellow'
              }`}
            >
              {lightbox.item.done ? 'Complete' : 'Incomplete'}
            </span>
          ) : undefined
        }
        footer={
          lightbox?.type === 'checklist' && activeRole === 'design' ? (
            <button
              type="button"
              onClick={() => {
                toggleItem(lightbox.item.id)
                setLightbox({
                  type: 'checklist',
                  item: { ...lightbox.item, done: !lightbox.item.done },
                })
              }}
              className="text-caption px-3 py-1.5 rounded-[6px] bg-text-primary text-surface-0 font-medium hover:bg-white transition-colors"
            >
              {lightbox.item.done ? 'Mark incomplete' : 'Mark complete'}
            </button>
          ) : undefined
        }
      >
        {lightbox?.type === 'checklist' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-caption text-text-muted font-medium mb-2">Deliverable</h3>
              <p className="text-body text-text-primary">{lightbox.item.label}</p>
            </div>
            {lightbox.item.note && (
              <div>
                <h3 className="text-caption text-text-muted font-medium mb-2">Notes</h3>
                <p className="text-body text-text-secondary">{lightbox.item.note}</p>
              </div>
            )}
            <div>
              <h3 className="text-caption text-text-muted font-medium mb-2">Status</h3>
              <p className="text-body text-text-primary">
                {lightbox.item.done
                  ? 'This item has been completed and is ready for handoff.'
                  : 'This item is still outstanding and must be completed before the handoff can be submitted.'}
              </p>
            </div>
          </div>
        )}
      </DocumentLightbox>

      {/* ------------------------------------------------------------------ */}
      {/* Lightbox: agent action                                              */}
      {/* ------------------------------------------------------------------ */}
      <DocumentLightbox
        open={lightbox?.type === 'action'}
        onClose={closeLightbox}
        title={
          lightbox?.type === 'action'
            ? ACTION_KIND_LABELS[lightbox.action.kind]?.label ?? 'Agent response'
            : ''
        }
        subtitle={
          lightbox?.type === 'action'
            ? new Date(lightbox.action.timestamp).toLocaleString()
            : undefined
        }
        badge={
          lightbox?.type === 'action' ? (
            <span
              className={`${BADGE_PILL_BASE} ${ACTION_KIND_LABELS[lightbox.action.kind]?.className ?? 'bg-surface-3 text-text-secondary'}`}
            >
              {ACTION_KIND_LABELS[lightbox.action.kind]?.label ?? lightbox.action.kind}
            </span>
          ) : undefined
        }
      >
        {lightbox?.type === 'action' && (
          <div className="space-y-4">
            <div className="bg-surface-0 border border-subtle-20 rounded-[12px] p-5">
              <p className="text-body text-text-primary whitespace-pre-wrap leading-relaxed">
                {lightbox.action.content}
              </p>
            </div>

            {lightbox.action.draft && (
              <div>
                <h3 className="text-caption text-text-muted font-medium mb-2">
                  Ticket draft details
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Name</span>
                    <span className="text-body text-text-primary">{lightbox.action.draft.name}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Type</span>
                    <span className="text-body text-text-secondary">{lightbox.action.draft.featureType}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Problem</span>
                    <span className="text-body text-text-secondary">{lightbox.action.draft.problem}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Outcome</span>
                    <span className="text-body text-text-secondary">{lightbox.action.draft.desiredOutcome}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Urgency</span>
                    <span className="text-body text-text-secondary">{lightbox.action.draft.urgency}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-caption text-text-muted w-24 shrink-0">Submitter</span>
                    <span className="text-body text-text-secondary">{lightbox.action.draft.submitter}</span>
                  </div>
                </div>
              </div>
            )}

            {lightbox.action.createdFeatureId && (
              <div className="flex items-center gap-2">
                <span className="text-caption text-text-muted">Created ID:</span>
                <span className="text-caption text-text-secondary font-mono">
                  {lightbox.action.createdFeatureId}
                </span>
              </div>
            )}
          </div>
        )}
      </DocumentLightbox>
    </div>
  )
}
