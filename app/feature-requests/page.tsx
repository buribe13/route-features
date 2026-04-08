import { Suspense } from 'react'
import { getFeatures } from '@/lib/notion'
import { FeedClient } from '@/components/FeedClient'
import { FeedSkeleton } from '@/components/Skeleton'
import { PageHeader } from '@/components/portal/PortalPrimitives'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function Feed() {
  const features = await getFeatures()
  return <FeedClient features={features} />
}

export default function FeatureRequestsPage() {
  return (
    <div>
      <PageHeader
        title="Feature Requests"
        description="Everything the team is tracking — from new ideas to active builds."
      />
      <Suspense fallback={<FeedSkeleton />}>
        <Feed />
      </Suspense>
    </div>
  )
}
