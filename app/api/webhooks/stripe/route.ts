import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { sendDownloadEmail } from '@/lib/resend'
import { generateDownloadToken, getDownloadExpiry } from '@/lib/utils'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const productId = session.metadata?.productId
    if (!productId) {
      return NextResponse.json({ error: 'No product ID in metadata' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const customerEmail = session.customer_details?.email ?? session.customer_email
    const customerName = session.customer_details?.name

    if (!customerEmail) {
      console.error('No customer email in session')
      return NextResponse.json({ error: 'No customer email' }, { status: 400 })
    }

    // Save purchase
    await prisma.purchase.create({
      data: {
        productId,
        customerEmail,
        customerName,
        stripeSessionId: session.id,
        amount: (session.amount_total ?? 0) / 100,
      },
    })

    // Also save as subscriber
    await prisma.subscriber.upsert({
      where: { email: customerEmail },
      update: {},
      create: {
        email: customerEmail,
        name: customerName,
        source: product.name,
      },
    })

    // If product has a downloadable file, generate token and send email
    if (product.file || product.type === 'digital_download' || product.type === 'course') {
      const token = generateDownloadToken()
      await prisma.download.create({
        data: {
          productId,
          email: customerEmail,
          token,
          expiresAt: getDownloadExpiry(7),
        },
      })

      try {
        await sendDownloadEmail({
          to: customerEmail,
          name: customerName,
          productName: product.name,
          downloadToken: token,
        })
      } catch (emailErr) {
        console.error('Failed to send download email:', emailErr)
      }
    }
  }

  return NextResponse.json({ received: true })
}
