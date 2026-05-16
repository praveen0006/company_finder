import dotenv from 'dotenv'

dotenv.config()

interface TavilyResult {
  title: string
  url: string
  content: string
  score: number
}

interface TavilyResponse {
  answer?: string
  results: TavilyResult[]
}

export async function searchWeb(query: string, maxResults: number = 8): Promise<string> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'advanced',
      max_results: maxResults,
      include_answer: true,
      include_raw_content: false,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Tavily search failed: ${res.status} ${err}`)
  }

  const data = (await res.json()) as TavilyResponse

  const sections: string[] = []
  if (data.answer) {
    sections.push(`SEARCH SUMMARY:\n${data.answer}`)
  }
  data.results.forEach((r, i) => {
    sections.push(`SOURCE ${i + 1}: ${r.title}\nURL: ${r.url}\n${r.content}`)
  })

  return sections.join('\n\n---\n\n')
}
