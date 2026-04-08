/** Inline SVG arrows — use with text-[color] on parent or className for sizing. */

export function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'w-3 h-3 shrink-0'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'w-3 h-3 shrink-0'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? 'w-3 h-3 shrink-0'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4.5 19.5L19.5 4.5m0 0v6m0-6h-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
