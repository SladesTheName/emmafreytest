'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Mail } from 'lucide-react'

interface EmailCaptureBlockProps {
  headline: string
  subheadline: string
  buttonText: string
}

export function EmailCaptureBlock({ headline, subheadline, buttonText }: EmailCaptureBlockProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source: 'newsletter',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-4 py-8">
      <div
        className="rounded-3xl p-6 sm:p-8 text-center"
        style={{
          background:
            'linear-gradient(135deg, rgba(201,116,143,0.1) 0%, rgba(139,107,138,0.08) 50%, rgba(201,116,143,0.06) 100%)',
          border: '1px solid rgba(201,116,143,0.2)',
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center mx-auto mb-4">
          <Mail className="w-5 h-5 text-primary" />
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-dark mb-2">
              You&apos;re in! 🎉
            </h3>
            <p className="text-brand-muted text-sm max-w-[240px]">
              Welcome to the community! Check your email for a special welcome message.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-bold text-dark mb-2">{headline}</h2>
            <p className="text-brand-muted text-sm leading-relaxed mb-6 max-w-[280px] mx-auto">
              {subheadline}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-sm mx-auto">
              <Input
                type="text"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-center"
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-center"
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {buttonText}
              </Button>
              <p className="text-xs text-brand-muted">
                No spam. Just value. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
