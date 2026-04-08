export function FeedSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-subtle-20 rounded-[6px] p-5 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-12 h-5 bg-surface-3 rounded-[6px]" />
            <div className="w-10 h-5 bg-surface-3 rounded-[6px]" />
          </div>
          <div className="w-3/4 h-4 bg-surface-3 rounded-[6px] mb-2" />
          <div className="w-1/2 h-3 bg-surface-2 rounded-[6px]" />
          <div className="mt-4 pt-4 border-t border-subtle-20 flex items-center gap-3">
            <div className="w-16 h-3 bg-surface-2 rounded-[6px]" />
            <div className="w-20 h-3 bg-surface-2 rounded-[6px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
