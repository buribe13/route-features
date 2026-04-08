import { Status, Urgency } from '@/types'

const statusConfig: Record<Status, { label: string; className: string }> = {
  Backlog: {
    label: 'Backlog',
    className: 'bg-surface-3 text-text-secondary border border-border',
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-[#1a2a40] text-accent-blue border border-[#1e3a5f]',
  },
  Done: {
    label: 'Done',
    className: 'bg-[#0f2a1a] text-accent-green border border-[#145228]',
  },
  'On Hold': {
    label: 'On Hold',
    className: 'bg-[#2a1f0a] text-accent-amber border border-[#4a350a]',
  },
}

const urgencyConfig: Record<Urgency, { label: string; className: string }> = {
  High: {
    label: 'High',
    className: 'bg-[#2a0f0f] text-accent-red border border-[#4a1414]',
  },
  Medium: {
    label: 'Medium',
    className: 'bg-[#2a2000] text-accent-yellow border border-[#4a3a00]',
  },
  Low: {
    label: 'Low',
    className: 'bg-surface-2 text-text-muted border border-border',
  },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? statusConfig['Backlog']
  return (
    <span className={`text-caption px-2 py-0.5 rounded-[6px] font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const config = urgencyConfig[urgency] ?? urgencyConfig['Low']
  return (
    <span className={`text-caption px-2 py-0.5 rounded-[6px] font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

export function FeatureTypeBadge({ type }: { type: string }) {
  return (
    <span className="text-caption px-2 py-0.5 rounded-[6px] bg-surface-2 text-text-secondary border border-border font-medium">
      {type}
    </span>
  )
}
