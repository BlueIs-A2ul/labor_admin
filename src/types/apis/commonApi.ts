export interface APIResponseType {
  success: boolean
  message: string
  code: number
  data: Record<string, unknown>
}
