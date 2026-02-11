import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, TrendingUp, Heart, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { generateDailyChartData, generateWeeklyChartData } from '@/lib/demoData'

export default function Statistics() {
  const { user } = useAuth()
  const { isDemoMode, demoMeasurements, demoStats } = useDemo()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [chartPeriod, setChartPeriod] = useState<'daily' | 'weekly'>('daily')
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchStatistics = async () => {
      if (isDemoMode) {
        // Use demo data
        setStats(demoStats)
        setChartData(generateDailyChartData(demoMeasurements))
        setLoading(false)
        return
      }

      try {
        const [weeklyStats, dailyStats, dailyData, exerciseData] = await Promise.all([
          apiClient.getWeeklyStats(),
          apiClient.getDailyStats(30), // Get 30 days for monthly stats
          apiClient.getDailyMeasurements(),
          apiClient.getExerciseMeasurements()
        ])

        // Calculate monthly stats from daily stats
        const monthlyAvgSpo2 = dailyStats.length > 0
          ? Math.round(dailyStats.reduce((sum: any, s: any) => sum + s.avg_spo2, 0) / dailyStats.length)
          : 0
        const monthlyAvgHR = dailyStats.length > 0
          ? Math.round(dailyStats.reduce((sum: any, s: any) => sum + s.avg_heart_rate, 0) / dailyStats.length)
          : 0

        // Get latest measurement from daily data
        const latestDaily = dailyData.length > 0 ? dailyData[0] : null

        setStats({
          spo2: {
            current: latestDaily?.spo2 || 0,
            average7days: weeklyStats.avg_spo2 ? Math.round(weeklyStats.avg_spo2) : 0,
            average30days: monthlyAvgSpo2,
            min: weeklyStats.min_spo2 || 0,
            max: weeklyStats.max_spo2 || 0,
          },
          heartRate: {
            current: latestDaily?.heart_rate || 0,
            average7days: weeklyStats.avg_heart_rate ? Math.round(weeklyStats.avg_heart_rate) : 0,
            average30days: monthlyAvgHR,
            min: weeklyStats.min_heart_rate || 0,
            max: weeklyStats.max_heart_rate || 0,
          },
          totalMeasurements: dailyData.length,
          exerciseSessions: exerciseData.length,
        })

        // Generate chart data from daily stats
        const formattedChartData = dailyStats.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
          dateLabel: new Date(day.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
          spo2: Math.round(day.avg_spo2 * 10) / 10,
          heartRate: Math.round(day.avg_heart_rate)
        }))
        setChartData(formattedChartData)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        // Set empty stats on error
        setStats({
          spo2: { current: 0, average7days: 0, average30days: 0, min: 0, max: 0 },
          heartRate: { current: 0, average7days: 0, average30days: 0, min: 0, max: 0 },
          totalMeasurements: 0,
          exerciseSessions: 0,
        })
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [isDemoMode, demoMeasurements, demoStats])

  // Toggle chart period
  const handleChartPeriodChange = (period: 'daily' | 'weekly') => {
    setChartPeriod(period)
    if (isDemoMode) {
      if (period === 'daily') {
        setChartData(generateDailyChartData(demoMeasurements))
      } else {
        setChartData(generateWeeklyChartData(demoMeasurements))
      }
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Tilastot - Hapetus</title>
      </Head>

      <main className="min-h-screen bg-background">
        {/* Header */}
        <nav className="w-full bg-white border-b border-border shadow-elevation-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/dashboard" className="flex items-center gap-3">
                <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
                <span className="text-3xl font-bold text-primary">Hapetus</span>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-lg text-text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-6 h-6" />
            Takaisin
          </Link>

          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-h1 font-bold text-text-primary mb-2">Tilastot ja raportit</h1>
            <p className="text-xl text-text-secondary">Yhteenveto terveystiedoistasi</p>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-xl text-text-secondary">Ladataan tilastoja...</p>
            </div>
          ) : !stats || stats.totalMeasurements === 0 ? (
            <div className="card p-12 text-center">
              <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <p className="text-xl text-text-secondary mb-6">
                Ei tarpeeksi mittauksia tilastojen laskentaan
              </p>
              <Link href="/add-daily" className="btn btn-primary">
                Lisää ensimmäinen mittaus
              </Link>
            </div>
          ) : (
            <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="card p-8 bg-green-50 border-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-success/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-success" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Happisaturaatio</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-text-secondary mb-1">Viimeisin</p>
                  <p className="text-4xl font-bold text-text-primary">{stats.spo2.current}%</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">7 päivän keskiarvo</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.spo2.average7days}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">30 päivän keskiarvo</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.spo2.average30days}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Minimi</p>
                    <p className="text-xl font-bold text-text-primary">{stats.spo2.min}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Maksimi</p>
                    <p className="text-xl font-bold text-text-primary">{stats.spo2.max}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8 bg-red-50 border-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-error/10 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-error" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Syke</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-text-secondary mb-1">Viimeisin</p>
                  <p className="text-4xl font-bold text-text-primary">{stats.heartRate.current} bpm</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">7 päivän keskiarvo</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.heartRate.average7days} bpm</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">30 päivän keskiarvo</p>
                    <p className="text-2xl font-bold text-text-primary">{stats.heartRate.average30days} bpm</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Minimi</p>
                    <p className="text-xl font-bold text-text-primary">{stats.heartRate.min} bpm</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Maksimi</p>
                    <p className="text-xl font-bold text-text-primary">{stats.heartRate.max} bpm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="card p-8 mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">Aktiivisuus</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-surface rounded-xl">
                <p className="text-text-secondary mb-2">Mittauksia yhteensä</p>
                <p className="text-4xl font-bold text-text-primary">{stats.totalMeasurements}</p>
              </div>
              <div className="p-6 bg-surface rounded-xl">
                <p className="text-text-secondary mb-2">Liikuntakertoja</p>
                <p className="text-4xl font-bold text-text-primary">{stats.exerciseSessions}</p>
              </div>
            </div>
          </div>

          {/* Trend Charts */}
          <div className="card p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-primary" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-text-primary">Kehitys</h2>
              </div>
              
              {/* Period selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleChartPeriodChange('daily')}
                  className={`btn ${chartPeriod === 'daily' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
                >
                  30 päivää
                </button>
                <button
                  onClick={() => handleChartPeriodChange('weekly')}
                  className={`btn ${chartPeriod === 'weekly' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
                >
                  Viikot
                </button>
              </div>
            </div>

            {chartData.length > 0 ? (
              <>
                {/* SpO2 Chart */}
                <div className="mb-12">
                  <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-success" />
                    Happisaturaation Kehitys
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey={chartPeriod === 'daily' ? 'dateLabel' : 'weekLabel'}
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                      />
                      <YAxis 
                        domain={[90, 100]}
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                        label={{ value: 'SpO2 (%)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="spo2" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        fill="url(#colorSpo2)" 
                        name="SpO2 (%)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Heart Rate Chart */}
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-error" />
                    Sykkeen Kehitys
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey={chartPeriod === 'daily' ? 'dateLabel' : 'weekLabel'}
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                      />
                      <YAxis 
                        domain={[60, 90]}
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                        label={{ value: 'Syke (bpm)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '8px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="heartRate" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Syke (bpm)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                <p className="text-xl text-text-secondary">
                  Ei tarpeeksi mittauksia kaavioiden näyttämiseen
                </p>
              </div>
            )}
          </div>

          {/* PDF Export - Coming Soon */}
          <div className="card p-8 bg-blue-50 border-2 border-primary text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" strokeWidth={2} />
            <h3 className="text-xl font-bold text-text-primary mb-2">Tulossa pian</h3>
            <p className="text-text-secondary">
              PDF-raportit ja pidemmän aikavälin kehitysanalyysit
            </p>
          </div>
          </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
