'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Mail, Lock, Zap } from 'lucide-react'

export default function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Try to sign in directly (works if email confirmation is off)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (!signInError) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setSuccess(true)
        setLoading(false)
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/20 border border-success/30 mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">Check your email</h2>
          <p className="text-muted text-sm">
            We sent a confirmation link to <span className="text-text font-medium">{email}</span>. Click it to activate your account.
          </p>
          <Link href="/login" className="mt-6 inline-block text-primary text-sm hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
            <Zap className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">SmartBoard</h1>
          <p className="text-muted mt-2 text-sm">Create your free account</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text/80" htmlFor="signup-email">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text/80" htmlFor="signup-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-150"
                />
              </div>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="signup-submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 transition-all duration-150 shadow-glow"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
