import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  className?: string
  icon?: React.ReactNode
}

export function StatsCard({ title, value, subtitle, className, icon }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-2xl p-5 card-shadow border border-brand-border', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-brand-muted uppercase tracking-wider">{title}</p>
          <p className="font-display text-3xl font-bold text-dark mt-1">{value}</p>
          {subtitle && <p className="text-xs text-brand-muted mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
