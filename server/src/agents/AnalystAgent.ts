import { searchWeb } from '../utils/search'
import { askLLM } from '../utils/llm'

export interface EnrichedCompany {
  name: string
  website: string
  what_they_do: string
  products: string
  tech_stack: string[]
  roles_hiring: string[]
}

const ANALYST_PROMPT = `
You are the Analyst Agent. Your goal is to build a rich profile of a company based on web search results.
You will receive search context about a specific company.
Extract exactly:
- what_they_do: A 1-2 sentence description of the company's core business.
- products: Their key products, platforms, or services (a concise string).
- tech_stack: An array of strings representing the programming languages, frameworks, databases, and tools they use.
- roles_hiring: An array of strings representing job titles they are currently hiring for or typically hire for.

Return ONLY a valid RAW JSON object matching this schema. NO markdown, NO code fences.
{
  "what_they_do": string,
  "products": string,
  "tech_stack": string[],
  "roles_hiring": string[]
}
`.trim()

export class AnalystAgent {
  async runForCompany(company: { name: string; website: string }): Promise<EnrichedCompany> {
    console.log(`🧐 [Analyst] Deep diving into ${company.name}...`)
    
    // Targeted search for this specific company's tech stack and jobs
    const searchQuery = `${company.name} company engineering tech stack "careers" OR "jobs" products 2024`
    const context = await searchWeb(searchQuery, 4) // fewer results per company to save tokens/time
    
    const userPrompt = `
Company Name: ${company.name}
Website: ${company.website}

Search Context:
${context}

Task: Extract the company profile. Return ONLY a valid JSON object.
    `.trim()

    const rawRes = await askLLM(ANALYST_PROMPT, userPrompt)
    
    try {
      const stripped = rawRes.replace(/```json|```/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object found in Analyst response')
      const profile = JSON.parse(stripped.slice(start, end + 1))
      
      console.log(`🧐 [Analyst] Profile built for ${company.name}.`)
      return {
        name: company.name,
        website: company.website,
        what_they_do: profile.what_they_do || 'Information not available.',
        products: profile.products || '',
        tech_stack: Array.isArray(profile.tech_stack) ? profile.tech_stack : [],
        roles_hiring: Array.isArray(profile.roles_hiring) ? profile.roles_hiring : [],
      }
    } catch (e) {
      console.error(`🧐 [Analyst] Failed to parse profile for ${company.name}:`, rawRes)
      return {
        name: company.name,
        website: company.website,
        what_they_do: 'Failed to extract information.',
        products: '',
        tech_stack: [],
        roles_hiring: []
      }
    }
  }

  async runBatch(companies: { name: string; website: string }[]): Promise<EnrichedCompany[]> {
    console.log(`🧐 [Analyst] Starting batch analysis for ${companies.length} companies...`)
    // Run concurrently
    const enriched = await Promise.all(companies.map(c => this.runForCompany(c)))
    return enriched
  }
}
