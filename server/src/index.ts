import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import { ResearcherAgent } from './agents/ResearcherAgent'
import { AnalystAgent } from './agents/AnalystAgent'
import { MatchmakerAgent } from './agents/MatchmakerAgent'
import { ResumeAgent } from './agents/ResumeAgent'
import { generatePdfFromHtml } from './utils/pdf'
import { trackerRouter } from './routes/tracker'

dotenv.config()

const app = express()
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3001'] }))
app.use(express.json())

// ─── Tracker Routes ────────────────────────────────────────────────────────────
app.use('/api/tracker', trackerRouter)

const researcher = new ResearcherAgent()
const analyst = new AnalystAgent()
const matchmaker = new MatchmakerAgent()
const resumeAgent = new ResumeAgent()

// ─── Route ────────────────────────────────────────────────────────────────────
app.post('/api/scout', async (req: Request, res: Response): Promise<void> => {
  const { skills, domain, location, count } = req.body

  if (!skills || skills.trim().length < 20) {
    res.status(400).json({ error: 'skills must be at least 20 characters' })
    return
  }
  if (!domain || !domain.trim()) {
    res.status(400).json({ error: 'domain is required' })
    return
  }

  const safeCount = Math.min(Math.max(parseInt(count) || 5, 2), 8)

  try {
    console.log(`\n--- New Scout Request: ${safeCount} companies in ${domain} ---`)
    
    // Step 1: Researcher Agent
    const discoveredCompanies = await researcher.run(domain, location, safeCount)
    if (discoveredCompanies.length === 0) {
      throw new Error('Researcher Agent could not find any companies.')
    }

    // Step 2: Analyst Agent
    const enrichedCompanies = await analyst.runBatch(discoveredCompanies)

    // Step 3: Matchmaker Agent
    const finalCompanies = await matchmaker.run(enrichedCompanies, skills)

    res.json({ companies: finalCompanies })
    console.log('--- Scout Request Complete ---\n')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Error:', message)
    res.status(500).json({ error: message })
  }
})

// ─── Resume Generation Route ───────────────────────────────────────────────────
app.post('/api/resume', async (req: Request, res: Response): Promise<void> => {
  const { baseResume, company, techStack, rolesHiring } = req.body

  if (!baseResume || !company) {
    res.status(400).json({ error: 'baseResume and company are required' })
    return
  }

  try {
    const html = await resumeAgent.run(baseResume, company, techStack || [], rolesHiring || [])
    const pdfBuffer = await generatePdfFromHtml(html)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${company.replace(/\s+/g, '_')}_Resume.pdf"`)
    res.send(pdfBuffer)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ PDF Generation Error:', message)
    res.status(500).json({ error: message })
  }
})

// ─── Static (production) ──────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')))
  app.get('*', (_: Request, res: Response) =>
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
  )
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
