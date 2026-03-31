'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

interface FeaturedBannerProps {
  text: string
  link?: string | null
}

export function FeaturedBanner({ text, link }: FeaturedBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const content = (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
      <p className="text-sm font-medium text-dark truncate">{text}</p>
    </div>
  )

  return (
    <div className="animate-fade-in-up stagger-1 mx-4 mb-2">
      <div className="relative flex items-center gap-2 bg-white rounded-2xl px-4 py-3 card-shadow border border-brand-border">
        {link ? (
          <a
            href={link}
            className="flex items-center gap-3 flex-1 min-w-0 hover:text-primary transition-colors"
            target={link.startsWith('http') ? '_blank' : undefined}
            rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {content}
            <span className="text-xs font-medium text-primary flex-shrink-0 font-mono">
              View →
            </span>
          </a>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">{content}</div>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 rounded-full text-brand-muted hover:text-dark hover:bg-secondary transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
