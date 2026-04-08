import { Client } from '@notionhq/client'
import { FeatureRequest } from '@/types'
import { inferOrgFromSubmitter, mergeFeatureSamples, FEATURE_REQUEST_SAMPLES } from '@/lib/portal-data'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID

function isNotionConfigured() {
  return Boolean(process.env.NOTION_TOKEN && DATABASE_ID)
}

function extractRichText(prop: any): string {
  if (!prop || prop.type !== 'rich_text') return ''
  return prop.rich_text?.map((t: any) => t.plain_text).join('') ?? ''
}

function extractTitle(prop: any): string {
  if (!prop || prop.type !== 'title') return ''
  return prop.title?.map((t: any) => t.plain_text).join('') ?? ''
}

function extractSelect(prop: any): string {
  if (!prop || prop.type !== 'select') return ''
  return prop.select?.name ?? ''
}

function extractUrl(prop: any): string {
  if (!prop || prop.type !== 'url') return ''
  return prop.url ?? ''
}

function extractLastEditedTime(prop: any): string {
  if (!prop || prop.type !== 'last_edited_time') return ''
  return prop.last_edited_time ?? ''
}

export function pageToFeature(page: any): FeatureRequest {
  const props = page.properties
  const submitter = extractRichText(props['Submitter'])

  return {
    id: page.id,
    name: extractTitle(props['Name']),
    featureType: (extractSelect(props['Feature Type']) || 'Other') as FeatureRequest['featureType'],
    problem: extractRichText(props['Problem']),
    desiredOutcome: extractRichText(props['Desired Outcome']),
    urgency: (extractSelect(props['Urgency']) || 'Low') as FeatureRequest['urgency'],
    status: (extractSelect(props['Status']) || 'Backlog') as FeatureRequest['status'],
    submitter,
    org: (extractSelect(props['Org']) || inferOrgFromSubmitter(submitter)) as FeatureRequest['org'],
    links: extractUrl(props['Links']),
    lastUpdateNote: extractRichText(props['Last Update Note']),
    lastUpdated: extractLastEditedTime(props['Last Updated']),
    createdAt: page.created_time,
  }
}

export async function getFeatures(): Promise<FeatureRequest[]> {
  if (!isNotionConfigured()) {
    return mergeFeatureSamples([])
  }

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID!,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    })
    return mergeFeatureSamples(response.results.map(pageToFeature))
  } catch (err: any) {
    console.error('Failed to query Notion, falling back to demo feature requests.', err)
    return mergeFeatureSamples([])
  }
}

export async function getFeatureById(id: string): Promise<FeatureRequest | null> {
  const sample = FEATURE_REQUEST_SAMPLES.find((feature) => feature.id === id)
  if (sample) return sample
  if (!isNotionConfigured()) return null

  try {
    const page = await notion.pages.retrieve({ page_id: id })
    return pageToFeature(page)
  } catch {
    return null
  }
}

export async function createFeature(data: {
  name: string
  featureType: string
  problem: string
  desiredOutcome: string
  urgency: string
  links?: string
  submitter: string
  org?: string
}): Promise<string> {
  if (!isNotionConfigured()) {
    throw new Error('Notion is not configured')
  }

  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID! },
    properties: {
      Name: {
        title: [{ text: { content: data.name } }],
      },
      'Feature Type': {
        select: { name: data.featureType },
      },
      Problem: {
        rich_text: [{ text: { content: data.problem } }],
      },
      'Desired Outcome': {
        rich_text: [{ text: { content: data.desiredOutcome } }],
      },
      Urgency: {
        select: { name: data.urgency },
      },
      Status: {
        select: { name: 'Backlog' },
      },
      Submitter: {
        rich_text: [{ text: { content: data.submitter } }],
      },
      ...((data.org || inferOrgFromSubmitter(data.submitter))
        ? {
            Org: {
              select: { name: data.org || inferOrgFromSubmitter(data.submitter)! },
            },
          }
        : {}),
      ...(data.links
        ? {
            Links: {
              url: data.links,
            },
          }
        : {}),
    },
  })

  return (response as any).id
}
