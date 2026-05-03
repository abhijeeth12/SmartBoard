'use client'

import { Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import type { Task } from '@/lib/types'
import { priorityColor, priorityDot, formatDate } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'

interface TaskCardProps {
  task: Task
  index: number
  onClick: (task: Task) => void
  isNew?: boolean
}

export default function TaskCard({ task, index, onClick, isNew }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        // Plain div owns the dnd refs + drag handlers — avoids framer-motion type conflict
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ''} rotate(2deg)`
              : provided.draggableProps.style?.transform,
          }}
        >
          {/* motion.div purely for visual animation */}
          <AnimatePresence>
            <motion.div
              key={task.id}
              initial={isNew ? { opacity: 0, y: 20, scale: 0.95 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={() => onClick(task)}
              className={`
                group relative bg-surface border rounded-xl p-4 cursor-pointer select-none
                transition-all duration-150 mt-2
                ${snapshot.isDragging
                  ? 'border-primary/60 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(99,102,241,0.4)] opacity-95'
                  : 'border-border hover:border-primary/40 hover:shadow-card-hover hover:-translate-y-0.5'
                }
              `}
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-sm font-semibold text-text leading-snug line-clamp-2 flex-1">
                  {task.title}
                </h3>
                <span
                  className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${priorityDot(task.priority)}`}
                />
              </div>

              {/* Description */}
              {task.description && (
                <p className="text-xs text-muted line-clamp-2 mb-3">{task.description}</p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${priorityColor(task.priority)}`}
                >
                  {task.priority}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(task.created_at)}
                </span>
              </div>

              {/* Hover shimmer accent */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Draggable>
  )
}
