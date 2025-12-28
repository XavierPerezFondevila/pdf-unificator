import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument } from 'pdf-lib'

export const runtime = 'edge' // Opcional: para deploy en Vercel Edge Functions

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') // obtenemos todos los archivos bajo el mismo nombre

    if (!files || files.length < 2) {
      return NextResponse.json(
        { message: 'Se requieren al menos 2 PDFs para unir' },
        { status: 400 }
      )
    }

    // Convertimos los archivos a ArrayBuffer
    const buffers: ArrayBuffer[] = []
    for (const file of files) {
      if (!(file instanceof File)) continue
      const arrayBuffer = await file.arrayBuffer()
      buffers.push(arrayBuffer)
    }

    if (buffers.length < 2) {
      return NextResponse.json(
        { message: 'Se requieren al menos 2 PDFs válidos' },
        { status: 400 }
      )
    }

    // Fusionamos los PDFs
    const mergedPdf = await PDFDocument.create()
    for (const buffer of buffers) {
      const pdf = await PDFDocument.load(buffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()

    return new NextResponse(Buffer.from(mergedPdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="archivo-unificado.pdf"',
      },
    })
  } catch (error) {
    console.error('Error uniendo PDFs:', error)
    return NextResponse.json(
      { message: 'Error al unir los PDFs' },
      { status: 500 }
    )
  }
}
