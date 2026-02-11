import Head from 'next/head'
import Link from 'next/link'
import { Activity, Heart, TrendingUp, Plus, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { isDemoMode, demoMeasurements, demoStats, exitDemoMode } = useDemo()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  // Fetch real data from API or use demo data
  useEffect(() => {
    const fetchData = async () => {
      if (isDemoMode) {
        // Use demo data
        const dailyDemo = demoMeasurements.filter(m => m.type === 'daily')
        setMeasurements(dailyDemo.map(m => ({
          spo2: m.spo2,
          heart_rate: m.heartRate,
          measured_at: m.measured_at * 1000, // Convert to milliseconds for Date
        })))
        setStats(demoStats)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Fetch latest measurements
        const dailyData = await apiClient.getDailyMeasurements()
        setMeasurements(dailyData)
        
        // Fetch weekly statistics
        const weeklyStats = await apiClient.getWeeklyStats()
        setStats(weeklyStats)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isDemoMode, demoMeasurements, demoStats])

  // Calculate latest measurements and trend from real data
  const latestMeasurements = measurements.length > 0 ? {
    spo2: measurements[0].spo2,
    heartRate: measurements[0].heart_rate || measurements[0].heartRate,
    trend: measurements.length > 1 
      ? `${measurements[0].spo2 > measurements[1].spo2 ? '+' : ''}${measurements[0].spo2 - measurements[1].spo2}%`
      : '0%',
    date: new Date(measurements[0].measured_at).toLocaleDateString('fi-FI'),
  } : {
    spo2: 0,
    heartRate: 0,
    trend: '0%',
    date: new Date().toLocaleDateString('fi-FI'),
  }

  const weeklyAverage = stats ? {
    spo2: Math.round(stats.avg_spo2),
    heartRate: Math.round(stats.avg_heart_rate),
  } : {
    spo2: 0,
    heartRate: 0,
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Dashboard - Hapetus</title>
        <meta name="description" content="Terveyden seurannan hallintapaneeli" />
      </Head>

      <main className="min-h-screen bg-background">
        {/* Header / Navigation */}
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-border shadow-elevation-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center gap-3">
                <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
                <span className="text-3xl font-bold text-primary">Hapetus</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {isDemoMode && (
                  <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-2xl text-sm font-semibold flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Demo-tila
                  </div>
                )}
                <Link href="/dashboard" className="text-lg font-semibold text-primary">
                  Etusivu
                </Link>
                <Link href="/history" className="text-lg text-text-secondary hover:text-primary transition-colors">
                  Historia
                </Link>
                <Link href="/statistics" className="text-lg text-text-secondary hover:text-primary transition-colors">
                  Tilastot
                </Link>
                <div className="flex items-center gap-3 ml-6 pl-6 border-l border-border">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">
                      {isDemoMode ? 'Demo-tila' : 'Kirjautunut'}
                    </p>
                    <p className="font-semibold text-text-primary">
                      {isDemoMode ? 'Demo' : (user?.displayName || 'Käyttäjä')}
                    </p>
                  </div>
                  {isDemoMode ? (
                    <button
                      onClick={() => { exitDemoMode(); window.location.href = '/' }}
                      className="btn btn-secondary"
                      title="Poistu demosta"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => signOut()}
                      className="btn btn-secondary"
                      title="Kirjaudu ulos"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              >
                {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-border">
                <div className="flex flex-col gap-4">
                  <Link href="/dashboard" className="text-lg font-semibold text-primary px-4 py-2">
                    Etusivu
                  </Link>
                  <Link href="/history" className="text-lg text-text-secondary hover:text-primary px-4 py-2">
                    Historia
                  </Link>
                  <Link href="/statistics" className="text-lg text-text-secondary hover:text-primary px-4 py-2">
                    Tilastot
                  </Link>
                  <div className="px-4 py-2 border-t border-border mt-2">
                    <p className="text-sm text-text-secondary mb-1">Kirjautunut</p>
                    <p className="font-semibold text-text-primary mb-3">{user?.displayName || 'Käyttäjä'}</p>
                    <button
                      onClick={() => signOut()}
                      className="btn btn-secondary w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      Kirjaudu ulos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-h1 font-bold text-text-primary mb-2">
              Tervetuloa, {user?.displayName?.split(' ')[0] || 'Käyttäjä'}!
            </h1>
            <p className="text-xl text-text-secondary">
              Tänään on {new Date().toLocaleDateString('fi-FI', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Lisää mittaus</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/add-daily"
                className="card p-8 hover:shadow-elevation-3 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Päivittäinen mittaus</h3>
                    <p className="text-lg text-text-secondary">Tallenna SpO2 ja syke</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Plus className="w-6 h-6" />
                  <span>Lisää mittaus</span>
                </div>
              </Link>

              <Link
                href="/add-exercise"
                className="card p-8 hover:shadow-elevation-3 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Liikunta</h3>
                    <p className="text-lg text-text-secondary">Ennen/jälkeen mittaus</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Plus className="w-6 h-6" />
                  <span>Lisää liikunta</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Latest Measurements */}
          <div className="mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Viimeisin mittaus</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-text-secondary mt-4">Ladataan mittauksia...</p>
              </div>
            ) : measurements.length === 0 ? (
              <div className="card p-12 text-center">
                <Activity className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                <p className="text-xl text-text-secondary mb-4">Ei mittauksia vielä</p>
                <p className="text-text-secondary mb-6">Aloita lisäämällä ensimmäinen mittauksesi</p>
                <Link href="/add-daily" className="btn bg-primary text-white hover:bg-primary-dark">
                  Lisää mittaus
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card bg-green-50 border-2 p-8">
                  <Heart className="w-12 h-12 text-success mb-4" strokeWidth={2} />
                  <div className="text-5xl font-bold text-text-primary mb-2">{latestMeasurements.spo2}%</div>
                  <div className="text-lg text-text-secondary font-medium">Happisaturaatio</div>
                  <div className="text-sm text-text-secondary mt-2">{latestMeasurements.date}</div>
                </div>

                <div className="card bg-red-50 border-2 p-8">
                  <Activity className="w-12 h-12 text-error mb-4" strokeWidth={2} />
                  <div className="text-5xl font-bold text-text-primary mb-2">{latestMeasurements.heartRate}</div>
                  <div className="text-lg text-text-secondary font-medium">Syke (bpm)</div>
                  <div className="text-sm text-text-secondary mt-2">{latestMeasurements.date}</div>
                </div>

                <div className="card bg-blue-50 border-2 p-8">
                  <TrendingUp className="w-12 h-12 text-primary mb-4" strokeWidth={2} />
                  <div className="text-5xl font-bold text-text-primary mb-2">{latestMeasurements.trend}</div>
                  <div className="text-lg text-text-secondary font-medium">Kehitys</div>
                  <div className="text-sm text-text-secondary mt-2">Edelliseen mittaukseen</div>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Averages */}
          <div className="mb-12">
            <h2 className="text-h2 font-bold text-text-primary mb-6">Viikon keskiarvot</h2>
            {loading ? (
              <div className="card p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : stats && measurements.length > 0 ? (
              <div className="card p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Heart className="w-8 h-8 text-success" strokeWidth={2} />
                      <h3 className="text-xl font-bold text-text-primary">Happisaturaatio</h3>
                    </div>
                    <div className="text-4xl font-bold text-text-primary mb-2">{weeklyAverage.spo2}%</div>
                    <p className="text-text-secondary">Normaali alue: 95-100%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Activity className="w-8 h-8 text-error" strokeWidth={2} />
                      <h3 className="text-xl font-bold text-text-primary">Syke</h3>
                    </div>
                    <div className="text-4xl font-bold text-text-primary mb-2">{weeklyAverage.heartRate} bpm</div>
                    <p className="text-text-secondary">Normaali alue: 60-100 bpm</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-text-secondary">Ei tarpeeksi mittauksia keskiarvojen laskentaan</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/history" className="card p-6 hover:shadow-elevation-3 transition-all">
              <h3 className="text-xl font-bold text-text-primary mb-2">Katso historia</h3>
              <p className="text-text-secondary">Näytä kaikki mittaukset ja trendit</p>
            </Link>

            <Link href="/statistics" className="card p-6 hover:shadow-elevation-3 transition-all">
              <h3 className="text-xl font-bold text-text-primary mb-2">Tilastot ja raportit</h3>
              <p className="text-text-secondary">Analysoi terveysdataa ja luo raportteja</p>
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
