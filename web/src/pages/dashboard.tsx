import Head from 'next/head'
import Link from 'next/link'
import { Activity, Heart, TrendingUp, Plus, LogOut, User, Menu, X, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { isDemoMode, demoMeasurements, demoStats, exitDemoMode } = useDemo()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [measurements, setMeasurements] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  // Fetch real data from API or use demo data
  useEffect(() => {
    const fetchData = async () => {
      console.log('🔍 Dashboard fetchData - Auth State:', {
        isDemoMode,
        authLoading,
        hasUser: !!user,
        userEmail: user?.email,
        userId: user?.uid
      })
      
      if (isDemoMode) {
        console.log('📊 Using DEMO data')
        // Use demo data
        const dailyDemo = demoMeasurements.filter(m => m.type === 'daily')
        setMeasurements(dailyDemo.map(m => ({
          spo2: m.spo2,
          heart_rate: m.heartRate,
          systolic: m.systolic,
          diastolic: m.diastolic,
          measured_at: m.measured_at, // Already in seconds (Unix timestamp)
        })))
        setStats(demoStats)
        setLoading(false)
        return
      }

      // Wait for auth to be ready before making API calls
      if (authLoading) {
        console.log('⏳ Waiting for auth...')
        return
      }
      
      if (!user) {
        console.log('❌ No user - cannot fetch data')
        return
      }
      
      console.log('✅ User authenticated, fetching real data...')

      console.log('✅ User authenticated, fetching real data...')

      try {
        setLoading(true)
        console.log('📡 Calling API: getDailyMeasurements...')
        // Fetch latest measurements
        const dailyData = await apiClient.getDailyMeasurements()
        console.log('📥 Received daily data:', dailyData.length, 'measurements')
        setMeasurements(dailyData)
        
        console.log('📡 Calling API: getWeeklyStats...')
        // Fetch weekly statistics
        const weeklyStats = await apiClient.getWeeklyStats()
        console.log('📊 Received weekly stats:', weeklyStats)
        setStats({
          ...weeklyStats,
          latest_systolic: dailyData.length > 0 ? dailyData[0].systolic : null,
          latest_diastolic: dailyData.length > 0 ? dailyData[0].diastolic : null,
        })
      } catch (error) {
        console.error('❌ Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [isDemoMode, demoMeasurements, demoStats, authLoading, user])

  // Calculate latest measurements from real data - find latest for each metric
  const latestMeasurements = measurements.length > 0 ? {
    spo2: measurements.find(m => m.spo2 && m.spo2 > 0)?.spo2 || 0,
    heartRate: measurements.find(m => (m.heart_rate || m.heartRate) && (m.heart_rate || m.heartRate) > 0)?.heart_rate || 
               measurements.find(m => (m.heart_rate || m.heartRate) && (m.heart_rate || m.heartRate) > 0)?.heartRate || 0,
    systolic: measurements.find(m => m.systolic && m.systolic > 0)?.systolic || null,
    diastolic: measurements.find(m => m.diastolic && m.diastolic > 0)?.diastolic || null,
    date: new Date(measurements[0].measured_at * 1000).toLocaleDateString('fi-FI'), // Use latest measurement date
  } : {
    spo2: 0,
    heartRate: 0,
    systolic: null,
    diastolic: null,
    date: new Date().toLocaleDateString('fi-FI'),
  }

  // Debug logging
  if (measurements.length > 0) {
    console.log('Dashboard Latest Measurement Data:', {
      raw: measurements[0],
      calculated: latestMeasurements,
      allMeasurements: measurements.slice(0,3)
    })
  }

  const weeklyAverage = stats ? {
    spo2: Math.round(stats.avg_spo2 || stats.spo2?.average7days || 0),
    heartRate: Math.round(stats.avg_heart_rate || stats.heartRate?.average7days || 0),
    systolic: (stats.avg_systolic || stats.bloodPressure?.average7daysSystolic) ? Math.round(stats.avg_systolic || stats.bloodPressure?.average7daysSystolic || 0) : null,
    diastolic: (stats.avg_diastolic || stats.bloodPressure?.average7daysDiastolic) ? Math.round(stats.avg_diastolic || stats.bloodPressure?.average7daysDiastolic || 0) : null,
  } : {
    spo2: 0,
    heartRate: 0,
    systolic: null,
    diastolic: null,
  }

  // Debug logging for weekly stats
  if (stats) {
    console.log('Dashboard Weekly Stats:', {
      raw_stats: stats,
      avg_systolic: stats.avg_systolic,
      avg_diastolic: stats.avg_diastolic,
      bloodPressure: stats.bloodPressure,
      calculated: weeklyAverage
    })
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
                <Link href="/settings" className="text-lg text-text-secondary hover:text-primary transition-colors">
                  Asetukset
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
                  <Link href="/settings" className="text-lg text-text-secondary hover:text-primary px-4 py-2">
                    Asetukset
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
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/add-daily"
                className="card p-8 hover:shadow-elevation-3 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Päivittäinen</h3>
                    <p className="text-lg text-text-secondary">SpO2 ja syke</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-semibold text-lg">
                  <Plus className="w-6 h-6" />
                  <span>Lisää mittaus</span>
                </div>
              </Link>

              <Link
                href="/add-bloodpressure"
                className="card p-8 hover:shadow-elevation-3 transition-all cursor-pointer border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-red-600" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Verenpaine</h3>
                    <p className="text-lg text-text-secondary">Systolinen/Diastolinen</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
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
                    <TrendingUp className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">Liikunta</h3>
                    <p className="text-lg text-text-secondary">Ennen/jälkeen</p>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {latestMeasurements.systolic && latestMeasurements.diastolic && (
                  <div className="card bg-purple-50 border-2 p-8">
                    <Heart className="w-12 h-12 text-purple-600 mb-4" strokeWidth={2} />
                    <div className="text-4xl font-bold text-text-primary mb-2">{latestMeasurements.systolic}/{latestMeasurements.diastolic}</div>
                    <div className="text-lg text-text-secondary font-medium">Verenpaine</div>
                    <div className="text-sm text-text-secondary mt-2">{latestMeasurements.date}</div>
                  </div>
                )}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                  {weeklyAverage.systolic && weeklyAverage.diastolic && (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-600" strokeWidth={2} />
                        <h3 className="text-xl font-bold text-text-primary">Verenpaine</h3>
                      </div>
                      <div className="text-4xl font-bold text-text-primary mb-2">{weeklyAverage.systolic}/{weeklyAverage.diastolic}</div>
                      <p className="text-text-secondary">Normaali: &lt;120/80 mmHg</p>
                    </div>
                  )}
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
