import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Bookmark, FileText } from 'lucide-react'
import type { Company } from '../types/company'
import { Badge, Card, ProgressBar, Button } from './ui'
import { useSearch } from '../context/SearchContext'

interface CompanyCardProps {
  company: Company
  index: number
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginTop: '14px',
      marginBottom: '6px',
    }}>
      {children}
    </p>
  )
}

function TagList({ items, variant }: { items: string[]; variant: 'neutral' | 'hit' | 'miss' }) {
  if (!items.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
      {items.map(item => (
        <Badge key={item} label={item} variant={variant} />
      ))}
    </div>
  )
}

export function CompanyCard({ company, index }: CompanyCardProps) {
  const { state } = useSearch()
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  const matchVariant = company.match_score >= 65 ? 'strong' : company.match_score >= 40 ? 'partial' : 'low'
  const isAccent = company.match_score >= 65

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tracker\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      })
      alert('Saved to Tracker!')
    } catch (e) {
      alert('Failed to save to tracker')
    } finally {
      setSaving(false)
    }
  }

  const handleGeneratePdf = async () => {
    setGenerating(true)
    try {
      const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/resume\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseResume: state.skills,
          company: company.company,
          techStack: company.tech_stack,
          rolesHiring: company.roles_hiring
        })
      })
      
      if (!res.ok) throw new Error('Generation failed')
      
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = \`\${company.company.replace(/\\s+/g, '_')}_Resume.pdf\`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (e) {
      alert('Failed to generate PDF')
    } finally {
      setGenerating(false)
    }
  }

  const websiteDisplay = company.website
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: 'easeOut' }}
    >
      <Card accent={isAccent}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              {company.company}
            </h3>
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#6c63ff',
                textDecoration: 'none',
              }}
              aria-label={`Visit ${company.company} website`}
            >
              {websiteDisplay}
              <ExternalLink size={11} />
            </a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
            <Badge label={`${company.match_score}%`} variant={matchVariant} />
            <Badge label={company.match_label} variant={matchVariant} />
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '12px', marginBottom: '4px' }}>
          <ProgressBar score={company.match_score} />
        </div>

        {/* What they do */}
        <SectionLabel>What They Do</SectionLabel>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          {company.what_they_do}
        </p>

        {/* What they're building */}
        {company.products && company.products.trim().length > 0 && (
          <>
            <SectionLabel>What They're Building</SectionLabel>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              {company.products}
            </p>
          </>
        )}

        {/* Tech Stack */}
        {company.tech_stack.length > 0 && (
          <>
            <SectionLabel>Tech Stack</SectionLabel>
            <TagList items={company.tech_stack} variant="neutral" />
          </>
        )}

        {/* Roles Hiring */}
        {company.roles_hiring.length > 0 && (
          <>
            <SectionLabel>Roles Hiring</SectionLabel>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {company.roles_hiring.join(', ')}
            </p>
          </>
        )}

        {/* Matching Skills */}
        {company.candidate_matched_skills.length > 0 && (
          <>
            <SectionLabel>Your Matching Skills</SectionLabel>
            <TagList items={company.candidate_matched_skills} variant="hit" />
          </>
        )}

        {/* Missing Skills */}
        {company.candidate_missing_skills.length > 0 && (
          <>
            <SectionLabel>Skills to Build</SectionLabel>
            <TagList items={company.candidate_missing_skills} variant="miss" />
          </>
        )}

        {/* Insight */}
        <div style={{
          marginTop: '16px',
          paddingTop: '14px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: '14px' }}>💡</span>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: '1.6' }}>
            {company.insight}
          </p>
        </div>

        {/* Actions */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid var(--border)'
        }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <Bookmark size={14} />
            {saving ? 'Saving...' : 'Save to Tracker'}
          </button>
          
          <button
            onClick={handleGeneratePdf}
            disabled={generating}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: generating ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(108,99,255,0.25)',
              transition: 'all 0.2s',
            }}
          >
            <FileText size={14} />
            {generating ? 'Generating PDF...' : 'Tailor ATS Resume'}
          </button>
        </div>
      </Card>
    </motion.div>
  )
}
