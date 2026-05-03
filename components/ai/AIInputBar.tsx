'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react'

interface AIInputBarProps {
  onTasksGenerated: (tasks: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }>) => void
}

export default function AIInputBar({ onTasksGenerated }: AIInputBarProps) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || loading) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      onTasksGenerated(data.tasks)
      setPrompt('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-muted">AI Task Generator</span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-surface border rounded-2xl transition-all duration-150 ${
          loading ? 'border-primary/60 shadow-glow' : 'border-border focus-within:border-primary/60 focus-within:shadow-glow'
        }`}>
          <Sparkles className="absolute left-4 w-5 h-5 text-primary/70 pointer-events-none flex-shrink-0" />
          <input
            id="ai-prompt-input"
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="Describe your project or goal... e.g. &quot;Launch a SaaS product in 30 days&quot;"
            className="flex-1 bg-transparent pl-12 pr-4 py-4 text-sm text-text placeholder:text-muted focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            id="ai-generate-btn"
            disabled={!prompt.trim() || loading}
            className="flex-shrink-0 mr-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              boxShadow: prompt.trim() && !loading ? '0 0 20px rgba(99,102,241,0.4)' : 'none',
            }}
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Thinking...</>
            ) : (
              <><ArrowRight className="w-4 h-4" /> Generate</>
            )}
          </button>
        </div>
      </form>

      {/* Loading state */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 flex items-center gap-2 text-sm text-primary"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                />
              ))}
            </div>
            <span>AI is breaking this down...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
