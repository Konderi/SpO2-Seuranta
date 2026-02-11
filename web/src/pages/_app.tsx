import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { DemoProvider } from '@/contexts/DemoContext'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <AuthProvider>
      <DemoProvider>
        <Component {...pageProps} />
      </DemoProvider>
    </AuthProvider>
  )
}
