import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react'
import type { SearchState, SearchStatus, SearchParams } from '../types/search'
import type { Company } from '../types/company'
import { searchCompanies } from '../api/scout'

type Action =
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; companies: Company[] }
  | { type: 'SEARCH_ERROR'; error: string }
  | { type: 'RESET' }

const initialState: SearchState = {
  status: 'idle' as SearchStatus,
  companies: [],
  error: null,
}

function reducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'SEARCH_START':
      return { ...state, status: 'loading', error: null }
    case 'SEARCH_SUCCESS':
      return { status: 'success', companies: action.companies, error: null }
    case 'SEARCH_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

interface SearchContextValue {
  state: SearchState
  runSearch: (params: SearchParams) => Promise<void>
  reset: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const runSearch = useCallback(async (params: SearchParams) => {
    dispatch({ type: 'SEARCH_START' })
    try {
      const companies = await searchCompanies(params)
      dispatch({ type: 'SEARCH_SUCCESS', companies })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      dispatch({ type: 'SEARCH_ERROR', error: message })
    }
  }, [])

  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])

  return (
    <SearchContext.Provider value={{ state, runSearch, reset }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}
