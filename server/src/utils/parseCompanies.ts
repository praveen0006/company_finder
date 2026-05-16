import { Company } from '../types/company'

export function parseCompanies(raw: string): Company[] {
  const stripped = raw.replace(/```json|```/g, '').trim()
  const start = stripped.indexOf('[')
  const end = stripped.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('No JSON array found in response')
  return JSON.parse(stripped.slice(start, end + 1)) as Company[]
}
