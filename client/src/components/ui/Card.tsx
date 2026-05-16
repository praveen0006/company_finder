import React, { ReactNode } from 'react'

interface CardProps {
  accent?: boolean
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Card({ accent, children, style }: CardProps) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${accent ? 'rgba(16, 217, 160, 0.3)' : 'var(--border)'}`,
        borderLeft: accent ? '3px solid #10d9a0' : `1px solid var(--border)`,
        borderRadius: '14px',
        padding: '20px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
