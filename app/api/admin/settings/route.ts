import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        creatorName: body.creatorName,
        tagline: body.tagline ?? '',
        avatarUrl: body.avatarUrl ?? null,
        bio: body.bio ?? null,
        workWithMeUrl: body.workWithMeUrl ?? null,
        instagramUrl: body.instagramUrl ?? null,
        tiktokUrl: body.tiktokUrl ?? null,
        youtubeUrl: body.youtubeUrl ?? null,
        pinterestUrl: body.pinterestUrl ?? null,
        facebookUrl: body.facebookUrl ?? null,
        newsletterHeadline: body.newsletterHeadline ?? 'Get the free guide',
        newsletterSubheadline: body.newsletterSubheadline ?? '',
        newsletterButtonText: body.newsletterButtonText ?? 'Yes, Send It to Me!',
        bannerText: body.bannerText ?? null,
        bannerLink: body.bannerLink ?? null,
        bannerActive: body.bannerActive ?? false,
        footerText: body.footerText ?? '',
      },
      create: {
        id: 'singleton',
        creatorName: body.creatorName ?? 'Emma Frey',
        tagline: body.tagline ?? '',
        avatarUrl: body.avatarUrl ?? null,
        bio: body.bio ?? null,
        workWithMeUrl: body.workWithMeUrl ?? null,
        instagramUrl: body.instagramUrl ?? null,
        tiktokUrl: body.tiktokUrl ?? null,
        youtubeUrl: body.youtubeUrl ?? null,
        pinterestUrl: body.pinterestUrl ?? null,
        facebookUrl: body.facebookUrl ?? null,
        newsletterHeadline: body.newsletterHeadline ?? 'Get the free guide',
        newsletterSubheadline: body.newsletterSubheadline ?? '',
        newsletterButtonText: body.newsletterButtonText ?? 'Yes, Send It to Me!',
        bannerText: body.bannerText ?? null,
        bannerLink: body.bannerLink ?? null,
        bannerActive: body.bannerActive ?? false,
        footerText: body.footerText ?? '',
      },
    })
    return NextResponse.json(settings)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
