import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const count = await prisma.testimonial.count()
    const testimonial = await prisma.testimonial.create({
      data: {
        quote: body.quote,
        authorName: body.authorName,
        avatarUrl: body.avatarUrl ?? null,
        source: body.source ?? null,
        starRating: body.starRating ?? 5,
        sortOrder: count,
      },
    })
    return NextResponse.json(testimonial, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
