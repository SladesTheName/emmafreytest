import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const count = await prisma.product.count()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price ?? 0,
        type: body.type,
        thumbnail: body.thumbnail || null,
        file: body.file || null,
        externalUrl: body.externalUrl || null,
        ctaLabel: body.ctaLabel ?? 'Get It Now',
        badge: body.badge || null,
        status: body.status ?? 'active',
        sortOrder: count,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
