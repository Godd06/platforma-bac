import React from 'react'
import type { HeadingBlockContent } from '@/types/blocks'

interface Props {
  content: HeadingBlockContent
}

export const HeadingBlock: React.FC<Props> = ({ content }) => {
  const { text, level = 2, subtitle } = content

  const renderHeading = () => {
    switch (level) {
      case 1:
        return <h1 className="text-3xl font-extrabold text-text tracking-tight">{text}</h1>
      case 3:
        return <h3 className="text-xl font-bold text-text tracking-tight">{text}</h3>
      case 4:
        return <h4 className="text-lg font-semibold text-text tracking-tight">{text}</h4>
      case 2:
      default:
        return <h2 className="text-2xl font-bold text-text tracking-tight">{text}</h2>
    }
  }

  return (
    <div className="pt-4 pb-2 space-y-1">
      {renderHeading()}
      {subtitle && <p className="text-sm text-text-muted font-medium">{subtitle}</p>}
    </div>
  )
}
