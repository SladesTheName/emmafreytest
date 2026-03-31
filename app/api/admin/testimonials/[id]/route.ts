import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        quote: body.quote,
        authorName: body.authorName,
        avatarUrl: body.avatarUrl ?? null,
        source: body.source ?? null,
        starRating: body.starRating ?? 5,
      },
    })
    return NextResponse.json(testimonial)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await prisma.testimonial.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
