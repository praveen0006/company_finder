import React, { useState, useCallback, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Button, Input, Textarea } from './ui'
import { useSearch } from '../context/SearchContext'
import type { SearchParams } from '../types/search'

interface FormErrors {
  skills?: string
  domain?: string
}

export function SearchForm() {
  const { state, runSearch, reset } = useSearch()
  const isLoading = state.status === 'loading'

  const [skills, setSkills] = useState('')
  const [domain, setDomain] = useState('')
  const [location, setLocation] = useState('')
  const [count, setCount] = useState(5)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!skills || skills.trim().length < 20) {
      errs.skills = 'Please describe your skills in more detail (min 20 chars)'
    }
    if (!domain || !domain.trim()) {
      errs.domain = 'Please enter an industry or domain'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()
      if (!validate()) return
      const params: SearchParams = { skills, domain, location, count }
      await runSearch(params)
    },
    [skills, domain, location, count, runSearch]
  )

  const handleClear = () => {
    setSkills('')
    setDomain('')
    setLocation('')
    setCount(5)
    setErrors({})
    reset()
  }

  // Cmd/Ctrl + Enter global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSubmit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleSubmit])

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Job Scout search form">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(108,99,255,0.4)',
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Scout Parameters
          </h2>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '42px' }}>
          Powered by Groq + Tavily Search
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <Textarea
          id="skills"
          label="Your Skills & Experience"
          placeholder="e.g. 4 years Python, built REST APIs with FastAPI, worked on ML pipelines, PostgreSQL, Redis, some React, AWS and Docker."
          maxLength={2000}
          value={skills}
          onChange={e => {
            setSkills(e.target.value)
            if (errors.skills) setErrors(prev => ({ ...prev, skills: undefined }))
          }}
          error={errors.skills}
          disabled={isLoading}
          aria-required="true"
        />

        <Input
          id="domain"
          label="Industry / Domain"
          placeholder="e.g. AI SaaS startup, fintech, edtech"
          value={domain}
          onChange={e => {
            setDomain(e.target.value)
            if (errors.domain) setErrors(prev => ({ ...prev, domain: undefined }))
          }}
          error={errors.domain}
          disabled={isLoading}
          aria-required="true"
        />

        <Input
          id="location"
          label="Location or Remote"
          placeholder="e.g. Hyderabad, Remote, India"
          value={location}
          onChange={e => setLocation(e.target.value)}
          disabled={isLoading}
        />

        {/* Count selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="count" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
            Companies to Find
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[3, 5, 8].map(n => (
              <button
                key={n}
                type="button"
                id={n === 3 ? 'count' : undefined}
                disabled={isLoading}
                onClick={() => setCount(n)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '9px',
                  border: `1px solid ${count === n ? 'rgba(108,99,255,0.7)' : 'var(--border-strong)'}`,
                  background: count === n ? 'rgba(108,99,255,0.2)' : 'rgba(255,255,255,0.04)',
                  color: count === n ? '#a78bfa' : 'var(--text-secondary)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: count === n ? '0 0 12px rgba(108,99,255,0.25)' : 'none',
                }}
                aria-pressed={count === n}
                aria-label={`Find ${n} companies`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '4px' }}>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
            style={{ width: '100%', padding: '12px' }}
            aria-label="Run Job Scout agent"
          >
            {isLoading ? 'Searching...' : 'Run Agent ↗'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            disabled={isLoading}
            style={{ width: '100%' }}
            aria-label="Clear search form"
          >
            Clear
          </Button>
        </div>

        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          ⌘ + Enter to submit anywhere
        </p>
      </div>
    </form>
  )
}
