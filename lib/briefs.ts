import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { SubprojectBrief, BriefStatus, BriefOrigin, Role } from '@/types'

const BRIEFS_DIR = path.join(process.cwd(), 'content', 'briefs')

function parseBrief(slug: string, raw: string): SubprojectBrief {
  const { data, content } = matter(raw)
  return {
    slug: data.slug ?? slug,
    title: data.title ?? slug,
    ownerRole: (data.ownerRole ?? 'design') as Role,
    status: (data.status ?? 'draft') as BriefStatus,
    origin: (data.origin ?? 'subproject') as BriefOrigin,
    featureIds: Array.isArray(data.featureIds) ? data.featureIds : [],
    updatedAt: data.updatedAt ?? '',
    summary: data.summary ?? '',
    body: content.trim(),
    risks: Array.isArray(data.risks) ? data.risks : undefined,
    openQuestions: Array.isArray(data.openQuestions) ? data.openQuestions : undefined,
    receivingTeam: data.receivingTeam as Role | undefined,
    nextAgentInstructions: data.nextAgentInstructions,
  }
}

export function getAllBriefs(): SubprojectBrief[] {
  if (!fs.existsSync(BRIEFS_DIR)) return []
  const files = fs.readdirSync(BRIEFS_DIR).filter((f) => f.endsWith('.md'))
  return files.map((file) => {
    const slug = file.replace(/\.md$/, '')
    const raw = fs.readFileSync(path.join(BRIEFS_DIR, file), 'utf-8')
    return parseBrief(slug, raw)
  })
}

export function getBriefBySlug(slug: string): SubprojectBrief | null {
  const filePath = path.join(BRIEFS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return parseBrief(slug, raw)
}
