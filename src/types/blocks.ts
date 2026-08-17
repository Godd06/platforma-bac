export interface HeadingBlockContent {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  subtitle?: string
}

export interface RichTextBlockContent {
  html?: string
  markdown?: string
  text?: string
}

export interface ImportantBlockContent {
  title?: string
  text: string
}

export interface RememberBlockContent {
  title?: string
  text: string
}

export interface DefinitionBlockContent {
  term: string
  definition: string
  category?: string
  example?: string
}

export interface SummaryBlockContent {
  title?: string
  items?: string[]
  content?: string
}

export interface ImageBlockContent {
  url: string
  alt?: string
  caption?: string
}

export interface VideoBlockContent {
  url: string
  title?: string
  poster?: string
  caption?: string
}

export interface AudioBlockContent {
  url: string
  title?: string
  duration?: string
  transcript?: string
}

export interface FileDownloadBlockContent {
  url: string
  filename: string
  filesize?: string
  filetype?: string
  description?: string
}

export interface QuoteBlockContent {
  quote: string
  author?: string
  work?: string
  commentary?: string
}

export interface LessonBlockData {
  id: string
  lesson_id: string
  block_type: string
  sort_order: number
  content: Record<string, unknown>
  created_at?: string
  updated_at?: string
}
