export type Priority = 'high' | 'medium' | 'low'
export type Status = 'todo' | 'inprogress' | 'done'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  position: number
  created_at: string
}

export interface Column {
  id: Status
  label: string
  tasks: Task[]
}

export interface GeneratedTask {
  title: string
  description: string
  priority: Priority
}
