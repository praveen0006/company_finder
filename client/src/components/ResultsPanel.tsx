import React, { useEffect, useRef, useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { useSearch } from '../context/SearchContext'
import { CompanyCard } from './CompanyCard'
import { Button } from './ui'

const LOADING_MESSAGES = [
  '🕵️‍♂️ Researcher Agent is finding matching companies...',
  '🧐 Analyst Agent is deep-diving into their tech stacks...',
  '⚖️ Matchmaker Agent is scoring your resume...',
  'Compiling your personalised multi-agent report...',
]

export function ResultsPanel() {
  const { state, reset } = useSearch()
  const { status, companies, error } = state
  const [msgIndex, setMsgIndex] = useState(0)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== 'loading') {
      setMsgIndex(0)
      return
    }
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [status])

  const handleSearchAgain = () => {
    reset()
    // Scroll to top / form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (status === 'idle') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '400px',
        gap: '16px',
        textAlign: 'center',
        padding: '40px',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}>
          <Search size={32} color="var(--text-muted)" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-secondary)' }}>
          Ready to Scout
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '320px', lineHeight: '1.6' }}>
          Enter your skills and a domain to find your best-fit companies — powered by real-time Google Search.
        </p>
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {['🤖 AI/ML', '💳 Fintech', '🎓 Edtech', '🏥 Healthtech'].map(tag => (
            <span key={tag} style={{
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div style={{ padding: '4px 0' }}>
        {/* Status message */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '28px',
          padding: '14px 18px',
          background: 'rgba(108,99,255,0.1)',
          border: '1px solid rgba(108,99,255,0.25)',
          borderRadius: '12px',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#6c63ff',
            animation: 'pulse 1.5s infinite',
            flexShrink: 0,
          }} />
          <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }`}</style>
          <p style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 500 }}>
            {LOADING_MESSAGES[msgIndex]}
          </p>
        </div>

        {/* Skeleton cards */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="skeleton"
            style={{ height: '200px', marginBottom: '14px', opacity: 1 - (i - 1) * 0.25 }}
            aria-label="Loading company result"
          />
        ))}
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '300px',
        padding: '40px',
      }}>
        <div style={{
          background: 'rgba(244,63,94,0.1)',
          border: '1px solid rgba(244,63,94,0.3)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
          maxWidth: '480px',
          width: '100%',
          marginBottom: '20px',
        }}>
          <AlertCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#f43f5e', marginBottom: '4px' }}>
              Something went wrong
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {error}
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={reset} aria-label="Try search again">
          Try Again
        </Button>
      </div>
    )
  }

  // ── Success ───────────────────────────────────────────────────────────────
  const sorted = [...companies].sort((a, b) => b.match_score - a.match_score)
  const strongCount = sorted.filter(c => c.match_score >= 65).length

  return (
    <div>
      {/* Summary bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
      }}>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Found <strong style={{ color: 'var(--text-primary)' }}>{sorted.length}</strong> companies
          {strongCount > 0 && (
            <> · <strong style={{ color: '#10d9a0' }}>{strongCount} strong match{strongCount > 1 ? 'es' : ''}</strong></>
          )}
        </p>
        <Button variant="ghost" onClick={handleSearchAgain} style={{ padding: '6px 12px', fontSize: '12px' }} aria-label="Search again">
          Search Again
        </Button>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {sorted.map((company, i) => (
          <CompanyCard key={`${company.company}-${i}`} company={company} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        textAlign: 'center',
        marginTop: '28px',
        lineHeight: '1.6',
      }}>
        Results are AI-generated. Always verify company details before applying.
      </p>
    </div>
  )
}
