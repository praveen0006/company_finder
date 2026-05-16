import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  id: string
}

export function Input({ label, error, id, style, ...rest }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <input
        id={id}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(244,63,94,0.5)' : 'var(--border-strong)'}`,
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '14px',
          color: 'var(--text-primary)',
          outline: 'none',
          width: '100%',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'inherit',
          ...style,
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(108,99,255,0.6)'
          e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? 'rgba(244,63,94,0.5)' : 'var(--border-strong)'
          e.target.style.boxShadow = 'none'
        }}
        {...rest}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#f43f5e' }}>{error}</span>
      )}
    </div>
  )
}
