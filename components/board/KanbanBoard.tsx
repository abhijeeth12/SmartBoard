'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd'
import KanbanColumn from './KanbanColumn'
import TaskDetailPanel from './TaskDetailPanel'
import type { Task, Status, Priority } from '@/lib/types'

const COLUMNS: Status[] = ['todo', 'inprogress', 'done']

interface KanbanBoardProps {
  tasks: Task[]
  loading: boolean
  newTaskIds: Set<string>
  onAddTask: (title: string, status: Status, priority: Priority, description?: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onMoveTask: (taskId: string, newStatus: Status, newPosition: number) => void
}

export default function KanbanBoard({
  tasks,
  loading,
  newTaskIds,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onMoveTask,
}: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const getColumnTasks = useCallback(
    (status: Status) =>
      tasks
        .filter(t => t.status === status)
        .sort((a, b) => a.position - b.position),
    [tasks]
  )

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newStatus = destination.droppableId as Status
    onMoveTask(draggableId, newStatus, destination.index)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map(col => (
          <div key={col} className="bg-surface/50 border border-border rounded-2xl p-4 min-h-[520px]">
            <div className="skeleton h-5 w-24 rounded mb-4" />
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-24 rounded-xl mb-3" />
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col}
              status={col}
              tasks={getColumnTasks(col)}
              onAddTask={onAddTask}
              onCardClick={setSelectedTask}
              newTaskIds={newTaskIds}
            />
          ))}
        </div>
      </DragDropContext>

      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={onUpdateTask}
        onDelete={onDeleteTask}
      />
    </>
  )
}
