import Head from 'next/head'
import Link from 'next/link'
import { Activity, TrendingUp, Heart, BarChart3, Calendar, Download, Printer, FileDown, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { generateDailyChartData, generateWeeklyChartData } from '@/lib/demoData'
import { openPrintView, downloadCSV, downloadJSON, formatStatisticsForExport, printCurrentPage } from '@/lib/exportUtils'

type TimeRange = '7days' | '30days' | '3months' | 'custom'

// Default SpO2 warning threshold (can be made configurable later)
const DEFAULT_SPO2_THRESHOLD = 90

export default function Statistics() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { isDemoMode, demoMeasurements, demoStats, exitDemoMode } = useDemo()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('30days')
  const [chartData, setChartData] = useState<any[]>([])
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Helper function to filter data by date range
  const filterDataByRange = (data: any[], range: TimeRange, startDate?: string, endDate?: string) => {
    const now = new Date()
    let cutoffDate = new Date()
    
    switch (range) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7)
        break
      case '30days':
        cutoffDate.setDate(now.getDate() - 30)
        break
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case 'custom':
        if (startDate && endDate) {
          return data.filter((item: any) => {
            const itemDate = new Date(item.measured_at * 1000)
            return itemDate >= new Date(startDate) && itemDate <= new Date(endDate + 'T23:59:59')
          })
        }
        return data
      default:
        cutoffDate.setDate(now.getDate() - 30)
    }
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.measured_at * 1000)
      return itemDate >= cutoffDate
    })
  }

  useEffect(() => {
    const fetchStatistics = async () => {
      if (isDemoMode) {
        // Use demo data - filter by time range
        const filteredMeasurements = filterDataByRange(demoMeasurements, timeRange, customStartDate, customEndDate)
        
        // Recalculate stats for filtered data
        if (filteredMeasurements.length > 0) {
          // Filter only daily measurements for stats calculation
          const dailyFiltered = filteredMeasurements.filter(m => m.type === 'daily')
          const spo2Values = dailyFiltered.map(m => m.spo2).filter(v => v !== undefined) as number[]
          const hrValues = dailyFiltered.map(m => m.heartRate).filter(v => v !== undefined) as number[]
          
          // Calculate 7-day and 30-day averages
          const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)
          const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
          
          const last7Days = dailyFiltered.filter(m => m.measured_at >= sevenDaysAgo)
          const last30Days = dailyFiltered.filter(m => m.measured_at >= thirtyDaysAgo)
          
          const spo2Last7 = last7Days.map(m => m.spo2).filter(v => v !== undefined) as number[]
          const hrLast7 = last7Days.map(m => m.heartRate).filter(v => v !== undefined) as number[]
          const spo2Last30 = last30Days.map(m => m.spo2).filter(v => v !== undefined) as number[]
          const hrLast30 = last30Days.map(m => m.heartRate).filter(v => v !== undefined) as number[]
          
          const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0
          
          // Calculate warning count (measurements below threshold)
          const warningCount = spo2Values.filter(v => v < DEFAULT_SPO2_THRESHOLD).length
          const warningPercentage = spo2Values.length > 0 ? Math.round((warningCount / spo2Values.length) * 100) : 0
          
          setStats({
            spo2: {
              current: dailyFiltered[0]?.spo2 || 0,
              average7days: avg(spo2Last7),
              average30days: avg(spo2Last30),
              min: spo2Values.length > 0 ? Math.min(...spo2Values) : 0,
              max: spo2Values.length > 0 ? Math.max(...spo2Values) : 0,
            },
            heartRate: {
              current: dailyFiltered[0]?.heartRate || 0,
              average7days: avg(hrLast7),
              average30days: avg(hrLast30),
              min: hrValues.length > 0 ? Math.min(...hrValues) : 0,
              max: hrValues.length > 0 ? Math.max(...hrValues) : 0,
            },
            totalMeasurements: dailyFiltered.length,
            exerciseSessions: filteredMeasurements.filter(m => m.type === 'exercise').length,
            warningCount,
            warningPercentage,
            warningThreshold: DEFAULT_SPO2_THRESHOLD,
          })
          
          // Generate chart data grouped by date
          const groupedByDate: { [date: string]: { spo2: number[], heartRate: number[] } } = {}
          dailyFiltered.forEach(m => {
            if (!groupedByDate[m.date]) {
              groupedByDate[m.date] = { spo2: [], heartRate: [] }
            }
            if (m.spo2) groupedByDate[m.date].spo2.push(m.spo2)
            if (m.heartRate) groupedByDate[m.date].heartRate.push(m.heartRate)
          })
          
          const chartData = Object.keys(groupedByDate)
            .sort()
            .map(date => {
              const data = groupedByDate[date]
              const avgSpo2 = data.spo2.reduce((a, b) => a + b, 0) / data.spo2.length
              const avgHR = data.heartRate.reduce((a, b) => a + b, 0) / data.heartRate.length
              
              return {
                date,
                dateLabel: new Date(date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
                spo2: Math.round(avgSpo2 * 10) / 10,
                heartRate: Math.round(avgHR)
              }
            })
          
          setChartData(chartData)
        } else {
          setStats(demoStats)
          setChartData([])
        }
        
        setLoading(false)
        return
      }

      // Wait for auth to be ready before making API calls
      if (authLoading || !user) return;

      try {
        const [weeklyStats, dailyStats, dailyData, exerciseData] = await Promise.all([
          apiClient.getWeeklyStats(),
          apiClient.getDailyStats(90), // Get 90 days to support 3 months
          apiClient.getDailyMeasurements(),
          apiClient.getExerciseMeasurements()
        ])

        console.log('Statistics Debug:', {
          weeklyStats,
          dailyStatsCount: dailyStats?.length,
          dailyStatsFirst: dailyStats?.[0],
          dailyDataCount: dailyData?.length,
          exerciseDataCount: exerciseData?.length
        })

        // Filter daily stats based on time range
        let filteredDailyStats = dailyStats || []
        if (timeRange === '7days') {
          filteredDailyStats = dailyStats.slice(0, 7)
        } else if (timeRange === '30days') {
          filteredDailyStats = dailyStats.slice(0, 30)
        } else if (timeRange === '3months') {
          filteredDailyStats = dailyStats.slice(0, 90)
        } else if (timeRange === 'custom' && customStartDate && customEndDate) {
          const start = new Date(customStartDate).getTime()
          const end = new Date(customEndDate + 'T23:59:59').getTime()
          filteredDailyStats = dailyStats.filter((day: any) => {
            const dayTime = new Date(day.date).getTime()
            return dayTime >= start && dayTime <= end
          })
        }

        // Calculate stats from filtered data
        const avgSpo2 = filteredDailyStats.length > 0
          ? Math.round(filteredDailyStats.reduce((sum: any, s: any) => sum + s.avg_spo2, 0) / filteredDailyStats.length)
          : 0
        const avgHR = filteredDailyStats.length > 0
          ? Math.round(filteredDailyStats.reduce((sum: any, s: any) => sum + s.avg_heart_rate, 0) / filteredDailyStats.length)
          : 0

        // Get latest measurement from daily data
        const latestDaily = dailyData.length > 0 ? dailyData[0] : null

        // Calculate warning count from daily data
        const warningCount = dailyData.filter((m: any) => m.spo2 < DEFAULT_SPO2_THRESHOLD).length
        const warningPercentage = dailyData.length > 0 ? Math.round((warningCount / dailyData.length) * 100) : 0

        setStats({
          spo2: {
            current: latestDaily?.spo2 || 0,
            average7days: weeklyStats.avg_spo2 ? Math.round(weeklyStats.avg_spo2) : 0,
            average30days: avgSpo2,
            min: weeklyStats.min_spo2 || 0,
            max: weeklyStats.max_spo2 || 0,
          },
          heartRate: {
            current: latestDaily?.heart_rate || 0,
            average7days: weeklyStats.avg_heart_rate ? Math.round(weeklyStats.avg_heart_rate) : 0,
            average30days: avgHR,
            min: weeklyStats.min_heart_rate || 0,
            max: weeklyStats.max_heart_rate || 0,
          },
          totalMeasurements: dailyData.length,
          exerciseSessions: exerciseData.length,
          warningCount,
          warningPercentage,
          warningThreshold: DEFAULT_SPO2_THRESHOLD,
        })

        // Generate chart data from filtered daily stats
        const formattedChartData = filteredDailyStats.map((day: any) => ({
          date: new Date(day.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
          dateLabel: new Date(day.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
          spo2: Math.round(day.avg_spo2 * 10) / 10,
          heartRate: Math.round(day.avg_heart_rate)
        }))
        
        console.log('Chart Data Generated:', {
          filteredCount: filteredDailyStats.length,
          chartDataCount: formattedChartData.length,
          firstChartPoint: formattedChartData[0],
          lastChartPoint: formattedChartData[formattedChartData.length - 1]
        })
        
        setChartData(formattedChartData)
      } catch (error) {
        console.error('Failed to fetch statistics:', error)
        // Set empty stats on error
        setStats({
          spo2: { current: 0, average7days: 0, average30days: 0, min: 0, max: 0 },
          heartRate: { current: 0, average7days: 0, average30days: 0, min: 0, max: 0 },
          totalMeasurements: 0,
          exerciseSessions: 0,
          warningCount: 0,
          warningPercentage: 0,
          warningThreshold: DEFAULT_SPO2_THRESHOLD,
        })
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [isDemoMode, demoMeasurements, demoStats, timeRange, customStartDate, customEndDate, authLoading, user])

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
    if (range === 'custom') {
      setShowCustomDatePicker(true)
      // Set default dates if not set
      if (!customEndDate) {
        const today = new Date().toISOString().split('T')[0]
        setCustomEndDate(today)
      }
      if (!customStartDate) {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        setCustomStartDate(thirtyDaysAgo.toISOString().split('T')[0])
      }
    } else {
      setShowCustomDatePicker(false)
    }
  }

  // Apply custom date range
  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setShowCustomDatePicker(false)
      // Trigger re-fetch by updating state
      setTimeRange('custom')
    }
  }

  // Export functions
  const handleExportCSV = () => {
    const timeRangeText = 
      timeRange === '7days' ? '7 päivää' :
      timeRange === '30days' ? '30 päivää' :
      timeRange === '3months' ? '3 kuukautta' :
      `${customStartDate} - ${customEndDate}`
    
    const exportData = formatStatisticsForExport(stats, timeRangeText)
    const chartDataForExport = chartData.map(item => ({
      Päivämäärä: item.dateLabel,
      'SpO2 (%)': item.spo2,
      'Syke (bpm)': item.heartRate
    }))
    
    // Export summary
    downloadCSV(
      [exportData], 
      `hapetus-tilastot-yhteenveto-${new Date().toISOString().split('T')[0]}.csv`,
      Object.keys(exportData)
    )
    
    // Export chart data
    setTimeout(() => {
      downloadCSV(
        chartDataForExport,
        `hapetus-tilastot-kaavio-${new Date().toISOString().split('T')[0]}.csv`,
        ['Päivämäärä', 'SpO2 (%)', 'Syke (bpm)']
      )
    }, 500)
  }

  const handleExportJSON = () => {
    const timeRangeText = 
      timeRange === '7days' ? '7 päivää' :
      timeRange === '30days' ? '30 päivää' :
      timeRange === '3months' ? '3 kuukautta' :
      `${customStartDate} - ${customEndDate}`
    
    const exportData = {
      exported: new Date().toISOString(),
      timeRange: timeRangeText,
      summary: stats,
      chartData: chartData
    }
    
    downloadJSON(
      exportData,
      `hapetus-tilastot-${new Date().toISOString().split('T')[0]}.json`
    )
  }

  const handlePrint = () => {
    // Use native browser print to print the page with all charts and styling
    printCurrentPage()
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Tilastot - Hapetus</title>
      </Head>

      <main className="min-h-screen bg-background">
        {/* Print-only header */}
        <div className="hidden print-header">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
            <span className="text-3xl font-bold text-primary">Hapetus</span>
          </div>
          <h1 className="text-2xl font-bold mt-4">Terveystilastot - Raportti</h1>
          <div className="print-date">
            Tulostettu: {new Date().toLocaleString('fi-FI')}
          </div>
          {isDemoMode && (
            <div className="print-date">
              <strong>Demo-tila</strong> - Esimerkkidata
            </div>
          )}
        </div>

        {/* Header */}
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-border shadow-elevation-1 no-print">
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
                <Link href="/dashboard" className="text-lg text-text-secondary hover:text-primary transition-colors">
                  Etusivu
                </Link>
                <Link href="/history" className="text-lg text-text-secondary hover:text-primary transition-colors">
                  Historia
                </Link>
                <Link href="/statistics" className="text-lg font-semibold text-primary">
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
                  <Link
                    href="/dashboard"
                    className="text-lg text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Etusivu
                  </Link>
                  <Link
                    href="/history"
                    className="text-lg text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Historia
                  </Link>
                  <Link
                    href="/statistics"
                    className="text-lg font-semibold text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tilastot
                  </Link>
                  <div className="pt-4 mt-4 border-t border-border">
                    <p className="text-sm text-text-secondary mb-2">
                      {isDemoMode ? 'Demo-tila' : 'Kirjautunut'}
                    </p>
                    <p className="font-semibold text-text-primary mb-4">
                      {isDemoMode ? 'Demo' : (user?.displayName || 'Käyttäjä')}
                    </p>
                    {isDemoMode ? (
                      <button
                        onClick={() => { exitDemoMode(); window.location.href = '/' }}
                        className="btn btn-secondary w-full justify-center"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Poistu demosta</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => signOut()}
                        className="btn btn-secondary w-full justify-center"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Kirjaudu ulos</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Page Title */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-h1 font-bold text-text-primary mb-2">Tilastot ja raportit</h1>
                <p className="text-xl text-text-secondary">Yhteenveto terveystiedoistasi</p>
              </div>
              
              {/* Export Buttons */}
              {stats && stats.totalMeasurements > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="btn btn-secondary text-base py-3 px-5 min-h-[48px] flex items-center justify-center gap-2"
                    title="Tulosta raportti"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Tulosta</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="btn btn-secondary text-base py-3 px-5 min-h-[48px] flex items-center justify-center gap-2"
                    title="Lataa CSV"
                  >
                    <FileDown className="w-5 h-5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="btn btn-secondary text-base py-3 px-5 min-h-[48px] flex items-center justify-center gap-2"
                    title="Lataa JSON"
                  >
                    <Download className="w-5 h-5" />
                    <span>JSON</span>
                  </button>
                </div>
              )}
            </div>
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

          {/* Warning Statistics */}
          {stats.warningCount !== undefined && (
            <div className={`card p-8 mb-12 ${stats.warningCount > 0 ? 'border-2 border-yellow-500' : ''}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                  stats.warningCount > 0 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <Activity className={`w-8 h-8 ${
                    stats.warningCount > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Varoitusmittaukset</h2>
                  <p className="text-text-secondary text-sm mt-1">
                    SpO2 alle {stats.warningThreshold}%
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-surface rounded-xl">
                  <p className="text-text-secondary mb-2">Varoitusmittauksia</p>
                  <p className={`text-4xl font-bold ${
                    stats.warningCount > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {stats.warningCount}
                  </p>
                </div>
                <div className="p-6 bg-surface rounded-xl">
                  <p className="text-text-secondary mb-2">Osuus mittauksista</p>
                  <p className={`text-4xl font-bold ${
                    stats.warningPercentage > 20 ? 'text-red-600' : 
                    stats.warningPercentage > 10 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {stats.warningPercentage}%
                  </p>
                </div>
              </div>
              
              {stats.warningCount > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Huomio:</strong> Sinulla on {stats.warningCount} mittausta, joissa happisaturaatio 
                    on ollut alle {stats.warningThreshold}%. Jos matalia arvoja esiintyy usein, 
                    ota yhteyttä terveydenhuollon ammattilaiseen.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Trend Charts */}
          <div className="card p-8 mb-12">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary">Kehitys</h2>
                </div>
              </div>
              
              {/* Time range selector */}
              <div className="flex flex-wrap gap-2 mb-4 no-print">
                <button
                  onClick={() => handleTimeRangeChange('7days')}
                  className={`btn text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 ${timeRange === '7days' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
                >
                  7 päivää
                </button>
                <button
                  onClick={() => handleTimeRangeChange('30days')}
                  className={`btn text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 ${timeRange === '30days' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
                >
                  30 päivää
                </button>
                <button
                  onClick={() => handleTimeRangeChange('3months')}
                  className={`btn text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 ${timeRange === '3months' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
                >
                  3 kuukautta
                </button>
                <button
                  onClick={() => handleTimeRangeChange('custom')}
                  className={`btn text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3 ${timeRange === 'custom' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'} flex items-center gap-1 sm:gap-2`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden xs:inline">Valitse aikaväli</span>
                  <span className="xs:hidden">Aikaväli</span>
                </button>
              </div>

              {/* Custom date picker */}
              {showCustomDatePicker && (
                <div className="bg-surface p-4 rounded-xl border-2 border-primary mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Alkupäivä
                      </label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="input w-full max-w-full"
                        max={customEndDate || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="w-full sm:flex-1 sm:min-w-[200px] sm:max-w-[250px]">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Loppupäivä
                      </label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="input w-full max-w-full"
                        min={customStartDate}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <button
                      onClick={applyCustomDateRange}
                      disabled={!customStartDate || !customEndDate}
                      className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      Näytä
                    </button>
                  </div>
                </div>
              )}

              {/* Display current range info */}
              <p className="text-sm text-text-secondary">
                {timeRange === '7days' && 'Näytetään viimeisten 7 päivän mittaukset'}
                {timeRange === '30days' && 'Näytetään viimeisten 30 päivän mittaukset'}
                {timeRange === '3months' && 'Näytetään viimeisten 3 kuukauden mittaukset'}
                {timeRange === 'custom' && customStartDate && customEndDate && 
                  `Näytetään mittaukset ${new Date(customStartDate).toLocaleDateString('fi-FI')} - ${new Date(customEndDate).toLocaleDateString('fi-FI')}`}
              </p>
            </div>

            {chartData.length > 0 ? (
              <>
                {/* Info message for limited data */}
                {chartData.length < 3 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Vinkki:</strong> Lisää mittauksia useammalta päivältä nähdäksesi kehitystrendin paremmin. 
                      Tällä hetkellä näytetään vain {chartData.length} päivän tiedot.
                    </p>
                  </div>
                )}
                
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
                        dataKey="dateLabel"
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                      />
                      <YAxis 
                        domain={chartData.length === 1 ? ['auto', 'auto'] : [90, 100]}
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
                        dot={chartData.length <= 3 ? { fill: '#10b981', strokeWidth: 2, r: 6 } : false}
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
                        dataKey="dateLabel"
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                      />
                      <YAxis 
                        domain={chartData.length === 1 ? ['auto', 'auto'] : [60, 90]}
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
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: chartData.length <= 3 ? 6 : 4 }}
                        activeDot={{ r: 8 }}
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
          </>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
