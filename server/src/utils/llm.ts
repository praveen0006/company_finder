import Groq from 'groq-sdk'
import dotenv from 'dotenv'

dotenv.config()

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function askLLM(systemPrompt: string, userPrompt: string, temperature: number = 0.2): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: 4096,
  })

  return completion.choices[0]?.message?.content ?? ''
}
