import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import bcrypt from 'bcryptjs'
import path from 'path'

const dbUrl = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Admin user
  const hashedPassword = await bcrypt.hash('changeme123', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@emmafrey.com' },
    update: {},
    create: {
      email: 'admin@emmafrey.com',
      password: hashedPassword,
    },
  })
  console.log('✅ Admin user: admin@emmafrey.com / changeme123')

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      creatorName: 'Emma Frey',
      tagline: 'Helping women build income online — one digital product at a time.',
      bio: "I'm Emma — a digital marketer and online educator helping women just like you escape the 9-5 grind and build a business you love. I've helped hundreds of women launch their first digital product, grow their audience, and create real, consistent income from their phone.\n\nNo fluff. No gatekeeping. Just real strategy that works.",
      newsletterHeadline: 'Grab Your Free Guide',
      newsletterSubheadline: 'Join 5,000+ women building income online. Get my free Content to Cash Blueprint delivered instantly.',
      newsletterButtonText: 'Yes, Send It to Me!',
      bannerText: '🎉 New Free Masterclass — How to Make Your First $1,000 Online',
      bannerLink: '#email-capture',
      bannerActive: true,
      footerText: 'Built with love for creators everywhere.',
    },
  })
  console.log('✅ Site settings')

  // Products
  const productData = [
    {
      name: 'The Content to Cash Blueprint',
      description: "The step-by-step PDF guide that shows you exactly how to turn your social media content into a consistent income stream — even if you're starting from zero.\n\nInside you'll discover:\n• The 3 content types that convert followers into buyers\n• My exact posting framework for building trust fast\n• How to price your first digital product\n• The 5-day launch formula I used to make $2,000 on my very first product",
      price: 0,
      type: 'lead_magnet',
      ctaLabel: 'Send Me the Blueprint',
      badge: 'FREE',
      status: 'active',
      sortOrder: 0,
      file: '/downloads/content-to-cash-blueprint.pdf',
    },
    {
      name: 'Digital Product Launch Playbook',
      description: "Your complete A-to-Z roadmap for launching your first digital product in 30 days or less — even if you have no audience, no tech skills, and no idea where to start.\n\nThis 80-page playbook includes worksheets, templates, and swipe files for every step of the launch process.",
      price: 27,
      type: 'digital_download',
      ctaLabel: 'Get the Playbook',
      badge: 'PLAYBOOK',
      status: 'active',
      sortOrder: 1,
      file: '/downloads/digital-product-launch-playbook.pdf',
    },
    {
      name: 'Work With Me — Book a Strategy Call',
      description: "Ready to stop guessing and start scaling? Book a 1:1 Strategy Call and let's build a custom roadmap for your online business.\n\nIn our 60-minute call, we'll map out the fastest path to your first (or next) $10K month.",
      price: 0,
      type: 'external_link',
      externalUrl: 'https://calendly.com/emmafrey',
      ctaLabel: 'Book a Call',
      badge: '1:1 CALL',
      status: 'active',
      sortOrder: 2,
    },
    {
      name: 'Monetize Your Audience Masterclass',
      description: "The live 3-day masterclass where I walk you through my complete system for monetizing your social media audience — whether you have 500 or 500,000 followers.\n\nJoin the waitlist for early access + founding member pricing.",
      price: 97,
      type: 'waitlist',
      ctaLabel: 'Join the Waitlist',
      badge: 'MASTERCLASS',
      status: 'active',
      sortOrder: 3,
    },
  ]

  for (const product of productData) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } })
    if (!existing) {
      await prisma.product.create({ data: product })
    }
  }
  console.log('✅ Products')

  // Testimonials
  const testimonialData = [
    {
      quote: "Emma's guide changed everything for me. I made my first sale within 48 hours of implementing her content strategy. I literally cried happy tears.",
      authorName: 'Sarah M.',
      source: 'Instagram',
      starRating: 5,
      sortOrder: 0,
    },
    {
      quote: "I was so scared to start. Emma made it feel totally doable. Her step-by-step approach is unlike anything I've seen. Best $27 I've ever spent — hands down.",
      authorName: 'Jordan K.',
      starRating: 5,
      sortOrder: 1,
    },
    {
      quote: "The strategy call alone was worth 10x the price. Emma saw gaps in my business I didn't even know were there. She's the real deal — no fluff, just results.",
      authorName: 'Taylor R.',
      starRating: 5,
      sortOrder: 2,
    },
  ]

  for (const testimonial of testimonialData) {
    const existing = await prisma.testimonial.findFirst({ where: { authorName: testimonial.authorName } })
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial })
    }
  }
  console.log('✅ Testimonials')

  console.log('\n🎉 Seed complete!')
  console.log('→ Admin login: admin@emmafrey.com / changeme123')
  console.log('→ Storefront: http://localhost:3000')
  console.log('→ Admin: http://localhost:3000/admin')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
