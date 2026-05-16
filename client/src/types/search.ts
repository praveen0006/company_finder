import type { Company } from './company'

export interface SearchParams {
  skills: string
  domain: string
  location: string
  count: number
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface SearchState {
  status: SearchStatus
  companies: Company[]
  error: string | null
}
