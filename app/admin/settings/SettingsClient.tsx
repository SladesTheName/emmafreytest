'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

interface SiteSettings {
  id: string
  creatorName: string
  tagline: string
  avatarUrl: string | null
  bio: string | null
  workWithMeUrl: string | null
  instagramUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  pinterestUrl: string | null
  facebookUrl: string | null
  newsletterHeadline: string
  newsletterSubheadline: string
  newsletterButtonText: string
  bannerText: string | null
  bannerLink: string | null
  bannerActive: boolean
  footerText: string
}

export function SettingsClient({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const defaults: Omit<SiteSettings, 'id'> = {
    creatorName: 'Emma Frey',
    tagline: 'Helping women build income online — one digital product at a time.',
    avatarUrl: null,
    bio: null,
    workWithMeUrl: null,
    instagramUrl: null,
    tiktokUrl: null,
    youtubeUrl: null,
    pinterestUrl: null,
    facebookUrl: null,
    newsletterHeadline: 'Get the free guide',
    newsletterSubheadline: 'Join thousands of women building income online',
    newsletterButtonText: 'Yes, Send It to Me!',
    bannerText: null,
    bannerLink: null,
    bannerActive: false,
    footerText: '',
  }

  const [form, setForm] = useState<Omit<SiteSettings, 'id'>>({
    ...defaults,
    ...initialSettings,
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Save failed')
      }
      toast.success('Settings saved!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const field = (key: keyof typeof form, label: string, props?: object) => (
    <div>
      <Label htmlFor={key as string}>{label}</Label>
      <Input
        id={key as string}
        value={(form[key] as string) ?? ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value || null })}
        className="mt-1"
        {...props}
      />
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">Settings</h1>
          <p className="text-brand-muted text-sm mt-1">Manage your storefront content</p>
        </div>
        <Button onClick={handleSave} loading={saving} size="sm">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Section title="Profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('creatorName', 'Creator Name')}
            {field('avatarUrl', 'Avatar URL')}
          </div>
          {field('tagline', 'Tagline')}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={form.bio ?? ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value || null })}
              className="mt-1 min-h-[120px]"
              placeholder="Tell your story..."
            />
          </div>
          {field('workWithMeUrl', 'Work With Me URL')}
        </Section>

        {/* Social Links */}
        <Section title="Social Links">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('instagramUrl', 'Instagram URL', { placeholder: 'https://instagram.com/...' })}
            {field('tiktokUrl', 'TikTok URL', { placeholder: 'https://tiktok.com/@...' })}
            {field('youtubeUrl', 'YouTube URL', { placeholder: 'https://youtube.com/...' })}
            {field('pinterestUrl', 'Pinterest URL', { placeholder: 'https://pinterest.com/...' })}
            {field('facebookUrl', 'Facebook URL', { placeholder: 'https://facebook.com/...' })}
          </div>
        </Section>

        {/* Newsletter */}
        <Section title="Newsletter / Email Capture">
          {field('newsletterHeadline', 'Headline')}
          {field('newsletterSubheadline', 'Subheadline')}
          {field('newsletterButtonText', 'Button Text')}
        </Section>

        {/* Featured Banner */}
        <Section title="Featured Banner">
          <div className="flex items-center gap-3 mb-4">
            <Switch
              id="banner-active"
              checked={form.bannerActive}
              onCheckedChange={(checked) => setForm({ ...form, bannerActive: checked })}
            />
            <Label htmlFor="banner-active">Banner active</Label>
          </div>
          {field('bannerText', 'Banner Text', { placeholder: 'New Free Masterclass — Save Your Spot' })}
          {field('bannerLink', 'Banner Link', { placeholder: 'https://... or #email-capture' })}
        </Section>

        {/* Footer */}
        <Section title="Footer">
          {field('footerText', 'Footer Text', { placeholder: 'Custom footer message...' })}
        </Section>
      </div>

      <div className="mt-6">
        <Button onClick={handleSave} loading={saving}>
          Save All Changes
        </Button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow border border-brand-border space-y-4">
      <h2 className="font-semibold text-dark text-base">{title}</h2>
      {children}
    </div>
  )
}
