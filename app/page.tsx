'use client'

import { useState } from 'react'
import { PdfFile } from '@/types/pdf'
import FileDropzone from './components/FileDropzone'
import PdfList from './components/PdfList'
import Toast from './components/Toast'
import { mergeLargePdfBuffers } from '@/lib/pdf/pdfMerger'

export default function Home() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Añadir archivos a la lista
  function addFiles(files: File[]) {
    const newPdfs = files.map(file => ({
      id: crypto.randomUUID(),
      file,
    }))
    setPdfs(prev => [...prev, ...newPdfs])
  }

  // Eliminar un PDF de la lista
  function removePdf(id: string) {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id))
  }

  async function mergePdfs() {
    if (pdfs.length < 2) {
      setToastMessage('Debes añadir al menos 2 PDFs para unir')
      setToastVisible(true)
      return
    }

    setLoading(true)
    try {
      const buffers = await Promise.all(pdfs.map(p => p.file.arrayBuffer()))
      const mergedPdfBytes = await mergeLargePdfBuffers(buffers, 3)

      const blob = new Blob([new Uint8Array(mergedPdfBytes).buffer], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'archivo-unificado.pdf'
      a.click()

      setToastMessage('PDF unido y descargado correctamente')
      setToastVisible(true)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (error) {
      console.error(error)
      setToastMessage('Error al unir los PDFs')
      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }





  return (
    <main className="max-w-2xl my-10 mx-auto flex flex-col items-center gap-6">
      <h1 className="text-center text-4xl font-bold">Une tus PDFs aquí</h1>

      <FileDropzone onFilesAdded={addFiles} />
      <div className="flex flex-col">
        <PdfList pdfs={pdfs} setPdfs={setPdfs} onRemove={removePdf} />
      </div>

      <button
        onClick={mergePdfs}
        disabled={loading || pdfs.length < 2}
        className="
          mt-4 w-full py-3 rounded-xl font-medium
          bg-blue-600 text-white
          hover:bg-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        "
      >
        {loading ? 'Uniendo...' : 'Unir PDFs'}
      </button>

      {toastVisible && (
        <Toast message={toastMessage} onClose={() => setToastVisible(false)} />
      )}
    </main>
  )
}
