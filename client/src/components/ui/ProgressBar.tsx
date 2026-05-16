import React from 'react'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  score: number
}

function getColor(score: number): string {
  if (score >= 65) return '#10d9a0'
  if (score >= 40) return '#f59e0b'
  return '#f43f5e'
}

export function ProgressBar({ score }: ProgressBarProps) {
  const color = getColor(score)
  return (
    <div
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.07)',
        borderRadius: '999px',
        height: '6px',
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: color,
          borderRadius: '999px',
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
  )
}
