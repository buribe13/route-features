import { NextResponse } from 'next/server'
import { createFeature } from '@/lib/notion'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, featureType, problem, desiredOutcome, urgency, links, submitter } = body

    if (!name || !featureType || !problem || !desiredOutcome || !urgency || !submitter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = await createFeature({ name, featureType, problem, desiredOutcome, urgency, links, submitter })
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.error('Failed to create feature:', error)
    return NextResponse.json({ error: 'Failed to submit feature request' }, { status: 500 })
  }
}
