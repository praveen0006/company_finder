import React, { useEffect, useState } from 'react'
import { Card, Badge } from './ui'
import type { Company } from '../types/company'

interface TrackedApplication extends Company {
  id: string
  status: string
  dateAdded: string
}

export function Tracker() {
  const [apps, setApps] = useState<TrackedApplication[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTracker = async () => {
    try {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tracker\`)
      const data = await res.json()
      setApps(data.applications || [])
    } catch (e) {
      console.error('Failed to load tracker', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracker()
  }, [])

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tracker/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchTracker()
    } catch (e) {
      console.error('Failed to update status', e)
    }
  }

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading Tracker...</div>

  if (apps.length === 0) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h3>No applications saved yet.</h3>
      <p>Go to the Scout tab and save some companies to track them here!</p>
    </div>
  )

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>Pipeline Tracker</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {apps.map(app => (
          <Card key={app.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{app.company}</h3>
                <a href={app.website} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#6c63ff' }}>{app.website}</a>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Added {new Date(app.dateAdded).toLocaleDateString()}</div>
                  <Badge label={\`\${app.match_score}%\`} variant={app.match_score >= 65 ? 'strong' : app.match_score >= 40 ? 'partial' : 'low'} />
                </div>
                
                <select 
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Evaluated">Evaluated</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
