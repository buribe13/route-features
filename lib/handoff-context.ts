import { getAllBriefs } from '@/lib/briefs'
import { getFeatures } from '@/lib/notion'
import type {
  SubprojectBrief,
  FeatureRequest,
  HandoffPacket,
  HandoffPacketStatus,
  Role,
} from '@/types'
import {
  HANDOFF_CHECKLIST,
  SPRINT_CONTEXT,
  SPRINT_DEPENDENCIES,
} from '@/lib/portal-data'

export interface HandoffContext {
  briefs: SubprojectBrief[]
  features: FeatureRequest[]
  packets: HandoffPacket[]
  sprint: typeof SPRINT_CONTEXT
}

function buildPacketFromBrief(
  brief: SubprojectBrief,
  features: FeatureRequest[],
): HandoffPacket {
  const linkedFeatures = features.filter((f) => brief.featureIds.includes(f.id))

  let status: HandoffPacketStatus = 'preparing'
  const checklist = HANDOFF_CHECKLIST
  const allDone = checklist.every((i) => i.done)
  if (allDone) status = 'ready'

  return {
    id: `packet-${brief.slug}`,
    briefSlug: brief.slug,
    from: brief.ownerRole,
    to: brief.receivingTeam ?? ('engineer' as Role),
    status,
    checklist,
    linkedFeatureIds: linkedFeatures.map((f) => f.id),
    links: [],
    handoffSummary: brief.summary,
    createdAt: brief.updatedAt,
    updatedAt: brief.updatedAt,
  }
}

export async function getHandoffContext(): Promise<HandoffContext> {
  const [briefs, features] = await Promise.all([
    Promise.resolve(getAllBriefs()),
    getFeatures(),
  ])

  const packets = briefs
    .filter((b) => b.status === 'active')
    .map((b) => buildPacketFromBrief(b, features))

  return {
    briefs,
    features,
    packets,
    sprint: SPRINT_CONTEXT,
  }
}
