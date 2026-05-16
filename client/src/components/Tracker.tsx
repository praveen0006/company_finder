import React, { useEffect, useState } from 'react'
import { Card, Badge } from './ui'
import type { Company } from '../types/company'

interface TrackedApplication {
  id: string
  company: string
  role: string
  score: string
  status: string
  date: string
  notes?: string
  tech_stack?: string[]
  roles_hiring?: string[]
}

export function Tracker() {
  const [apps, setApps] = useState<TrackedApplication[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTracker = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tracker`)
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

  const downloadResume = async (app: TrackedApplication) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: app.company,
          techStack: app.tech_stack || [],
          rolesHiring: app.roles_hiring || [app.role],
          baseResume: "Praveen Kumar, B.Tech AI & ML. Patent holder in Railway AI. IEEE published. Expert in YOLOv8, Python, Edge AI."
        })
      })
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${app.company}_Tailored_CV.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (e) {
      console.error('Failed to download resume', e)
    }
  }

  if (loading) return <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>Loading Career Dashboard...</div>

  if (apps.length === 0) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <h3>No applications tracked yet.</h3>
      <p>Your Career-Ops data will appear here once synchronized.</p>
    </div>
  )

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800 }}>Career Dashboard</h2>
        <Badge label={`${apps.length} Active Applications`} variant="strong" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '20px' }}>
        {apps.map(app => (
          <Card key={app.id}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '2px' }}>{app.company}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{app.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#6c63ff' }}>{app.score}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Match Score</div>
                </div>
              </div>

              <div style={{ flex: 1, marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {app.notes ? (app.notes.length > 120 ? app.notes.substring(0, 120) + '...' : app.notes) : 'No specific notes for this role.'}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => downloadResume(app)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: 'rgba(108,99,255,0.15)',
                      color: '#6c63ff',
                      border: '1px solid rgba(108,99,255,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    Tailor CV (PDF)
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{app.status}</span>
                   <div style={{ 
                     width: '8px', height: '8px', borderRadius: '50%', 
                     background: app.status === 'Aplicada' ? '#10d9a0' : app.status === 'Evaluada' ? '#f59e0b' : '#ef4444' 
                   }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
