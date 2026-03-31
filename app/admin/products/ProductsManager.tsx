'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  type: string
  thumbnail: string | null
  file: string | null
  externalUrl: string | null
  ctaLabel: string
  badge: string | null
  status: string
  sortOrder: number
}

const PRODUCT_TYPES = [
  { value: 'digital_download', label: 'Digital Download' },
  { value: 'lead_magnet', label: 'Free Lead Magnet' },
  { value: 'external_link', label: 'External Link' },
  { value: 'course', label: 'Course / Cohort' },
  { value: 'waitlist', label: 'Waitlist' },
]

const emptyProduct = {
  name: '',
  description: '',
  price: 0,
  type: 'digital_download',
  thumbnail: '',
  file: '',
  externalUrl: '',
  ctaLabel: 'Get It Now',
  badge: '',
  status: 'active',
}

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingProduct(null)
    setForm(emptyProduct)
    setDialogOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      type: product.type,
      thumbnail: product.thumbnail ?? '',
      file: product.file ?? '',
      externalUrl: product.externalUrl ?? '',
      ctaLabel: product.ctaLabel,
      badge: product.badge ?? '',
      status: product.status,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error('Product name required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        thumbnail: form.thumbnail || null,
        file: form.file || null,
        externalUrl: form.externalUrl || null,
        badge: form.badge || null,
      }

      const res = await fetch(
        editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products',
        {
          method: editingProduct ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed')

      if (editingProduct) {
        setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? data : p)))
        toast.success('Product updated')
      } else {
        setProducts((prev) => [...prev, data])
        toast.success('Product created')
      }
      setDialogOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active'
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, status: newStatus }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? data : p)))
      toast.success(`Product ${newStatus === 'active' ? 'published' : 'set to draft'}`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">Products</h1>
          <p className="text-brand-muted text-sm mt-1">{products.length} products total</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <div className="space-y-3">
        {products.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center card-shadow border border-brand-border">
            <p className="text-brand-muted">No products yet. Add your first one!</p>
            <Button onClick={openCreate} className="mt-4" size="sm">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        )}

        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl p-4 card-shadow border border-brand-border flex items-center gap-4"
          >
            <GripVertical className="w-4 h-4 text-brand-muted flex-shrink-0 cursor-grab" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-dark text-sm truncate">{product.name}</p>
                {product.badge && (
                  <Badge variant="default" className="text-[10px] uppercase">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-muted">
                  {PRODUCT_TYPES.find((t) => t.value === product.type)?.label}
                </span>
                <span className="text-brand-border">·</span>
                <span className="text-xs font-mono font-semibold text-dark">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleStatus(product)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-dark hover:bg-secondary transition-colors"
                title={product.status === 'active' ? 'Set to draft' : 'Publish'}
              >
                {product.status === 'active' ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => openEdit(product)}
                className="p-1.5 rounded-lg text-brand-muted hover:text-dark hover:bg-secondary transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                disabled={deletingId === product.id}
                className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-6 space-y-4">
            <div>
              <Label htmlFor="p-name">Name *</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="p-desc">Description *</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe your product..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p-price">Price (USD)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p-cta">CTA Button Label</Label>
                <Input
                  id="p-cta"
                  value={form.ctaLabel}
                  onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                  placeholder="Get It Now"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="p-badge">Badge Label</Label>
                <Input
                  id="p-badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="GUIDE, COURSE, FREE..."
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-thumbnail">Thumbnail URL</Label>
              <Input
                id="p-thumbnail"
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="/uploads/thumbnail.jpg"
                className="mt-1"
              />
            </div>
            {(form.type === 'digital_download' || form.type === 'lead_magnet') && (
              <div>
                <Label htmlFor="p-file">Download File Path</Label>
                <Input
                  id="p-file"
                  value={form.file}
                  onChange={(e) => setForm({ ...form, file: e.target.value })}
                  placeholder="/downloads/my-guide.pdf"
                  className="mt-1"
                />
              </div>
            )}
            {(form.type === 'external_link' || form.type === 'course') && (
              <div>
                <Label htmlFor="p-url">External URL</Label>
                <Input
                  id="p-url"
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            )}
            <div className="flex items-center gap-3">
              <Switch
                id="p-status"
                checked={form.status === 'active'}
                onCheckedChange={(checked) =>
                  setForm({ ...form, status: checked ? 'active' : 'draft' })
                }
              />
              <Label htmlFor="p-status">
                {form.status === 'active' ? 'Published' : 'Draft'}
              </Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} loading={saving} className="flex-1">
                {editingProduct ? 'Save Changes' : 'Create Product'}
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
