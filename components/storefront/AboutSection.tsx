import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

interface AboutSectionProps {
  bio?: string | null
  avatarUrl?: string | null
  creatorName: string
  workWithMeUrl?: string | null
}

export function AboutSection({ bio, avatarUrl, creatorName, workWithMeUrl }: AboutSectionProps) {
  if (!bio) return null

  const initials = creatorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const paragraphs = bio.split('\n').filter(Boolean)

  return (
    <section className="px-4 py-6">
      <div className="bg-white rounded-3xl p-6 card-shadow border border-brand-border/50">
        <div className="flex items-center gap-4 mb-4">
          {avatarUrl ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
              <Image
                src={avatarUrl}
                alt={creatorName}
                width={56}
                height={56}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-display font-bold text-xl">{initials}</span>
            </div>
          )}
          <div>
            <p className="text-xs font-mono text-brand-muted uppercase tracking-wider mb-0.5">About</p>
            <h2 className="font-display text-lg font-semibold text-dark">{creatorName}</h2>
          </div>
        </div>

        <div className="space-y-3">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-brand-muted text-sm leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {workWithMeUrl && (
          <div className="mt-5">
            <Button variant="outline" size="sm" asChild>
              <a href={workWithMeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
                Work With Me
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
