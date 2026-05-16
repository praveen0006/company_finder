export interface Company {
  company: string
  website: string
  what_they_do: string
  products: string
  tech_stack: string[]
  roles_hiring: string[]
  candidate_matched_skills: string[]
  candidate_missing_skills: string[]
  match_score: number
  match_label: 'Strong Match' | 'Partial Match' | 'Low Match'
  insight: string
}
