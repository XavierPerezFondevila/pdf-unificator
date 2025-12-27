import { NextResponse } from 'next/server'
import { mergePdfBuffers } from '@/lib/pdf/pdfMerger'

export async function POST(req: Request) {
  // Obtener los archivos del formulario
  const formData = await req.formData()
  const files = formData.getAll('files') as File[]

  // Convertir cada archivo en ArrayBuffer
  const buffers = await Promise.all(files.map(file => file.arrayBuffer()))

  // Unir los PDFs (merge)
  const mergedPdf = await mergePdfBuffers(buffers)

  // Convertir a Uint8Array explícitamente para NextResponse
  const mergedPdfUint8 = new Uint8Array(mergedPdf)

  return new NextResponse(mergedPdfUint8, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="archivo-unificado.pdf"',
    },
  })
}
