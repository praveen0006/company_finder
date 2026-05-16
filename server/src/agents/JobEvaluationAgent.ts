import { askLLM } from '../utils/llm'

export interface EvaluationResult {
  score: number
  match_analysis: string
  strategy: string
  gaps: string[]
}

const EVALUATION_PROMPT = `
You are the Job Evaluation Agent. Your goal is to score a job opportunity against a candidate's profile.
You will receive the Candidate Profile and the Job Details.

Score the job from 0.0 to 5.0 based on:
1. Skills match (Tech stack).
2. Seniority match (Experience level).
3. Location match.
4. "Value" match (Patent/Innovation vs Role type).

Return ONLY a valid RAW JSON object.
{
  "score": number,
  "match_analysis": string (1-2 sentences),
  "strategy": string (specific advice for this role),
  "gaps": string[]
}
`.trim()

export class JobEvaluationAgent {
  async run(candidateProfile: any, jobDetails: any): Promise<EvaluationResult> {
    console.log(`⚖️ [JobEvaluation] Evaluating role: ${jobDetails.role} at ${jobDetails.company}...`)
    
    const userPrompt = `
CANDIDATE PROFILE:
${JSON.stringify(candidateProfile, null, 2)}

JOB DETAILS:
${JSON.stringify(jobDetails, null, 2)}

Task: Evaluate and score this opportunity. Return ONLY JSON.
    `.trim()

    const rawRes = await askLLM(EVALUATION_PROMPT, userPrompt, 0.2)
    
    try {
      const stripped = rawRes.replace(/```json|```/g, '').trim()
      const start = stripped.indexOf('{')
      const end = stripped.lastIndexOf('}')
      if (start === -1 || end === -1) throw new Error('No JSON object found')
      const evalRes = JSON.parse(stripped.slice(start, end + 1))
      
      console.log(`⚖️ [JobEvaluation] Scored: ${evalRes.score}/5.0`)
      return evalRes
    } catch (e) {
      console.error(`⚖️ [JobEvaluation] Failed to parse evaluation:`, rawRes)
      throw new Error('Failed to evaluate job.')
    }
  }
}
