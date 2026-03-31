import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDownloadEmail, sendWelcomeEmail } from '@/lib/resend'
import { generateDownloadToken, getDownloadExpiry } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const { email, name, productId, source } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // Upsert subscriber
    await prisma.subscriber.upsert({
      where: { email },
      update: { name: name ?? undefined },
      create: {
        email,
        name: name ?? undefined,
        source: source ?? (productId ? undefined : 'newsletter'),
      },
    })

    // If a product is associated, handle lead magnet delivery
    if (productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } })

      if (product && (product.type === 'lead_magnet' || product.type === 'waitlist') && product.file) {
        const token = generateDownloadToken()
        await prisma.download.create({
          data: {
            productId,
            email,
            token,
            expiresAt: getDownloadExpiry(7),
          },
        })

        try {
          await sendDownloadEmail({
            to: email,
            name,
            productName: product.name,
            downloadToken: token,
          })
        } catch (emailErr) {
          console.error('Failed to send download email:', emailErr)
        }

        return NextResponse.json({ success: true, hasDownload: true })
      }
    }

    // Send welcome email for newsletter signups
    try {
      await sendWelcomeEmail({ to: email, name })
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr)
    }

    return NextResponse.json({ success: true, hasDownload: false })
  } catch (err) {
    console.error('Subscribe error:', err)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
