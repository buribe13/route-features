import { getFeatures } from '@/lib/notion'
import { SubmitForm } from '@/components/SubmitForm'
import { FeatureRequest } from '@/types'
import { PageHeader } from '@/components/portal/PortalPrimitives'

export const dynamic = 'force-dynamic'

export default async function SubmitPage() {
  let recentFeatures: FeatureRequest[] = []
  try {
    const all = await getFeatures()
    recentFeatures = all.slice(0, 5)
  } catch {
    // gracefully degrade if Notion isn't configured
  }

  return (
    <div>
      <PageHeader
        title="Submit a request"
        description="What would make LA28 Route Portal better? Every request is read by the team."
      />
      <SubmitForm recentFeatures={recentFeatures} />
    </div>
  )
}
