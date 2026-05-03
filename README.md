<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Claude_AI-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude AI" />
</div>

<h1 align="center">SmartBoard 🚀</h1>

<p align="center">
  <strong>An AI-powered Kanban task manager built for speed and flow.</strong><br>
  Describe your project goal, and let Claude AI instantly break it down into actionable tasks you can drag, drop, edit, and ship.
</p>

---

## ✨ Features

- **🤖 AI Task Generation**: Simply type a goal (e.g., "Build a landing page for my startup") and Anthropic's Claude AI instantly generates a structured list of tasks and populates your board.
- **📋 Interactive Kanban Board**: A fluid three-column layout (To Do, In Progress, Done) powered by `@hello-pangea/dnd` with beautifully animated drag-and-drop interactions.
- **⚡ Optimistic UI**: Changes feel instantaneous. Moving cards, editing details, and adding tasks update immediately on the screen before the database even responds.
- **📊 Real-time Analytics**: Live-updating stat pills track your Total Tasks, Tasks Completed Today, and Work In Progress.
- **🔐 Secure Authentication**: Full email/password user authentication backed by Supabase Auth and Row Level Security (RLS) — your data is strictly yours.
- **🎨 Premium UI/UX**: Built with Tailwind CSS and Framer Motion, featuring glassmorphism, animated gradients, smooth slide-in panels, and responsive design.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS v3
- **Animations & DnD**: Framer Motion, `@hello-pangea/dnd`
- **Backend/Database**: Supabase (PostgreSQL), Next.js API Routes
- **AI Integration**: Anthropic SDK (`claude-sonnet-4-5` via API)
- **Deployment**: Ready for Vercel

## 🚀 Getting Started

Want to run SmartBoard locally? Follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/smartboard.git
cd smartboard
npm install
```

### 2. Set up your Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Then, populate it with your keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Configure Supabase Database
In your Supabase project dashboard, open the **SQL Editor** and run the following script to create your `tasks` table and set up Row Level Security:

```sql
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'todo' check (status in ('todo', 'inprogress', 'done')),
  priority    text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_status_idx  on public.tasks(status);

alter table public.tasks enable row level security;

create policy "Users can manage their own tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the app!

## 🚢 Deployment

SmartBoard is optimized for Vercel. 
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `ANTHROPIC_API_KEY` to the Vercel Environment Variables settings.
4. Deploy!

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
"# SmartBoard" 
