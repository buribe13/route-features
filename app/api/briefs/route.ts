import { NextResponse } from 'next/server'
import { getAllBriefs } from '@/lib/briefs'

export const dynamic = 'force-dynamic'

export async function GET() {
  const briefs = getAllBriefs()
  return NextResponse.json(briefs)
}
