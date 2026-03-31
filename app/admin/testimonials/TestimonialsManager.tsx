'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Star, Plus, Pencil, Trash2 } from 'lucide-react'

interface Testimonial {
  id: string
  quote: string
  authorName: string
  avatarUrl: string | null
  source: string | null
  starRating: number
  sortOrder: number
}

const emptyForm = {
  quote: '',
  authorName: '',
  avatarUrl: '',
  source: '',
  starRating: 5,
}

export function TestimonialsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState(initialTestimonials)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEdit = (t: Testimonial) => {
    setEditingId(t.id)
    setForm({
      quote: t.quote,
      authorName: t.authorName,
      avatarUrl: t.avatarUrl ?? '',
      source: t.source ?? '',
      starRating: t.starRating,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.quote.trim() || !form.authorName.trim()) {
      return toast.error('Quote and author name required')
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        avatarUrl: form.avatarUrl || null,
        source: form.source || null,
      }
      const res = await fetch(
        editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')

      if (editingId) {
        setTestimonials((prev) => prev.map((t) => (t.id === editingId ? data : t)))
        toast.success('Testimonial updated')
      } else {
        setTestimonials((prev) => [...prev, data])
        toast.success('Testimonial added')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      toast.success('Testimonial deleted')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">Testimonials</h1>
          <p className="text-brand-muted text-sm mt-1">{testimonials.length} testimonials</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="space-y-3">
        {testimonials.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center card-shadow border border-brand-border">
            <p className="text-brand-muted">No testimonials yet.</p>
            <Button onClick={openCreate} className="mt-4" size="sm">
              <Plus className="w-4 h-4" />
              Add Testimonial
            </Button>
          </div>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-4 card-shadow border border-brand-border flex gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex gap-0.5 mb-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-3 h-3 ${s <= t.starRating ? 'fill-amber-400 text-amber-400' : 'text-brand-border'}`} />
                ))}
              </div>
              <p className="text-sm text-dark line-clamp-2 mb-1">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs text-brand-muted">
                — {t.authorName}{t.source ? ` · ${t.source}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => openEdit(t)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-dark hover:bg-secondary transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                disabled={deletingId === t.id}
                className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div>
              <Label htmlFor="t-quote">Quote *</Label>
              <Textarea
                id="t-quote"
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                placeholder="What they said..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="t-author">Author Name *</Label>
              <Input
                id="t-author"
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                placeholder="Sarah M."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="t-source">Source (optional)</Label>
              <Input
                id="t-source"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Instagram, Google..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="t-avatar">Avatar URL (optional)</Label>
              <Input
                id="t-avatar"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Star Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1,2,3,4,5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm({ ...form, starRating: s })}
                    className="p-1"
                  >
                    <Star className={`w-6 h-6 transition-colors ${s <= form.starRating ? 'fill-amber-400 text-amber-400' : 'text-brand-border hover:text-amber-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} loading={saving} className="flex-1">
                {editingId ? 'Save Changes' : 'Add Testimonial'}
              </Button>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
