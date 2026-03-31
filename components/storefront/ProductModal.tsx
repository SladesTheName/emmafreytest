'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  type: string
  thumbnail?: string | null
  ctaLabel: string
  badge?: string | null
}

interface ProductModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const isFree = product.price === 0
  const isWaitlist = product.type === 'waitlist'
  const isLeadMagnet = product.type === 'lead_magnet'

  const handleBuy = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  const handleFreeSubmit = async (e: React.FormEvent) => {
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
          productId: product.id,
          source: product.name,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      setSubmitted(true)
      toast.success('Check your email for your download link!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSubmitted(false)
    setName('')
    setEmail('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-md">
        {/* Product image */}
        {product.thumbnail && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-3xl -mx-0 -mt-0">
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className={!product.thumbnail ? 'pt-8' : ''}>
          <DialogHeader className="px-6 pt-4 pb-0">
            <div className="flex items-start gap-2 mb-2">
              {product.badge && (
                <Badge variant={isFree ? 'free' : 'default'} className="uppercase tracking-wider text-[10px]">
                  {product.badge}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-xl leading-snug">{product.name}</DialogTitle>
            <div className="flex items-center gap-3 mt-2">
              <span className={`font-mono font-bold text-lg ${isFree ? 'text-emerald-600' : 'text-dark'}`}>
                {formatPrice(product.price)}
              </span>
            </div>
          </DialogHeader>

          <div className="px-6 py-4">
            {submitted ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="font-display text-lg font-semibold text-dark mb-2">
                  {isWaitlist ? "You're on the waitlist!" : "Check your inbox!"}
                </h3>
                <p className="text-brand-muted text-sm">
                  {isWaitlist
                    ? "We'll notify you as soon as spots open up."
                    : "We've sent your download link to " + email}
                </p>
                <Button onClick={handleClose} className="mt-6" variant="secondary">
                  Done
                </Button>
              </div>
            ) : (
              <>
                <p className="text-brand-muted text-sm leading-relaxed mb-5 whitespace-pre-line">
                  {product.description}
                </p>

                {/* Paid product */}
                {!isFree && !isWaitlist && !isLeadMagnet && (
                  <Button
                    className="w-full"
                    size="lg"
                    loading={loading}
                    onClick={handleBuy}
                  >
                    Buy Now — {formatPrice(product.price)}
                  </Button>
                )}

                {/* Free lead magnet or waitlist — email capture */}
                {(isFree || isWaitlist || isLeadMagnet) && (
                  <form onSubmit={handleFreeSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="modal-name">First Name</Label>
                      <Input
                        id="modal-name"
                        placeholder="Your first name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="modal-email">Email Address *</Label>
                      <Input
                        id="modal-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      loading={loading}
                    >
                      {isWaitlist ? 'Join the Waitlist' : product.ctaLabel}
                    </Button>
                    <p className="text-xs text-brand-muted text-center">
                      No spam, ever. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
