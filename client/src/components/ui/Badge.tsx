import React from 'react'

type Variant = 'strong' | 'partial' | 'low' | 'neutral' | 'hit' | 'miss'

interface BadgeProps {
  label: string
  variant?: Variant
}

const styles: Record<Variant, React.CSSProperties> = {
  strong: { background: 'rgba(16, 217, 160, 0.18)', color: '#10d9a0', border: '1px solid rgba(16,217,160,0.3)' },
  partial: { background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
  low: { background: 'rgba(244, 63, 94, 0.18)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)' },
  neutral: { background: 'rgba(255,255,255,0.07)', color: '#9090a8', border: '1px solid rgba(255,255,255,0.1)' },
  hit: { background: 'rgba(16, 217, 160, 0.12)', color: '#10d9a0', border: '1px solid rgba(16,217,160,0.25)' },
  miss: { background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.25)' },
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      style={{
        ...styles[variant],
        display: 'inline-flex',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: '20px',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
