import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">← Back</Link>
          </Button>
        </div>

        <div className="bg-white rounded-3xl p-8 card-shadow border border-brand-border prose prose-sm max-w-none">
          <h1 className="font-display text-3xl font-bold text-dark mb-2">Privacy Policy</h1>
          <p className="text-brand-muted text-sm mb-8">Last updated: {new Date().getFullYear()}</p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">Information We Collect</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            We collect information you provide directly to us, such as your name and email address
            when you subscribe to our newsletter, purchase a product, or contact us.
          </p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">How We Use Your Information</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            We use the information we collect to deliver our products and services, send you
            promotional communications (with your consent), and improve our offerings.
          </p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">Email Communications</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            By providing your email address, you consent to receive emails from us including product
            updates, tips, and promotions. You can unsubscribe at any time by clicking the unsubscribe
            link in any email we send.
          </p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">Data Security</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your
            personal information. Payment information is processed securely via Stripe and never stored
            on our servers.
          </p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">Third-Party Services</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            We use Stripe for payment processing and Resend for email delivery. These services have
            their own privacy policies that govern the use of your information.
          </p>

          <h2 className="font-display text-xl font-semibold text-dark mt-6 mb-3">Contact Us</h2>
          <p className="text-brand-muted text-sm leading-relaxed">
            If you have questions about this privacy policy or how we handle your data, please contact
            us at{' '}
            <a href="mailto:hello@emmafrey.com" className="text-primary hover:underline">
              hello@emmafrey.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
