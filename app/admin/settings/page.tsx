import { prisma } from '@/lib/prisma'
import { SettingsClient } from './SettingsClient'

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  return <SettingsClient initialSettings={settings} />
}
