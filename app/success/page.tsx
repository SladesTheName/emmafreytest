import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--surface)' }}>
      <div className="max-w-sm w-full text-center">
        <div
          className="bg-white rounded-3xl p-8 card-shadow border border-brand-border"
          style={{ background: 'linear-gradient(135deg, #FDF7F2 0%, #FDF0E8 100%)' }}
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>

          <h1 className="font-display text-2xl font-bold text-dark mb-2">
            Thank you! 🎉
          </h1>

          <p className="text-brand-muted text-sm leading-relaxed mb-3">
            Your purchase was successful! Check your email — we&apos;ve sent your download link and
            receipt there.
          </p>

          <p className="text-xs text-brand-muted mb-6">
            Didn&apos;t receive an email? Check your spam folder or contact us.
          </p>

          <Button asChild className="w-full">
            <Link href="/">Back to Storefront</Link>
          </Button>
        </div>

        <p className="text-xs text-brand-muted mt-6">
          Questions? Email{' '}
          <a href="mailto:hello@emmafrey.com" className="text-primary hover:underline">
            hello@emmafrey.com
          </a>
        </p>
      </div>
    </div>
  )
}
