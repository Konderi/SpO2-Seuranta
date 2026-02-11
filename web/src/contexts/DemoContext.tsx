import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { generateDemoData, calculateDemoStats, DemoMeasurement } from '@/lib/demoData'

interface DemoContextType {
  isDemoMode: boolean
  enterDemoMode: () => void
  exitDemoMode: () => void
  demoMeasurements: DemoMeasurement[]
  demoStats: any
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [demoMeasurements, setDemoMeasurements] = useState<DemoMeasurement[]>([])
  const [demoStats, setDemoStats] = useState<any>(null)

  // Check if demo mode is active on mount (from localStorage)
  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode') === 'true'
    if (demoMode) {
      const measurements = generateDemoData()
      setDemoMeasurements(measurements)
      setDemoStats(calculateDemoStats(measurements))
      setIsDemoMode(true)
    }
  }, [])

  const enterDemoMode = () => {
    const measurements = generateDemoData()
    setDemoMeasurements(measurements)
    setDemoStats(calculateDemoStats(measurements))
    setIsDemoMode(true)
    localStorage.setItem('demoMode', 'true')
  }

  const exitDemoMode = () => {
    setIsDemoMode(false)
    setDemoMeasurements([])
    setDemoStats(null)
    localStorage.removeItem('demoMode')
  }

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        enterDemoMode,
        exitDemoMode,
        demoMeasurements,
        demoStats,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export const useDemo = () => {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
