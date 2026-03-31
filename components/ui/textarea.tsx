import * as React from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text',
          'placeholder:text-brand-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-all duration-200 resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Texta rea.displayName = 'Textarea'

export { Textarea }
