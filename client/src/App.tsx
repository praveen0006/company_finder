import React, { useState } from 'react'
import { SearchProvider } from './context/SearchContext'
import { SearchForm } from './components/SearchForm'
import { ResultsPanel } from './components/ResultsPanel'
import { Tracker } from './components/Tracker'

export default function App() {
  const [activeTab, setActiveTab] = useState<'scout' | 'tracker'>('scout')
  return (
    <SearchProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(10,10,15,0.85)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 24px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Logo */}
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 4px 14px rgba(108,99,255,0.45)',
                flexShrink: 0,
              }}>
                🎯
              </div>
              <div>
                <h1 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  Job Scout Agent
                </h1>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  AI-powered company research · Free · Groq + Tavily
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{
              display: 'flex',
              background: 'var(--surface-raised)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}>
              <button 
                onClick={() => setActiveTab('scout')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeTab === 'scout' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'scout' ? 'rgba(108,99,255,0.2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Scout
              </button>
              <button 
                onClick={() => setActiveTab('tracker')}
                style={{
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: activeTab === 'tracker' ? '#fff' : 'var(--text-muted)',
                  background: activeTab === 'tracker' ? 'rgba(108,99,255,0.2)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Tracker
              </button>
            </div>

            {/* Status pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: 'rgba(16,217,160,0.1)',
              border: '1px solid rgba(16,217,160,0.25)',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#10d9a0',
                boxShadow: '0 0 6px #10d9a0',
              }} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#10d9a0' }}>Live</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        {activeTab === 'scout' ? (
          <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Left sidebar — search form */}
            <aside
              style={{
                width: '380px',
                flexShrink: 0,
                borderRight: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                padding: '28px 24px',
                overflowY: 'auto',
                height: 'calc(100vh - 60px)',
                position: 'sticky',
                top: '60px',
              }}
              aria-label="Search form panel"
            >
              <SearchForm />
            </aside>

            {/* Right panel — results */}
            <section
              style={{
                flex: 1,
                minWidth: 0,
                padding: '28px 32px',
                overflowY: 'auto',
                height: 'calc(100vh - 60px)',
                background: 'var(--bg-primary)',
              }}
              aria-label="Search results panel"
              aria-live="polite"
            >
              <ResultsPanel />
            </section>
          </main>
        ) : (
          <main style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 60px)', background: 'var(--bg-primary)' }}>
            <Tracker />
          </main>
        )}
      </div>
    </SearchProvider>
  )
}
