import { prisma } from '@/lib/prisma'
import { SubscribersClient } from './SubscribersClient'

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <SubscribersClient initialSubscribers={subscribers} />
}
