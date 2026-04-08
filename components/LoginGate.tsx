'use client'

import { FormEvent, useState } from 'react'
import { useAuth } from '@/components/RoleProvider'

export function LoginGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (isLoggedIn) return <>{children}</>

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const err = login(username, password)
    if (err) {
      setError(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-0">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex w-8 h-8 rounded-[6px] bg-white mb-4" aria-hidden="true" />
          <h1 className="text-[20px] leading-[28px] font-semibold text-text-primary">LA28 Route Portal</h1>
          <p className="text-body text-text-muted mt-2">Sign in with your demo account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-caption text-text-secondary mb-1.5 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(null) }}
              placeholder="design, pm, or engineer"
              autoComplete="username"
              className="w-full bg-surface-1 border border-border rounded-[6px] px-3 py-2.5 text-body text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-4 transition-colors duration-100"
            />
          </div>

          <div>
            <label className="text-caption text-text-secondary mb-1.5 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null) }}
              placeholder="Same as username"
              autoComplete="current-password"
              className="w-full bg-surface-1 border border-border rounded-[6px] px-3 py-2.5 text-body text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-4 transition-colors duration-100"
            />
          </div>

          {error && (
            <p className="text-caption text-text-secondary">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-text-primary text-surface-0 text-body font-medium py-3 rounded-[6px] hover:bg-white transition-colors duration-100"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 border border-subtle-20 rounded-[6px] p-4">
          <p className="text-caption text-text-muted mb-3">Demo accounts</p>
          <div className="space-y-2">
            {[
              { user: 'design', role: 'Design Lead' },
              { user: 'pm', role: 'Product Manager' },
              { user: 'engineer', role: 'Engineer' },
            ].map((account) => (
              <div key={account.user} className="flex items-center justify-between">
                <span className="text-caption text-text-secondary">{account.role}</span>
                <span className="text-caption font-mono text-text-muted">{account.user} / {account.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
