'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Trash2, Download } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  name: string | null
  source: string | null
  createdAt: Date
}

export function SubscribersClient({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
      toast.success('Subscriber removed')
    } catch {
      toast.error('Failed to remove subscriber')
    } finally {
      setDeletingId(null)
    }
  }

  const exportCSV = () => {
    const rows = [
      ['Name', 'Email', 'Source', 'Date'],
      ...subscribers.map((s) => [
        s.name ?? '',
        s.email,
        s.source ?? '',
        new Date(s.createdAt).toLocaleDateString(),
      ]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-dark">Subscribers</h1>
          <p className="text-brand-muted text-sm mt-1">{subscribers.length} total subscribers</p>
        </div>
        <Button onClick={exportCSV} variant="secondary" size="sm" disabled={subscribers.length === 0}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-2xl card-shadow border border-brand-border overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">No subscribers yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-brand-muted">Email</th>
                <th className="text-left px-4 py-3 font-medium text-brand-muted hidden sm:table-cell">Name</th>
                <th className="text-left px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Date</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-brand-border/50 last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-dark">{sub.email}</td>
                  <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">{sub.name ?? '—'}</td>
                  <td className="px-4 py-3 text-brand-muted hidden md:table-cell">{sub.source ?? '—'}</td>
                  <td className="px-4 py-3 text-brand-muted hidden md:table-cell">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={deletingId === sub.id}
                      className="p-1.5 rounded-lg text-brand-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
