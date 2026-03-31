import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium font-mono transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/15 text-primary',
        free: 'bg-emerald-100 text-emerald-700',
        secondary: 'bg-secondary text-brand-text',
        accent: 'bg-accent/15 text-accent',
        outline: 'border border-brand-border text-brand-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
