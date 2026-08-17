import React from 'react'
import type {
  LessonBlockData,
  HeadingBlockContent,
  RichTextBlockContent,
  ImportantBlockContent,
  RememberBlockContent,
  DefinitionBlockContent,
  SummaryBlockContent,
  ImageBlockContent,
  VideoBlockContent,
  AudioBlockContent,
  FileDownloadBlockContent,
  QuoteBlockContent,
} from '@/types/blocks'

import { HeadingBlock } from './blocks/HeadingBlock'
import { RichTextBlock } from './blocks/RichTextBlock'
import { ImportantBlock } from './blocks/ImportantBlock'
import { RememberBlock } from './blocks/RememberBlock'
import { DefinitionBlock } from './blocks/DefinitionBlock'
import { SummaryBlock } from './blocks/SummaryBlock'
import { ImageBlock } from './blocks/ImageBlock'
import { VideoBlock } from './blocks/VideoBlock'
import { AudioBlock } from './blocks/AudioBlock'
import { FileDownloadBlock } from './blocks/FileDownloadBlock'
import { QuoteBlock } from './blocks/QuoteBlock'
import { FallbackBlock } from './blocks/FallbackBlock'

interface Props {
  block: LessonBlockData
}

export const LessonBlockRenderer: React.FC<Props> = ({ block }) => {
  const renderBlock = () => {
    try {
      switch (block.block_type) {
        case 'heading':
          return <HeadingBlock content={block.content as unknown as HeadingBlockContent} />

        case 'rich_text':
          return <RichTextBlock content={block.content as unknown as RichTextBlockContent} />

        case 'important':
          return <ImportantBlock content={block.content as unknown as ImportantBlockContent} />

        case 'remember':
          return <RememberBlock content={block.content as unknown as RememberBlockContent} />

        case 'definition':
          return <DefinitionBlock content={block.content as unknown as DefinitionBlockContent} />

        case 'summary':
          return <SummaryBlock content={block.content as unknown as SummaryBlockContent} />

        case 'image':
          return <ImageBlock content={block.content as unknown as ImageBlockContent} />

        case 'video':
          return <VideoBlock content={block.content as unknown as VideoBlockContent} />

        case 'audio':
          return <AudioBlock content={block.content as unknown as AudioBlockContent} />

        case 'file_download':
        case 'attachment':
        case 'resource':
          return <FileDownloadBlock content={block.content as unknown as FileDownloadBlockContent} />

        case 'quote':
        case 'literary_quote':
          return <QuoteBlock content={block.content as unknown as QuoteBlockContent} />

        default:
          return <FallbackBlock block={block} />
      }
    } catch (err) {
      console.error(`[LessonBlockRenderer] Error rendering block ${block.id}:`, err)
      return <FallbackBlock block={block} />
    }
  }

  return <div className="lesson-block-renderer selectable-content">{renderBlock()}</div>
}
