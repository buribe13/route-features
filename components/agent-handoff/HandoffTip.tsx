'use client'

import Link from 'next/link'

export function HandoffTip() {
  return (
    <div className="mt-6 bg-surface-1 border border-subtle-20 rounded-[12px] px-5 py-4 flex items-center justify-between gap-4">
      <p className="text-caption text-text-muted">
        Need a collaboration brief for cross-team handoff? Draft one in the handoff workspace after submitting.
      </p>
      <Link
        href="/handoff"
        className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1 rounded-[6px] transition-all duration-100 shrink-0"
      >
        Handoff workspace
      </Link>
    </div>
  )
}
