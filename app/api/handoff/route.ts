import { NextResponse } from 'next/server'
import { getHandoffContext } from '@/lib/handoff-context'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const context = await getHandoffContext()
    return NextResponse.json(context)
  } catch (err) {
    console.error('Failed to build handoff context:', err)
    return NextResponse.json({ error: 'Failed to load handoff context' }, { status: 500 })
  }
}
