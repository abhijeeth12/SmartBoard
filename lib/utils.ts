import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Priority } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function priorityColor(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500/15 text-red-400 border-red-500/30'
    case 'medium':
      return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
    case 'low':
      return 'bg-green-500/15 text-green-400 border-green-500/30'
  }
}

export function priorityDot(priority: Priority): string {
  switch (priority) {
    case 'high':
      return 'bg-red-400'
    case 'medium':
      return 'bg-yellow-400'
    case 'low':
      return 'bg-green-400'
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
