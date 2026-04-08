import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Toaster } from 'react-hot-toast'
import { RoleProvider } from '@/components/RoleProvider'
import { LoginGate } from '@/components/LoginGate'

export const metadata: Metadata = {
  title: 'LA28 Route Portal',
  description: 'Submit and track feature requests for the LA28 Route Portal.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-surface-0 text-text-primary">
        <RoleProvider>
          <LoginGate>
            <div className="flex min-h-screen max-w-[1200px] mx-auto py-20 gap-10 px-8">
              <Sidebar />
              <div className="flex-1 min-w-0 overflow-y-auto">
                <main className="max-w-[840px] px-6">
                  {children}
                </main>
              </div>
            </div>
          </LoginGate>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#f0f0f0',
                border: '1px solid #2a2a2a',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '22px',
              },
            }}
          />
        </RoleProvider>
      </body>
    </html>
  )
}
