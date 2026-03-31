import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// One-time seed endpoint — disable after first use by removing or checking env
export async function POST() {
  if (process.env.DISABLE_SEED === 'true') {
    return NextResponse.json({ error: 'Seed endpoint is disabled' }, { status: 403 })
  }

  try {
    const existing = await prisma.adminUser.findFirst()
    if (existing) {
      return NextResponse.json(
        { error: 'Admin user already exists. Seed has already been run.' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash('changeme123', 12)
    await prisma.adminUser.create({
      data: {
        email: 'admin@emmafrey.com',
        password: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created. Login at /admin/login with admin@emmafrey.com / changeme123',
    })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
