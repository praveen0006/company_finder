import { askLLM } from '../utils/llm'
import { EnrichedCompany } from './AnalystAgent'
import { Company } from '../types/company'

const MATCHMAKER_PROMPT = `
You are the Matchmaker Agent. Your goal is to evaluate a candidate's fit for a list of companies based on their enriched profiles.
You will be provided with:
1. The CANDIDATE PROFILE (their skills and experience).
2. A JSON array of ENRICHED COMPANIES (what they do, products, tech stack, roles hiring).

For each company, evaluate the candidate's fit and return a JSON array of company objects.
You MUST output EXACTLY this JSON schema for each company:
{
  "company": string,         // Company name
  "website": string,         // Full URL
  "what_they_do": string,    // Passed through from the enriched profile
  "products": string,        // Passed through from the enriched profile
  "tech_stack": string[],    // Passed through from the enriched profile
  "roles_hiring": string[],  // Passed through from the enriched profile
  "candidate_matched_skills": string[],   // Candidate skills that match this company
  "candidate_missing_skills": string[],   // Skills the candidate lacks for this company
  "match_score": number,     // 0-100 fit score
  "match_label": "Strong Match" | "Partial Match" | "Low Match",  // >= 65 Strong, 40-64 Partial, < 40 Low
  "insight": string          // One actionable sentence for the candidate about this company
}

Return ONLY a valid RAW JSON array matching this schema. NO markdown, NO code fences.
`.trim()

export class MatchmakerAgent {
  async run(companies: EnrichedCompany[], candidateSkills: string): Promise<Company[]> {
    console.log(`⚖️ [Matchmaker] Evaluating fit for ${companies.length} companies...`)
    
    const userPrompt = `
CANDIDATE PROFILE:
${candidateSkills}

ENRICHED COMPANIES:
${JSON.stringify(companies, null, 2)}

Task: Evaluate the candidate against these companies and return the final JSON array.
    `.trim()

    const rawRes = await askLLM(MATCHMAKER_PROMPT, userPrompt, 0.1) // Lower temperature for stricter schema adherence
    
    try {
      const stripped = rawRes.replace(/```json|```/g, '').trim()
      const start = stripped.indexOf('[')
      const end = stripped.lastIndexOf(']')
      if (start === -1 || end === -1) throw new Error('No JSON array found in Matchmaker response')
      const finalCompanies = JSON.parse(stripped.slice(start, end + 1)) as Company[]
      
      console.log(`⚖️ [Matchmaker] Successfully generated match report.`)
      return finalCompanies
    } catch (e) {
      console.error(`⚖️ [Matchmaker] Failed to parse match report:`, rawRes)
      throw new Error('Matchmaker failed to generate valid JSON.')
    }
  }
}
