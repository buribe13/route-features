import { NextResponse } from 'next/server'
import { getFeatureById } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const feature = await getFeatureById(params.id)
    if (!feature) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 })
    }
    return NextResponse.json(feature)
  } catch (error) {
    console.error('Failed to fetch feature:', error)
    return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 })
  }
}
