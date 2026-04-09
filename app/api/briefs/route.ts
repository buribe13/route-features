import { NextResponse } from 'next/server'
import { getAllBriefs, saveBrief } from '@/lib/briefs'
import type { SubprojectBrief } from '@/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const briefs = getAllBriefs()
  return NextResponse.json(briefs)
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as SubprojectBrief
    if (!body.slug || !body.title || !body.body) {
      return NextResponse.json({ error: 'Missing required fields: slug, title, body' }, { status: 400 })
    }
    saveBrief(body)
    return NextResponse.json({ slug: body.slug }, { status: 201 })
  } catch (err) {
    console.error('Failed to save brief:', err)
    return NextResponse.json({ error: 'Failed to save brief' }, { status: 500 })
  }
}
