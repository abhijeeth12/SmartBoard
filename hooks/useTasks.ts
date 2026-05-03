'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import type { Task, Status, Priority } from '@/lib/types'

export function useTasks() {
  const { user } = useSupabase()
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })

    if (!error && data) {
      setTasks(data as Task[])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(
    async (title: string, status: Status = 'todo', priority: Priority = 'medium', description = '') => {
      if (!user) return null
      const maxPosition = tasks
        .filter(t => t.status === status)
        .reduce((max, t) => Math.max(max, t.position), -1)

      const newTask: Omit<Task, 'id' | 'created_at'> = {
        user_id: user.id,
        title,
        description: description || null,
        status,
        priority,
        position: maxPosition + 1,
      }

      // Optimistic update
      const tempId = `temp-${Date.now()}`
      const optimisticTask = { ...newTask, id: tempId, created_at: new Date().toISOString() } as Task
      setTasks(prev => [...prev, optimisticTask])

      const { data, error } = await supabase.from('tasks').insert(newTask).select().single()

      if (error) {
        setTasks(prev => prev.filter(t => t.id !== tempId))
        return null
      }

      setTasks(prev => prev.map(t => (t.id === tempId ? (data as Task) : t)))
      return data as Task
    },
    [user, tasks]
  )

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      // Optimistic update
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
      await supabase.from('tasks').update(updates).eq('id', id)
    },
    []
  )

  const deleteTask = useCallback(
    async (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id))
      await supabase.from('tasks').delete().eq('id', id)
    },
    []
  )

  const moveTask = useCallback(
    async (taskId: string, newStatus: Status, newPosition: number) => {
      setTasks(prev => {
        const updated = prev.map(t => {
          if (t.id === taskId) return { ...t, status: newStatus, position: newPosition }
          return t
        })
        return updated
      })

      await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId)
    },
    []
  )

  const addGeneratedTasks = useCallback(
    async (generated: Array<{ title: string; description: string; priority: Priority }>) => {
      if (!user) return []
      const todoTasks = tasks.filter(t => t.status === 'todo')
      const maxPos = todoTasks.reduce((max, t) => Math.max(max, t.position), -1)

      const newTasks = generated.map((g, i) => ({
        user_id: user.id,
        title: g.title,
        description: g.description,
        status: 'todo' as Status,
        priority: g.priority,
        position: maxPos + i + 1,
      }))

      const { data, error } = await supabase.from('tasks').insert(newTasks).select()
      if (!error && data) {
        setTasks(prev => [...prev, ...(data as Task[])])
        return data as Task[]
      }
      return []
    },
    [user, tasks]
  )

  return { tasks, setTasks, loading, addTask, updateTask, deleteTask, moveTask, addGeneratedTasks, refetch: fetchTasks }
}
