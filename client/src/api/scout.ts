import type { Company } from '../types/company'
import type { SearchParams } from '../types/search'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function searchCompanies(params: SearchParams): Promise<Company[]> {
  const res = await fetch(`${API_URL}/api/scout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? `Request failed: ${res.status}`)
  }

  const data = await res.json() as { companies: Company[] }
  return data.companies
}
