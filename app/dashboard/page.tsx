'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Zap, LogOut } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import KanbanBoard from '@/components/board/KanbanBoard'
import AIInputBar from '@/components/ai/AIInputBar'
import AnalyticsBar from '@/components/analytics/AnalyticsBar'
import type { Task, Status, Priority } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut } = useSupabase()
  const { tasks, loading, addTask, updateTask, deleteTask, moveTask } = useTasks()
  const analytics = useAnalytics(tasks)
  const [newTaskIds, setNewTaskIds] = useState<Set<string>>(new Set())

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleTasksGenerated = useCallback(
    (generated: Array<{ title: string; description: string; priority: Priority }>) => {
      generated.forEach((g, i) => {
        setTimeout(async () => {
          const task = await addTask(g.title, 'todo', g.priority, g.description)
          if (task) {
            setNewTaskIds(prev => new Set(prev).add(task.id))
            // Remove "new" marker after animation
            setTimeout(() => {
              setNewTaskIds(prev => {
                const next = new Set(prev)
                next.delete(task.id)
                return next
              })
            }, 600)
          }
        }, i * 200) // stagger 200ms between each
      })
    },
    [addTask]
  )

  const handleMoveTask = useCallback(
    async (taskId: string, newStatus: Status, newPosition: number) => {
      await moveTask(taskId, newStatus, newPosition)
    },
    [moveTask]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/20 border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text leading-none">SmartBoard</h1>
              <p className="text-xs text-muted">AI-Powered Kanban</p>
            </div>
          </div>

          {/* User + signout */}
          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-xs text-muted truncate max-w-[160px]">
                {user.email}
              </span>
            )}
            <button
              id="signout-btn"
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted hover:text-text hover:bg-border/50 transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Page heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text">My Board</h2>
            <p className="text-sm text-muted mt-0.5">
              Describe a goal below and let AI create your tasks instantly.
            </p>
          </div>

          {/* AI Input */}
          <AIInputBar onTasksGenerated={handleTasksGenerated} />

          {/* Analytics */}
          <AnalyticsBar
            total={analytics.total}
            completedToday={analytics.completedToday}
            inProgress={analytics.inProgress}
          />

          {/* Board */}
          <KanbanBoard
            tasks={tasks}
            loading={loading}
            newTaskIds={newTaskIds}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onMoveTask={handleMoveTask}
          />
        </motion.div>
      </main>
    </div>
  )
}
