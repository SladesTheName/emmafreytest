import { prisma } from '@/lib/prisma'
import { ProfileHeader } from '@/components/storefront/ProfileHeader'
import { FeaturedBanner } from '@/components/storefront/FeaturedBanner'
import { ProductCard } from '@/components/storefront/ProductCard'
import { TestimonialsCarousel } from '@/components/storefront/TestimonialsCarousel'
import { EmailCaptureBlock } from '@/components/storefront/EmailCaptureBlock'
import { AboutSection } from '@/components/storefront/AboutSection'
import Link from 'next/link'

export const revalidate = 60

async function getStorefrontData() {
  const [settings, products, testimonials] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.product.findMany({
      where: { status: 'active' },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ])
  return { settings, products, testimonials }
}

export default async function StorefrontPage() {
  const { settings, products, testimonials } = await getStorefrontData()

  const socialLinks = [
    { platform: 'instagram', url: settings?.instagramUrl ?? '' },
    { platform: 'tiktok', url: settings?.tiktokUrl ?? '' },
    { platform: 'youtube', url: settings?.youtubeUrl ?? '' },
    { platform: 'pinterest', url: settings?.pinterestUrl ?? '' },
    { platform: 'facebook', url: settings?.facebookUrl ?? '' },
  ].filter((s) => s.url)

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <main className="mx-auto max-w-[480px] sm:max-w-[560px] pb-12">
        {/* Hero / Profile Header */}
        <ProfileHeader
          creatorName={settings?.creatorName ?? 'Emma Frey'}
          tagline={settings?.tagline}
          avatarUrl={settings?.avatarUrl}
          socialLinks={socialLinks}
        />

        {/* Featured Banner */}
        {settings?.bannerActive && settings.bannerText && (
          <div className="mt-4">
            <FeaturedBanner
              text={settings.bannerText}
              link={settings.bannerLink}
            />
          </div>
        )}

        {/* Products Section */}
        {products.length > 0 && (
          <section className="px-4 pt-6 pb-2">
            <h2 className="font-display text-xl font-semibold text-dark mb-4">
              Resources & Products
            </h2>
            <div className="flex flex-col gap-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* About Section */}
        <AboutSection
          bio={settings?.bio}
          avatarUrl={settings?.avatarUrl}
          creatorName={settings?.creatorName ?? 'Emma Frey'}
          workWithMeUrl={settings?.workWithMeUrl}
        />

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <TestimonialsCarousel testimonials={testimonials} />
        )}

        {/* Email Capture */}
        <EmailCaptureBlock
          headline={settings?.newsletterHeadline ?? 'Get the free guide'}
          subheadline={
            settings?.newsletterSubheadline ??
            'Join thousands of women building income online'
          }
          buttonText={settings?.newsletterButtonText ?? 'Yes, Send It to Me!'}
        />

        {/* Footer */}
        <footer className="px-4 py-6 text-center border-t border-brand-border mt-4">
          {settings?.footerText ? (
            <p className="text-xs text-brand-muted mb-2">{settings.footerText}</p>
          ) : null}
          <div className="flex items-center justify-center gap-4 text-xs text-brand-muted">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span>·</span>
            <span>© {new Date().getFullYear()} {settings?.creatorName ?? 'Emma Frey'}</span>
          </div>
          <p className="text-[11px] text-brand-muted/60 mt-3">
            Built with ❤️
          </p>
        </footer>
      </main>
    </div>
  )
}
