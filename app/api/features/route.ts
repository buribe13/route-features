import { NextResponse } from 'next/server'
import { getFeatures } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const features = await getFeatures()
    return NextResponse.json(features)
  } catch (error) {
    console.error('Failed to fetch features:', error)
    return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 })
  }
}
