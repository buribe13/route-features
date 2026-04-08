import Link from 'next/link'
import { ROLE_META } from '@/lib/portal-data'
import { DependencyStatus, Role } from '@/types'

const dependencyStatusConfig: Record<DependencyStatus, { label: string; className: string }> = {
  done: {
    label: 'Done',
    className: 'bg-surface-3 text-text-secondary border border-border',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-surface-3 text-text-secondary border border-border',
  },
  waiting: {
    label: 'Waiting',
    className: 'bg-surface-3 text-text-secondary border border-border',
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-surface-3 text-text-secondary border border-border',
  },
}

export function OrgLabel({ role }: { role: Role }) {
  return (
    <span className="text-caption text-text-secondary">
      {ROLE_META[role].org}
    </span>
  )
}

export function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-caption px-3 py-1 rounded-[6px] border transition-all duration-100 ${
        active
          ? 'bg-text-primary text-surface-0 border-text-primary'
          : 'bg-transparent text-text-muted border-border hover:text-text-secondary hover:border-surface-4'
      }`}
    >
      {label}
    </button>
  )
}

export function PortalStatusBadge({ status }: { status: DependencyStatus }) {
  const config = dependencyStatusConfig[status]
  return <span className={`text-caption px-2 py-0.5 rounded-[6px] font-medium ${config.className}`}>{config.label}</span>
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
      <div
        className="h-full rounded-full bg-surface-4 transition-all duration-200"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-caption text-text-muted mb-4">
      {title}
    </h2>
  )
}

export function ActionLinkCard({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="block border border-subtle-20 rounded-[6px] p-4 hover:bg-surface-1 transition-all duration-150"
    >
      {children}
    </Link>
  )
}

export function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-0">
      <h3 className="text-caption text-text-muted mb-3">{title}</h3>
      <div className="border border-subtle-20 rounded-[6px] divide-y divide-subtle-20">
        {children}
      </div>
    </section>
  )
}

export function SettingsRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="min-w-0">
        <p className="text-body text-text-primary">{label}</p>
        {description && <p className="text-caption text-text-muted mt-0.5">{description}</p>}
      </div>
      {children && <div className="shrink-0 flex items-center gap-2">{children}</div>}
    </div>
  )
}

export function SettingsButton({
  children,
  variant = 'secondary',
  onClick,
  disabled,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  onClick?: () => void
  disabled?: boolean
}) {
  const base = 'text-caption px-3 py-1.5 rounded-[6px] font-medium transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-text-primary text-surface-0 hover:bg-white',
    secondary: 'border border-border text-text-secondary hover:text-text-primary hover:border-surface-4',
    danger: 'border border-border text-accent-red hover:border-accent-red',
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}

export function SettingsBadge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'active' | 'warning' | 'muted'
}) {
  const variants = {
    default: 'bg-surface-3 text-text-secondary border-border',
    active: 'bg-[#0f2a1a] text-accent-green border-[#145228]',
    warning: 'bg-[#2a1f0a] text-accent-amber border-[#4a350a]',
    muted: 'bg-surface-2 text-text-muted border-border-subtle',
  }
  return (
    <span className={`text-caption px-2 py-0.5 rounded-[6px] border font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[20px] leading-[28px] font-semibold text-text-primary mb-1">{title}</h1>
      {description && <p className="text-body text-text-muted">{description}</p>}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-subtle-20 rounded-[6px] p-10 text-center">
      <p className="text-body text-text-muted">{message}</p>
    </div>
  )
}

export function Table({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <div className="border border-subtle-20 rounded-[6px] overflow-hidden">
      <div className="grid px-5 py-3 border-b border-subtle-20" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((h) => (
          <span key={h} className="text-caption text-text-muted font-medium">{h}</span>
        ))}
      </div>
      <div className="divide-y divide-subtle-20">{children}</div>
    </div>
  )
}

export function TableRow({
  children,
  columns,
}: {
  children: React.ReactNode
  columns: number
}) {
  return (
    <div className="grid px-5 py-3.5 items-center" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {children}
    </div>
  )
}
