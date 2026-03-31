'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  quote: string
  authorName: string
  avatarUrl?: string | null
  source?: string | null
  starRating: number
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-brand-border'
          }`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.authorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="flex-shrink-0 w-72 bg-white rounded-3xl p-5 card-shadow border border-brand-border/50">
      <StarRating rating={testimonial.starRating} />
      <p className="text-brand-text text-sm leading-relaxed mt-3 mb-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {testimonial.avatarUrl ? (
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={testimonial.avatarUrl}
              alt={testimonial.authorName}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold font-display">{initials}</span>
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-dark">{testimonial.authorName}</p>
          {testimonial.source && (
            <p className="text-xs text-brand-muted">{testimonial.source}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (testimonials.length === 0) return null

  return (
    <section className="py-8">
      <h2 className="font-display text-xl font-semibold text-dark px-4 mb-4">
        What people are saying
      </h2>

      {/* Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 px-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {testimonials.map((t) => (
          <div key={t.id} className="snap-start">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </section>
  )
}
