import React from 'react'
import { useParams } from 'react-router-dom'

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()

  return (
    <div className="space-y-6">
      <div className="border border-border bg-surface p-6 rounded-xl">
        <h2 className="text-xl font-bold">Lecție ID: {lessonId}</h2>
        <p className="text-sm text-text-muted mt-1">
          Modul vizualizare lecție (Placeholder arhitectură Lesson Block Renderer, Drawer lateral, Prev/Next Navigation).
        </p>
      </div>
    </div>
  )
}
