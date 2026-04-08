import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const token = process.env.NOTION_TOKEN
  const dbId = process.env.NOTION_DATABASE_ID

  return NextResponse.json({
    tokenExists: !!token,
    tokenLength: token?.length ?? 0,
    tokenPrefix: token?.slice(0, 7) ?? '(none)',
    dbIdExists: !!dbId,
    dbIdLength: dbId?.length ?? 0,
  })
}
