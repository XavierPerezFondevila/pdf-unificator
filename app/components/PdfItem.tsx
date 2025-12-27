'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PdfFile } from '@/types/pdf'

type Props = {
  pdf: PdfFile
  onRemove: (id: string) => void
}

export default function PdfItem({ pdf, onRemove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: pdf.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
        flex items-center justify-between
        p-3 mb-2 rounded-lg border
        bg-slate-50 dark:bg-slate-800
        border-slate-200 dark:border-slate-700
      "
    >
      <div
        {...attributes}
        {...listeners}
        className="flex-1 cursor-grab select-none"
      >
        📄 {pdf.file.name}
      </div>

      <button
        onClick={() => onRemove(pdf.id)}
        className="
          ml-3 text-slate-400 hover:text-red-500
          transition-colors
          cursor-pointer
        "
        aria-label="Eliminar PDF"
      >
        ❌
      </button>
    </div>
  )
}
