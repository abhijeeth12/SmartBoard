'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Status, Priority } from '@/lib/types'

interface AddTaskInputProps {
  status: Status
  onAdd: (title: string, status: Status, priority: Priority, description?: string) => void
  onCancel: () => void
}

export default function AddTaskInput({ status, onAdd, onCancel }: AddTaskInputProps) {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), status, priority)
    setTitle('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 animate-slide-up">
      <div className="bg-surface border border-primary/40 rounded-xl p-3 space-y-2 shadow-glow">
        <input
          autoFocus
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Task title..."
          className="w-full bg-transparent text-sm text-text placeholder:text-muted focus:outline-none"
          id="add-task-input"
        />

        <div className="flex items-center justify-between">
          {/* Priority selector */}
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as Priority[]).map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition-all duration-150 capitalize ${
                  priority === p
                    ? p === 'high'
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                      : p === 'medium'
                      ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-500/50'
                      : 'bg-green-500/30 text-green-300 border border-green-500/50'
                    : 'text-muted hover:text-text border border-transparent'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={onCancel}
              className="p-1 rounded-lg text-muted hover:text-text hover:bg-border/50 transition-all duration-150"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="p-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
