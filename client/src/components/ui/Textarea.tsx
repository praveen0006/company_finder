import React, { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  maxLength?: number
  id: string
}

export function Textarea({ label, error, id, maxLength, value, style, ...rest }: TextareaProps) {
  const len = typeof value === 'string' ? value.length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label htmlFor={id} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em' }}>
          {label}
        </label>
        {maxLength != null && (
          <span style={{ fontSize: '11px', color: len > maxLength * 0.9 ? '#f59e0b' : 'var(--text-muted)' }}>
            {len} / {maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        maxLength={maxLength}
        value={value}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${error ? 'rgba(244,63,94,0.5)' : 'var(--border-strong)'}`,
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '14px',
          color: 'var(--text-primary)',
          outline: 'none',
          width: '100%',
          minHeight: '120px',
          resize: 'vertical',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          fontFamily: 'inherit',
          lineHeight: '1.6',
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
