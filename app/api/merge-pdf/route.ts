import { NextResponse } from 'next/server'
import { mergePdfBuffers } from '@/lib/pdf/pdfMerger'

export async function POST(req: Request) {
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  const buffers = await Promise.all(
    files.map(file => file.arrayBuffer())
  )

  const mergedPdf = await mergePdfBuffers(buffers)

  return new NextResponse(mergedPdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="merged.pdf"',
    },
  })
}
