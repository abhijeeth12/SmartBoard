import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const RequestSchema = z.object({
  prompt: z.string().min(1).max(2000),
})

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate body
    const body = await request.json()
    const parsed = RequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { prompt } = parsed.data

    // Call Claude
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: `You are a project planning assistant. When given a project description, return ONLY a valid JSON array with no markdown, no explanation. Each item: { "title": string, "description": string, "priority": "high"|"medium"|"low" }. Maximum 6 tasks. Be specific and actionable.`,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON — strip any accidental markdown
    const cleaned = raw.replace(/```json?/g, '').replace(/```/g, '').trim()
    const tasks = JSON.parse(cleaned)

    if (!Array.isArray(tasks)) throw new Error('Not an array')

    // Validate each task
    const validTasks = tasks
      .slice(0, 6)
      .filter((t: Record<string, unknown>) => typeof t.title === 'string' && t.title.trim())
      .map((t: Record<string, unknown>) => ({
        title: String(t.title).trim(),
        description: typeof t.description === 'string' ? t.description.trim() : '',
        priority: ['high', 'medium', 'low'].includes(String(t.priority)) ? t.priority as string : 'medium',
      }))

    // Insert into Supabase
    const maxPosResult = await supabase
      .from('tasks')
      .select('position')
      .eq('user_id', user.id)
      .eq('status', 'todo')
      .order('position', { ascending: false })
      .limit(1)

    const maxPos = maxPosResult.data?.[0]?.position ?? -1

    const rows = validTasks.map((t, i) => ({
      user_id: user.id,
      title: t.title,
      description: t.description,
      status: 'todo',
      priority: t.priority,
      position: maxPos + i + 1,
    }))

    const { data: inserted, error: insertError } = await supabase
      .from('tasks')
      .insert(rows)
      .select()

    if (insertError) throw insertError

    return NextResponse.json({ tasks: inserted })
  } catch (error) {
    console.error('[/api/generate]', error)
    return NextResponse.json(
      { error: 'Failed to generate tasks. Please try again.' },
      { status: 500 }
    )
  }
}
