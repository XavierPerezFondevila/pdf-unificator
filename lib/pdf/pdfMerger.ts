// lib/pdf/pdfMerger.ts
import { PDFDocument } from 'pdf-lib'

/**
 * Fusiona múltiples PDFs dados como ArrayBuffer.
 * @param buffers Array de ArrayBuffer de PDFs
 * @returns Uint8Array del PDF resultante
 * @throws Error si hay menos de 2 PDFs o alguno no se puede cargar
 */
export async function mergePdfBuffers(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  if (!buffers || buffers.length < 2) {
    throw new Error('Se requieren al menos 2 PDFs para unir')
  }

  const mergedPdf = await PDFDocument.create()

  for (const [index, buffer] of buffers.entries()) {
    try {
      const pdf = await PDFDocument.load(buffer)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach((page) => mergedPdf.addPage(page))
    } catch (error) {
      console.warn(`No se pudo cargar el PDF en el índice ${index}`, error)
      throw new Error(`El PDF en el índice ${index} está corrupto o no es válido.`)
    }
  }

  const mergedPdfBytes = await mergedPdf.save()
  return mergedPdfBytes
}

/**
 * Fusiona muchos PDFs grandes en lotes para evitar errores de memoria.
 * @param buffers Array de ArrayBuffer de PDFs
 * @param batchSize Cantidad de PDFs a fusionar por lote (default 3)
 * @returns Uint8Array del PDF final
 */
export async function mergeLargePdfBuffers(
  buffers: ArrayBuffer[],
  batchSize = 3
): Promise<Uint8Array> {
  if (!buffers || buffers.length < 2) {
    throw new Error('Se requieren al menos 2 PDFs para unir')
  }

  let currentBuffers = [...buffers]

  while (currentBuffers.length > 1) {
    const newBuffers: ArrayBuffer[] = []

    for (let i = 0; i < currentBuffers.length; i += batchSize) {
      const batch = currentBuffers.slice(i, i + batchSize)
      const merged = await mergePdfBuffers(batch)
      
      // ✅ Convertimos a ArrayBuffer puro para TypeScript
      newBuffers.push(new Uint8Array(merged).buffer)
    }

    currentBuffers = newBuffers
  }

  return new Uint8Array(currentBuffers[0])
}

