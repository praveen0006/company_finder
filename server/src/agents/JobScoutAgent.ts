import { askLLM } from '../utils/llm'
import { searchWeb } from '../utils/search'

export interface JobDetails {
  company: string
  role: string
  location: string
  experience: string
  jd: string
  skills: string[]
}

const SCOUT_PROMPT = `
You are the Job Scout Agent. Your goal is to extract structured information from a job description or search results.
Extract exactly:
- company: Name of the company.
- role: Job title.
- location: Primary location.
- experience: Experience requirements (e.g., "0-2 years").
- jd: A concise summary of the key responsibilities.
- skills: An array of technical skills required.

Return ONLY a valid RAW JSON object.
{
  "company": string,
  "role": string,
  "location": string,
  "experience": string,
  "jd": string,
  "skills": string[]
}
`.trim()

export class JobScoutAgent {
  async runFromUrl(url: string): Promise<JobDetails> {
    console.log(`🔍 [JobScout] Scouting job at ${url}...`)
    
    // In a real scenario, we might crawl the URL. 
    // For now, we'll use search context as a fallback/proxy if we can't crawl directly.
    const context = await searchWeb(`job description for ${url}`, 2)
    
    const userPrompt = `
URL: ${url}
Context from search:
${context}

Task: Extract job details. Return ONLY JSON.
    `.trim()

    const rawRes = await askLLM(SCOUT_PROMPT, userPrompt)
    
    try {
      const stripped = rawRes.replace(/```json|```/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object found')
      const details = JSON.parse(stripped.slice(start, end + 1))
      
      console.log(`🔍 [JobScout] Extracted details for ${details.role} at ${details.company}.`)
      return details
    } catch (e) {
      console.error(`🔍 [JobScout] Failed to parse JD for ${url}:`, rawRes)
      throw new Error('Failed to extract job details.')
    }
  }
}
