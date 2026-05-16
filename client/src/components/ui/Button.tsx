import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
  children: ReactNode
}

export function Button({ variant = 'primary', loading, disabled, children, style, ...rest }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    border: 'none',
    outline: 'none',
  }

  const primary: React.CSSProperties = {
    background: disabled || loading
      ? 'rgba(108,99,255,0.3)'
      : 'linear-gradient(135deg, #6c63ff, #7c74ff)',
    color: disabled || loading ? 'rgba(255,255,255,0.4)' : '#fff',
    boxShadow: disabled || loading ? 'none' : '0 4px 20px rgba(108,99,255,0.4)',
  }

  const ghost: React.CSSProperties = {
    background: 'transparent',
    color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
    border: '1px solid var(--border-strong)',
  }

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...(variant === 'primary' ? primary : ghost), ...style }}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
