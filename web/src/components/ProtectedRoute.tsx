import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import { useRouter } from 'next/router'
import { useEffect, ReactNode } from 'react'
import { Activity } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const { isDemoMode } = useDemo()
  const router = useRouter()

  useEffect(() => {
    // Allow access if in demo mode OR authenticated
    if (!loading && !user && !isDemoMode) {
      router.push('/login')
    }
  }, [user, loading, isDemoMode, router])

  if (loading && !isDemoMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-text-secondary">Ladataan...</p>
        </div>
      </div>
    )
  }

  if (!user && !isDemoMode) {
    return null
  }

  return <>{children}</>
}
