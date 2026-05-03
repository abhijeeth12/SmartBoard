'use client'

import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Plus, ClipboardList } from 'lucide-react'
import TaskCard from './TaskCard'
import AddTaskInput from './AddTaskInput'
import type { Task, Status, Priority } from '@/lib/types'

const COLUMN_CONFIG: Record<Status, { label: string; borderColor: string; badgeColor: string }> = {
  todo: {
    label: 'To Do',
    borderColor: 'border-t-slate-500',
    badgeColor: 'bg-slate-500/20 text-slate-300',
  },
  inprogress: {
    label: 'In Progress',
    borderColor: 'border-t-indigo-500',
    badgeColor: 'bg-indigo-500/20 text-indigo-300',
  },
  done: {
    label: 'Done',
    borderColor: 'border-t-green-500',
    badgeColor: 'bg-green-500/20 text-green-300',
  },
}

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
  onAddTask: (title: string, status: Status, priority: Priority, description?: string) => void
  onCardClick: (task: Task) => void
  newTaskIds: Set<string>
}

export default function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onCardClick,
  newTaskIds,
}: KanbanColumnProps) {
  const [showInput, setShowInput] = useState(false)
  const config = COLUMN_CONFIG[status]

  return (
    <div className={`flex flex-col bg-surface/50 border border-border border-t-4 ${config.borderColor} rounded-2xl min-h-[520px] w-full`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-text text-sm">{config.label}</h2>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badgeColor}`}>
            {tasks.length}
          </span>
        </div>
        <button
          id={`add-task-${status}`}
          onClick={() => setShowInput(true)}
          className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors duration-150"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Add input */}
      {showInput && (
        <div className="px-3">
          <AddTaskInput
            status={status}
            onAdd={(title, s, priority, desc) => {
              onAddTask(title, s, priority, desc)
              setShowInput(false)
            }}
            onCancel={() => setShowInput(false)}
          />
        </div>
      )}

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 px-3 py-2 space-y-2 transition-colors duration-150 rounded-b-2xl overflow-y-auto
              ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}
            `}
          >
            {tasks.length === 0 && !showInput ? (
              <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-border/60 rounded-xl mt-2 text-center px-4">
                <ClipboardList className="w-6 h-6 text-muted/50 mb-2" />
                <p className="text-xs text-muted/70">
                  {status === 'todo'
                    ? 'No tasks yet — add one or use AI'
                    : status === 'inprogress'
                    ? 'Drag tasks here to start working'
                    : 'Completed tasks will appear here'}
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={onCardClick}
                  isNew={newTaskIds.has(task.id)}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
