'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Save } from 'lucide-react'
import { useState } from 'react'
import type { Task, Priority } from '@/lib/types'
import { priorityColor } from '@/lib/utils'

interface TaskDetailPanelProps {
  task: Task | null
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function TaskDetailPanel({ task, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [isDirty, setIsDirty] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description ?? '')
      setPriority(task.priority)
      setIsDirty(false)
    }
  }, [task])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSave = () => {
    if (!task) return
    onUpdate(task.id, { title: title.trim(), description: description.trim() || null, priority })
    setIsDirty(false)
    onClose()
  }

  const handleDelete = () => {
    if (!task) return
    onDelete(task.id)
    onClose()
  }

  return (
    <AnimatePresence>
      {task && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            ref={panelRef}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border shadow-[−20px_0_60px_rgba(0,0,0,0.4)] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-text">Edit Task</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-border/50 transition-all duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Title</label>
                <input
                  id="task-detail-title"
                  value={title}
                  onChange={e => { setTitle(e.target.value); setIsDirty(true) }}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Description</label>
                <textarea
                  id="task-detail-description"
                  value={description}
                  onChange={e => { setDescription(e.target.value); setIsDirty(true) }}
                  rows={4}
                  placeholder="Add more details..."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150 resize-none"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted uppercase tracking-wider">Priority</label>
                <div className="flex gap-2">
                  {(['high', 'medium', 'low'] as Priority[]).map(p => (
                    <button
                      key={p}
                      id={`priority-${p}`}
                      onClick={() => { setPriority(p); setIsDirty(true) }}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-all duration-150 ${
                        priority === p
                          ? priorityColor(p) + ' scale-105'
                          : 'border-border text-muted hover:border-primary/40 hover:text-text'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Meta */}
              <div className="bg-background/50 rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted">
                  <span className="font-medium text-text/60">Status: </span>
                  <span className="capitalize">{task.status === 'inprogress' ? 'In Progress' : task.status}</span>
                </p>
                <p className="text-xs text-muted">
                  <span className="font-medium text-text/60">Created: </span>
                  {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <button
                id="delete-task-btn"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-150"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                id="save-task-btn"
                onClick={handleSave}
                disabled={!isDirty || !title.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
