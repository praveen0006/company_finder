import { searchWeb } from '../utils/search'
import { askLLM } from '../utils/llm'

const RESEARCHER_PROMPT = `
You are the Researcher Agent. Your goal is to extract a list of relevant companies from web search results.
You will be provided with a search context.
Extract the names and URLs of companies that match the target domain.
Return a RAW JSON array of objects with exactly two properties: "name" and "website".
DO NOT include markdown formatting, code blocks, or explanations. Just the JSON array.
If you cannot find any, return an empty array [].
`.trim()

export class ResearcherAgent {
  async run(domain: string, location: string, count: number): Promise<{ name: string; website: string }[]> {
    console.log(`🕵️‍♂️ [Researcher] Discovering companies for domain: "${domain}" in "${location}"`)
    const locationClause = location ? ` hiring in ${location} or remotely` : ''
    // Search a bit broader to get enough candidates
    const searchQuery = `top 10 ${domain} companies${locationClause} 2024 2025 tech startups`
    
    const context = (await searchWeb(searchQuery, 10)).slice(0, 15000)
    
    const userPrompt = `
Search Context:
${context}

Task: Find at least ${count} (and up to ${count + 3}) companies from the context that operate in the "${domain}" space.
Return ONLY a valid JSON array of { "name": string, "website": string }.
    `.trim()

    console.log(`🕵️‍♂️ [Researcher] Analyzing search context...`)
    const rawRes = await askLLM(RESEARCHER_PROMPT, userPrompt)
    
    try {
      const stripped = rawRes.replace(/```json|```/g, '').trim()
      const start = stripped.indexOf('[')
      const end = stripped.lastIndexOf(']')
      if (start === -1 || end === -1) throw new Error('No JSON array found in Researcher response')
      const companies = JSON.parse(stripped.slice(start, end + 1))
      console.log(`🕵️‍♂️ [Researcher] Found ${companies.length} companies.`)
      return companies.slice(0, count) // limit to requested count
    } catch (e) {
      console.error(`🕵️‍♂️ [Researcher] Failed to parse JSON:`, rawRes)
      return []
    }
  }
}
