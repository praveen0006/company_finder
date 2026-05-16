import { Request, Response, Router } from 'express'
import fs from 'fs'
import path from 'path'
import { Company } from '../types/company'

export const trackerRouter = Router()

// The simple JSON database
const DATA_FILE = path.join(__dirname, '../../data/tracker.json')

// Ensure the directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]))
}

// Read database
function readDB(): any[] {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (e) {
    return []
  }
}

// Write database
function writeDB(data: any[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

// GET all tracked applications
trackerRouter.get('/', (req: Request, res: Response) => {
  const data = readDB()
  res.json({ applications: data })
})

// POST save a new company to tracker
trackerRouter.post('/', (req: Request, res: Response) => {
  const companyData: Company = req.body.company
  const db = readDB()

  // Prevent duplicates
  const existing = db.find(c => c.company === companyData.company)
  if (existing) {
    res.status(400).json({ error: 'Company already in tracker' })
    return
  }

  const newEntry = {
    id: Date.now().toString(),
    status: 'Evaluated', // Initial status
    dateAdded: new Date().toISOString(),
    ...companyData
  }

  db.push(newEntry)
  writeDB(db)
  
  res.status(201).json({ application: newEntry })
})

// PATCH update status of an application
trackerRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const { status } = req.body
  const db = readDB()

  const index = db.findIndex(c => c.id === id)
  if (index === -1) {
    res.status(404).json({ error: 'Application not found' })
    return
  }

  db[index].status = status
  writeDB(db)
  
  res.json({ application: db[index] })
})
