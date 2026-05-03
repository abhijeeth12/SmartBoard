import { useMemo } from 'react'
import type { Task } from '@/lib/types'
import { isToday } from 'date-fns'

export function useAnalytics(tasks: Task[]) {
  return useMemo(() => {
    const total = tasks.length
    const inProgress = tasks.filter(t => t.status === 'inprogress').length
    const completedToday = tasks.filter(
      t => t.status === 'done' && isToday(new Date(t.created_at))
    ).length
    const todo = tasks.filter(t => t.status === 'todo').length
    const done = tasks.filter(t => t.status === 'done').length

    return { total, inProgress, completedToday, todo, done }
  }, [tasks])
}
