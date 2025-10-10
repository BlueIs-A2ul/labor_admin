export interface SaveWordParams {
  id?: number
  word?: string
  level?: number
  typeId?: number
  partOfSpeech?: string
}

export interface UpdateWordParams {
  id?: number
  word?: string
  level?: number
  typeId?: number
  partOfSpeech?: string
}

export interface PageWordParams {
  page: string
  pageSize: string
  level?: string
  typeId?: string
  partOfSpeech?: string
  withDate?: string
  key?: string
}
