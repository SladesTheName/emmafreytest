'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProductModal } from './ProductModal'
import { ExternalLink } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  type: string
  thumbnail?: string | null
  externalUrl?: string | null
  ctaLabel: string
  badge?: string | null
}

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const isFree = product.price === 0
  const isExternal = product.type === 'external_link'
  const isWaitlist = product.type === 'waitlist'

  const staggerClass = `stagger-${Math.min(index + 1, 6)}`

  const handleClick = () => {
    if (isExternal && product.externalUrl) {
      window.open(product.externalUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setModalOpen(true)
  }

  return (
    <>
      <div
        className={`animate-fade-in-up ${staggerClass} group relative bg-white rounded-3xl card-shadow border border-brand-border/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:card-shadow-hover cursor-pointer`}
        onClick={handleClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] bg-gradient-rose overflow-hidden">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center gradient-rose">
              <span className="font-display text-4xl font-bold text-primary/40 select-none">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
          {/* Badge overlay */}
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge variant={isFree ? 'free' : 'default'} className="uppercase tracking-wider text-[10px] font-semibold px-2.5 py-0.5">
                {product.badge}
              </Badge>
            </div>
          )}
          {/* Price overlay */}
          <div className="absolute top-3 right-3">
            <div className={`rounded-full px-3 py-1 text-xs font-bold font-mono shadow-sm ${
              isFree
                ? 'bg-emerald-500 text-white'
                : 'bg-dark text-white'
            }`}>
              {formatPrice(product.price)}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-dark text-base leading-snug mb-1.5 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>

          <Button
            size="sm"
            variant={isFree ? 'outline' : 'default'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              handleClick()
            }}
          >
            {isExternal && <ExternalLink className="w-3.5 h-3.5" />}
            {isWaitlist ? 'Join Waitlist' : product.ctaLabel}
          </Button>
        </div>
      </div>

      {!isExternal && (
        <ProductModal
          product={product}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
