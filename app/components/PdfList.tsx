'use client'

import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import PdfItem from './PdfItem'
import { PdfFile } from '@/types/pdf'

type Props = {
  pdfs: PdfFile[]
  setPdfs: (pdfs: PdfFile[]) => void
}

export default function PdfList({ pdfs, setPdfs }: Props) {
  function handleDragEnd(event: any) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = pdfs.findIndex(p => p.id === active.id)
    const newIndex = pdfs.findIndex(p => p.id === over.id)

    const updated = [...pdfs]
    const [moved] = updated.splice(oldIndex, 1)
    updated.splice(newIndex, 0, moved)

    setPdfs(updated)
  }

  function removePdf(id: string) {
    setPdfs(prev => prev.filter(pdf => pdf.id !== id))
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={pdfs.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        {pdfs.map(pdf => (
          <PdfItem
            key={pdf.id}
            pdf={pdf}
            onRemove={removePdf}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
