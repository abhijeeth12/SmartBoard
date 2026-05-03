'use client'

import { motion } from 'framer-motion'
import { LayoutGrid, CheckCircle2, Timer } from 'lucide-react'

interface AnalyticsBarProps {
  total: number
  completedToday: number
  inProgress: number
}

const pills = [
  {
    key: 'total',
    label: 'Total Tasks',
    icon: LayoutGrid,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    key: 'completedToday',
    label: 'Completed Today',
    icon: CheckCircle2,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    key: 'inProgress',
    label: 'In Progress',
    icon: Timer,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
  },
] as const

export default function AnalyticsBar({ total, completedToday, inProgress }: AnalyticsBarProps) {
  const values = { total, completedToday, inProgress }

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {pills.map((pill, i) => {
        const Icon = pill.icon
        const value = values[pill.key]
        return (
          <motion.div
            key={pill.key}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${pill.bg} ${pill.border} flex-1 min-w-[140px]`}
          >
            <div className={`p-1.5 rounded-lg ${pill.bg}`}>
              <Icon className={`w-4 h-4 ${pill.color}`} />
            </div>
            <div>
              <motion.p
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-xl font-bold ${pill.color}`}
              >
                {value}
              </motion.p>
              <p className="text-xs text-muted">{pill.label}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
