import { Status, Urgency } from '@/types'

/** Shared pill styles: balanced padding, fixed line height so height matches across badges */
export const BADGE_PILL_BASE =
  'inline-flex items-center justify-center px-2 py-1 text-caption font-medium leading-[18px] rounded-[6px] whitespace-nowrap'

const statusConfig: Record<Status, { label: string; className: string }> = {
  Backlog: {
    label: 'Backlog',
    className: 'bg-surface-2 text-text-muted',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-[#2a2500] text-accent-yellow',
  },
  Done: {
    label: 'Done',
    className: 'bg-[#0f2a1a] text-accent-green',
  },
  'On Hold': {
    label: 'On Hold',
    className: 'bg-[#2a1f0a] text-accent-amber',
  },
}

const urgencyConfig: Record<Urgency, { label: string; className: string }> = {
  High: {
    label: 'High',
    className: 'bg-[#2a0f0f] text-accent-red',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-[#0f1624] text-accent-blue',
  },
  Low: {
    label: 'Low',
    className: 'bg-surface-4 text-text-secondary',
  },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? statusConfig['Backlog']
  return (
    <span className={`${BADGE_PILL_BASE} ${config.className}`}>
      {config.label}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config = urgencyConfig[urgency] ?? urgencyConfig['Low']
  return (
    <span className={`${BADGE_PILL_BASE} ${config.className}`}>
      {config.label}
    </span>
  )
}

export function FeatureTypeBadge({ type }: { type: string }) {
  return (
    <span className={`${BADGE_PILL_BASE} bg-surface-3 text-text-secondary`}>
      {type}
    </span>
  )
}
