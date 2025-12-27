import { PDFDocument } from 'pdf-lib'

export async function mergePdfBuffers(buffers: ArrayBuffer[]) {
  const mergedPdf = await PDFDocument.create()

  for (const buffer of buffers) {
    const pdf = await PDFDocument.load(buffer)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))
  }

  return mergedPdf.save()
}
