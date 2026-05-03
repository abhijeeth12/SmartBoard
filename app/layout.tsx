import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'SmartBoard — AI-Powered Kanban',
  description:
    'Describe your project and let AI break it into actionable tasks. Drag, drop, and ship faster with SmartBoard.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-text antialiased">
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  )
}
