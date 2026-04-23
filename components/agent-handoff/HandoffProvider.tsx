'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type {
  SubprojectBrief,
  AssistantAction,
  AssistantIntent,
  AtCommandDraft,
  BriefOrigin,
  Role,
} from '@/types'
import { useAuth } from '@/components/RoleProvider'
import { ROLE_META, SPRINT_CONTEXT, SPRINT_DEPENDENCIES, HANDOFF_CHECKLIST } from '@/lib/portal-data'

type HandoffContextValue = {
  briefs: SubprojectBrief[]
  reloadBriefs: () => void
  selectedBrief: SubprojectBrief | null
  selectBrief: (slug: string | null) => void
  actions: AssistantAction[]
  submitInput: (raw: string) => void
  pendingDraft: AtCommandDraft | null
  confirmDraft: () => void
  dismissDraft: () => void
  pendingBriefDraft: SubprojectBrief | null
  updatePendingBriefDraft: (patch: Partial<SubprojectBrief>) => void
  savePendingBrief: () => Promise<void>
  dismissBriefDraft: () => void
  draftBriefFromFeature: (featureId: string, featureName: string) => void
}

const HandoffContext = createContext<HandoffContextValue | null>(null)

const LOCAL_BRIEFS_KEY = 'la28-briefs-v1'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

function now() {
  return new Date().toISOString()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function loadLocalBriefs(): Record<string, SubprojectBrief> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(LOCAL_BRIEFS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, SubprojectBrief>
    }
    return {}
  } catch {
    return {}
  }
}

function saveLocalBriefs(map: Record<string, SubprojectBrief>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCAL_BRIEFS_KEY, JSON.stringify(map))
  } catch {
    /* ignore quota / serialization errors */
  }
}

function mergeBriefs(
  seed: SubprojectBrief[],
  local: Record<string, SubprojectBrief>,
): SubprojectBrief[] {
  const bySlug = new Map<string, SubprojectBrief>()
  for (const b of seed) bySlug.set(b.slug, b)
  for (const slug of Object.keys(local)) bySlug.set(slug, local[slug])
  return Array.from(bySlug.values())
}

