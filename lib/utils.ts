import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { randomBytes } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  if (price === 0) return 'FREE'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function generateDownloadToken(): string {
  return randomBytes(32).toString('hex')
}

export function getDownloadExpiry(days = 7): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}
