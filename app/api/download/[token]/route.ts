import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params

    const download = await prisma.download.findUnique({
      where: { token },
      include: { product: true },
    })

    if (!download) {
      return NextResponse.json({ error: 'Invalid download link' }, { status: 404 })
    }

    if (download.used) {
      return NextResponse.json(
        { error: 'This download link has already been used' },
        { status: 410 }
      )
    }

    if (new Date() > download.expiresAt) {
      return NextResponse.json(
        { error: 'This download link has expired' },
        { status: 410 }
      )
    }

    const filePath = download.product.file
    if (!filePath) {
      return NextResponse.json({ error: 'No file associated with this product' }, { status: 404 })
    }

    // Mark as used
    await prisma.download.update({
      where: { token },
      data: { used: true },
    })

    // Serve file
    const absolutePath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''))
    let fileBuffer: Buffer

    try {
      fileBuffer = await readFile(absolutePath)
    } catch {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 })
    }

    const fileName = path.basename(absolutePath)
    const ext = path.extname(fileName).toLowerCase()

    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.mp4': 'video/mp4',
      '.mp3': 'audio/mpeg',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    }

    const contentType = mimeTypes[ext] ?? 'application/octet-stream'

    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
        'Content-Length': String(fileBuffer.length),
      },
    })
  } catch (err) {
    console.error('Download error:', err)
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}
