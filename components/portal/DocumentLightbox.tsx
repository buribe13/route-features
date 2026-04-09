'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface DocumentLightboxProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  badge?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export function DocumentLightbox({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
}: DocumentLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-[640px] max-h-[75vh] bg-surface-1 border border-subtle-20 rounded-[12px] shadow-2xl flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-subtle-20">
          <div className="min-w-0 flex-1">
            {badge && <div className="mb-2">{badge}</div>}
            <h2 className="text-[20px] leading-[24px] font-medium tracking-[-0.01em] text-text-primary">
              {title}
            </h2>
            {subtitle && (
              <p className="text-caption text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 -mt-0.5 rounded-[6px] text-text-muted hover:text-text-primary hover:bg-surface-2 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="px-6 py-4 border-t border-subtle-20 flex items-center gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
