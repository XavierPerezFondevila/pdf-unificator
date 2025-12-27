'use client'

import { useState } from 'react'
import { PdfFile } from '@/types/pdf'
import FileDropzone from './components/FileDropzone'
import PdfList from './components/PdfList'
import Toast from './components/Toast'

export default function Home() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [loading, setLoading] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  function addFiles(files: File[]) {
    const newPdfs = files.map(file => ({
      id: crypto.randomUUID(),
      file,
    }))
    setPdfs(prev => [...prev, ...newPdfs])
  }

  async function mergePdfs() {
    setLoading(true)
    try {
      const formData = new FormData()
      pdfs.forEach(p => formData.append('files', p.file))

      const res = await fetch('/api/merge-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Error merging PDFs')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'archivo-unificado.pdf'
      a.click()

      // Show toast for success
      setToastMessage('Descargado correctamente')
      setToastVisible(true)

      // revoke object URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (error) {
      console.error(error)
      setToastMessage('Error al unir/descargar')
      setToastVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="max-w-150 my-10 mx-auto flex flex-col align-middle gap-4">
        <h1 className="text-center mb-6 text-4xl">Une aquí tus PDFs</h1>
        <FileDropzone onFilesAdded={addFiles} />
        <div>
          <PdfList pdfs={pdfs} setPdfs={setPdfs} />
        </div>
        <button
          onClick={mergePdfs}
          disabled={loading || pdfs.length < 2}
          className="
            mt-6 w-full py-3 rounded-xl font-medium
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
    </>
  )
}