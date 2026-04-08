import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h1 className="text-[20px] leading-[24px] font-medium tracking-[-0.01em] text-text-primary mb-2">Not Found</h1>
      <p className="text-[20px] leading-[24px] font-medium tracking-[-0.01em] text-text-muted mb-6">This page doesn't exist.</p>
      <Link
        href="/"
        className="text-caption text-text-secondary hover:text-text-primary border border-border hover:border-surface-4 px-3 py-1.5 rounded-[6px] transition-all duration-100"
      >
        Go home
      </Link>
    </div>
  )
}
