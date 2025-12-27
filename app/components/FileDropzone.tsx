'use client'

import { useDropzone } from 'react-dropzone'

type Props = {
  onFilesAdded: (files: File[]) => void
}

export default function FileDropzone({ onFilesAdded }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: true,
    onDrop: onFilesAdded,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-colors
        ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-slate-800'
            : 'border-slate-300 dark:border-slate-600'
        }
      `}
    >
      <input {...getInputProps()} />

      <p className="text-base font-medium">
        {isDragActive
          ? 'Suelta los PDFs aquí'
          : '📄 Arrastra PDFs aquí o pulsa para empezar'}
      </p>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Puedes seleccionar uno o varios documentos PDF
      </p>
    </div>
  )
}