function parseIntent(raw: string, activeRole: Role): AssistantIntent {
  const trimmed = raw.trim()

  if (/^@brief\s/i.test(trimmed)) {
    return { type: 'brief_draft', raw: trimmed.replace(/^@brief\s+/i, '') }
  }
  if (/^@ticket\s/i.test(trimmed)) {
    return { type: 'ticket_create', raw: trimmed.replace(/^@ticket\s+/i, '') }
  }
  if (/^@(design|pm|engineer)\s/i.test(trimmed)) {
    const match = trimmed.match(/^@(design|pm|engineer)\s+(.+)$/i)!
    return {
      type: 'ticket_draft',
      raw: match[2],
      targetRole: match[1].toLowerCase() as Role,
    }
  }
  if (/^who (owns|should|is responsible)/i.test(trimmed)) {
    return { type: 'owner_lookup', raw: trimmed }
  }
  if (/^what('s| is) (next|the next step)/i.test(trimmed)) {
    return { type: 'next_step', raw: trimmed }
  }
  return { type: 'question', raw: trimmed }
}

function searchBriefs(briefs: SubprojectBrief[], query: string): SubprojectBrief | null {
  const lower = query.toLowerCase()
  return (
    briefs.find((b) => lower.includes(b.slug) || lower.includes(b.title.toLowerCase())) ?? null
  )
}

function buildBriefDraft(title: string, activeRole: Role): SubprojectBrief {
  const today = new Date().toISOString().slice(0, 10)
  return {
    slug: slugify(title),
    title,
    ownerRole: activeRole,
    status: 'draft',
    origin: 'collaboration' as BriefOrigin,
    featureIds: [],
    updatedAt: today,
    summary: '',
    body: `## ${title}\n\nDescribe the goals, context, and deliverables for this brief.\n\n### Key decisions\n\n### Dependencies\n\n### Open questions\n`,
    risks: [],
    openQuestions: [],
    receivingTeam: undefined,
  }
}

function resolveIntent(
  intent: AssistantIntent,
  briefs: SubprojectBrief[],
  activeRole: Role,
): { action: AssistantAction; draft?: AtCommandDraft; briefDraft?: SubprojectBrief } {
  const base = { id: uid(), timestamp: now() }

  switch (intent.type) {
    case 'brief_draft': {
      const briefDraft = buildBriefDraft(intent.raw, activeRole)
      return {
        action: {
          ...base,
          kind: 'brief_draft',
          content: `Drafted a new brief: "${intent.raw}". Review the content below and save when ready.`,
        },
        briefDraft,
      }
    }

    case 'ticket_create': {
      const draft: AtCommandDraft = {
        name: intent.raw,
        featureType: 'Other',
        problem: intent.raw,
        desiredOutcome: 'Resolve the issue described above.',
        urgency: 'Medium',
        submitter: ROLE_META[activeRole].label,
        org: activeRole,
      }
      return {
        action: {
          ...base,
          kind: 'ticket_draft',
          content: `Drafted a ticket: "${intent.raw}". Review and confirm to create it.`,
          draft,
        },
        draft,
      }
    }

    case 'ticket_draft': {
      const target = intent.targetRole ?? activeRole
      const draft: AtCommandDraft = {
        name: intent.raw,
        featureType: 'Other',
        problem: intent.raw,
        desiredOutcome: `Address the request from ${ROLE_META[activeRole].org} for ${ROLE_META[target].org}.`,
        urgency: 'Medium',
        submitter: ROLE_META[activeRole].label,
        org: activeRole,
      }
      return {
        action: {
          ...base,
          kind: 'ticket_draft',
          content: `Drafted a ticket for ${ROLE_META[target].org}: "${intent.raw}". Review and confirm to create it.`,
          draft,
        },
        draft,
      }
    }

    case 'owner_lookup': {
      const matched = searchBriefs(briefs, intent.raw)
      if (matched) {
        return {
          action: {
            ...base,
            kind: 'suggestion',
            content: `"${matched.title}" is owned by ${ROLE_META[matched.ownerRole].org} (${ROLE_META[matched.ownerRole].label}).${matched.receivingTeam ? ` The receiving team is ${ROLE_META[matched.receivingTeam].org}.` : ''}`,
          },
        }
      }
      const dep = SPRINT_DEPENDENCIES.find((d) =>
        intent.raw.toLowerCase().includes(d.feature.toLowerCase()),
      )
      if (dep) {
        return {
          action: {
            ...base,
            kind: 'suggestion',
            content: `"${dep.feature}" is from ${ROLE_META[dep.from].org} to ${ROLE_META[dep.to].org}. Status: ${dep.status}. Due: ${dep.due}.`,
          },
        }
      }
      return {
        action: {
          ...base,
          kind: 'answer',
          content: `I couldn't identify a specific owner. Try asking about a subproject name like "Journey Cards" or "multilingual UX".`,
        },
      }
    }

    case 'next_step': {
      const roleBriefs = briefs.filter(
        (b) => b.ownerRole === activeRole || b.receivingTeam === activeRole,
      )
      if (roleBriefs.length === 0) {
        return {
          action: {
            ...base,
            kind: 'answer',
            content: `No active briefs for your role right now. Check the sprint board for current dependencies.`,
          },
        }
      }
      const active = roleBriefs.find((b) => b.status === 'active')
      if (active) {
        const questions =
          active.openQuestions && active.openQuestions.length > 0
            ? ` Open questions: ${active.openQuestions[0]}`
            : ''
        return {
          action: {
            ...base,
            kind: 'suggestion',
            content: `Focus on "${active.title}" (${active.status}). ${active.summary}${questions}`,
          },
        }
      }
      return {
        action: {
          ...base,
          kind: 'answer',
          content: `Your briefs are up to date. Review the handoff checklist for any remaining items.`,
        },
      }
    }

    case 'question':
    default: {
      const matched = searchBriefs(briefs, intent.raw)
      if (matched) {
        const parts = [`**${matched.title}** (${matched.status})`, matched.summary]
        if (matched.risks && matched.risks.length > 0) {
          parts.push(`Risks: ${matched.risks.join('; ')}`)
        }
        if (matched.openQuestions && matched.openQuestions.length > 0) {
          parts.push(`Open questions: ${matched.openQuestions[0]}`)
        }
        return { action: { ...base, kind: 'answer', content: parts.join('\n\n') } }
      }

      const dep = SPRINT_DEPENDENCIES.find((d) =>
        intent.raw.toLowerCase().includes(d.feature.toLowerCase()),
      )
      if (dep) {
        return {
          action: {
            ...base,
            kind: 'answer',
            content: `**${dep.feature}**: ${dep.desc}\n\nFrom ${ROLE_META[dep.from].org} to ${ROLE_META[dep.to].org}. Status: ${dep.status}. Due: ${dep.due}. Urgency: ${dep.urgency}.`,
          },
        }
      }

      const checklist = HANDOFF_CHECKLIST
      const incomplete = checklist.filter((i) => !i.done)
      if (
        intent.raw.toLowerCase().includes('handoff') ||
        intent.raw.toLowerCase().includes('checklist')
      ) {
        return {
          action: {
            ...base,
            kind: 'answer',
            content: `Handoff checklist: ${checklist.length} items total, ${incomplete.length} remaining.\n\nIncomplete: ${incomplete.map((i) => i.label).join(', ')}.`,
          },
        }
      }

      if (
        intent.raw.toLowerCase().includes('sprint') ||
        intent.raw.toLowerCase().includes('progress')
      ) {
        return {
          action: {
            ...base,
            kind: 'answer',
            content: `**${SPRINT_CONTEXT.id}**: ${SPRINT_CONTEXT.theme}\nRange: ${SPRINT_CONTEXT.range}. Progress: ${SPRINT_CONTEXT.progress}%.`,
          },
        }
      }

      return {
        action: {
          ...base,
          kind: 'answer',
          content: `I can help draft briefs (@brief), create tickets (@ticket), look up owners, or answer questions about subprojects and sprint context. Try "@brief Journey Card animation spec" or "what's next".`,
        },
      }
    }
  }
}

export function HandoffProvider({ children }: { children: React.ReactNode }) {
  const { activeRole } = useAuth()
  const [briefs, setBriefs] = useState<SubprojectBrief[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [actions, setActions] = useState<AssistantAction[]>([])
  const [pendingDraft, setPendingDraft] = useState<AtCommandDraft | null>(null)
  const [pendingBriefDraft, setPendingBriefDraft] = useState<SubprojectBrief | null>(null)

  const fetchBriefs = useCallback(() => {
    fetch('/api/briefs')
      .then((r) => r.json())
      .then((data) => {
        const seed = Array.isArray(data) ? (data as SubprojectBrief[]) : []
        setBriefs(mergeBriefs(seed, loadLocalBriefs()))
      })
      .catch(() => {
        setBriefs(mergeBriefs([], loadLocalBriefs()))
      })
  }, [])

  useEffect(() => {
    fetchBriefs()
  }, [fetchBriefs])

  const selectedBrief = useMemo(
    () => briefs.find((b) => b.slug === selectedSlug) ?? null,
    [briefs, selectedSlug],
  )

  const selectBrief = useCallback((slug: string | null) => {
    setSelectedSlug(slug)
  }, [])

  const submitInput = useCallback(
    (raw: string) => {
      if (!raw.trim()) return
      const intent = parseIntent(raw, activeRole)
      const { action, draft, briefDraft } = resolveIntent(intent, briefs, activeRole)
      setActions((prev) => [...prev, action])
      if (draft) setPendingDraft(draft)
      if (briefDraft) setPendingBriefDraft(briefDraft)
    },
    [activeRole, briefs],
  )

  const confirmDraft = useCallback(async () => {
    if (!pendingDraft) return
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pendingDraft),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message =
          (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
            ? data.error
            : null) ?? `Server responded with ${res.status}`
        setActions((prev) => [
          ...prev,
          {
            id: uid(),
            kind: 'error',
            content: `Failed to create the ticket: ${message}`,
            timestamp: now(),
          },
        ])
      } else {
        setActions((prev) => [
          ...prev,
          {
            id: uid(),
            kind: 'ticket_created',
            content: `Ticket created: "${pendingDraft.name}"${data.id ? ` (ID: ${data.id})` : ''}`,
            timestamp: now(),
            createdFeatureId: data.id,
          },
        ])
      }
    } catch {
      setActions((prev) => [
        ...prev,
        {
          id: uid(),
          kind: 'error',
          content: 'Failed to create the ticket. Notion may not be configured.',
          timestamp: now(),
        },
      ])
    }
    setPendingDraft(null)
  }, [pendingDraft])

  const dismissDraft = useCallback(() => {
    setPendingDraft(null)
    setActions((prev) => [
      ...prev,
      { id: uid(), kind: 'answer', content: 'Draft dismissed.', timestamp: now() },
    ])
  }, [])

  const savePendingBrief = useCallback(async () => {
    if (!pendingBriefDraft) return
    try {
      const today = new Date().toISOString().slice(0, 10)
      const finalBrief: SubprojectBrief = {
        ...pendingBriefDraft,
        updatedAt: today,
      }
      const localMap = loadLocalBriefs()
      localMap[finalBrief.slug] = finalBrief
      saveLocalBriefs(localMap)
      setBriefs((prev) => mergeBriefs(prev, localMap))
      setActions((prev) => [
        ...prev,
        {
          id: uid(),
          kind: 'brief_saved',
          content: `Brief saved: "${finalBrief.title}"`,
          timestamp: now(),
        },
      ])
      setPendingBriefDraft(null)
    } catch {
      setActions((prev) => [
        ...prev,
        {
          id: uid(),
          kind: 'error',
          content: 'Failed to save the brief.',
          timestamp: now(),
        },
      ])
    }
  }, [pendingBriefDraft])

  const updatePendingBriefDraft = useCallback((patch: Partial<SubprojectBrief>) => {
    setPendingBriefDraft((prev) => (prev ? { ...prev, ...patch } : null))
  }, [])

  const dismissBriefDraft = useCallback(() => {
    setPendingBriefDraft(null)
    setActions((prev) => [
      ...prev,
      { id: uid(), kind: 'answer', content: 'Brief draft dismissed.', timestamp: now() },
    ])
  }, [])

  const draftBriefFromFeature = useCallback(
    (featureId: string, featureName: string) => {
      const today = new Date().toISOString().slice(0, 10)
      const draft: SubprojectBrief = {
        slug: slugify(featureName),
        title: featureName,
        ownerRole: activeRole,
        status: 'draft',
        origin: 'feature',
        featureIds: [featureId],
        updatedAt: today,
        summary: '',
        body: `## ${featureName}\n\nCollaboration brief for the "${featureName}" feature request.\n\n### Context\n\n### Deliverables\n\n### Open questions\n`,
        risks: [],
        openQuestions: [],
      }
      setPendingBriefDraft(draft)
      setActions((prev) => [
        ...prev,
        {
          id: uid(),
          kind: 'brief_draft',
          content: `Drafted a brief from feature: "${featureName}". Edit and save when ready.`,
          timestamp: now(),
        },
      ])
    },
    [activeRole],
  )

  const value = useMemo(
    () => ({
      briefs,
      reloadBriefs: fetchBriefs,
      selectedBrief,
      selectBrief,
      actions,
      submitInput,
      pendingDraft,
      confirmDraft,
      dismissDraft,
      pendingBriefDraft,
      updatePendingBriefDraft,
      savePendingBrief,
      dismissBriefDraft,
      draftBriefFromFeature,
    }),
    [
      briefs,
      fetchBriefs,
      selectedBrief,
      selectBrief,
      actions,
      submitInput,
      pendingDraft,
      confirmDraft,
      dismissDraft,
      pendingBriefDraft,
      updatePendingBriefDraft,
      savePendingBrief,
      dismissBriefDraft,
      draftBriefFromFeature,
    ],
  )

  return <HandoffContext.Provider value={value}>{children}</HandoffContext.Provider>
}

export function useHandoff() {
  const ctx = useContext(HandoffContext)
  if (!ctx) throw new Error('useHandoff must be used within HandoffProvider')
  return ctx
}
