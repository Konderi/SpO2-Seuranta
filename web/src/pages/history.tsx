import Head from 'next/head'
import Link from 'next/link'
import { Activity, Calendar, Heart, TrendingUp, Printer, FileDown, Download, Menu, X, LogOut, Settings, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useDemo } from '@/contexts/DemoContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { openPrintView, downloadCSV, downloadJSON, formatMeasurementForExport, printCurrentPage } from '@/lib/exportUtils'

export default function History() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { isDemoMode, demoMeasurements, exitDemoMode } = useDemo()
  const [filter, setFilter] = useState('all') // all, daily, exercise
  const [measurements, setMeasurements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      if (isDemoMode) {
        // Use demo data
        setMeasurements(demoMeasurements)
        setLoading(false)
        return
      }

      // Wait for auth to be ready before making API calls
      if (authLoading || !user) return;

      try {
        const [dailyData, exerciseData] = await Promise.all([
          apiClient.getDailyMeasurements(),
          apiClient.getExerciseMeasurements()
        ])

        // Convert daily measurements to display format
        const dailyFormatted = dailyData.map((m: any) => {
          const date = new Date(m.measured_at * 1000)
          return {
            id: m.id,
            type: 'daily',
            date: date.toISOString().split('T')[0],
            time: date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
            spo2: m.spo2,
            heartRate: m.heart_rate,
            systolic: m.systolic,
            diastolic: m.diastolic,
            notes: m.notes,
            measured_at: m.measured_at
          }
        })

        // Convert exercise measurements to display format
        const exerciseFormatted = exerciseData.map((m: any) => {
          const date = new Date(m.measured_at * 1000)
          return {
            id: m.id,
            type: 'exercise',
            date: date.toISOString().split('T')[0],
            time: date.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }),
            exerciseType: m.exercise_type,
            spo2Before: m.spo2_before,
            heartRateBefore: m.heart_rate_before,
            spo2After: m.spo2_after,
            heartRateAfter: m.heart_rate_after,
            duration: m.exercise_duration,
            notes: m.notes,
            measured_at: m.measured_at
          }
        })

        // Combine and sort by measured_at (newest first)
        const combined = [...dailyFormatted, ...exerciseFormatted].sort(
          (a, b) => b.measured_at - a.measured_at
        )

        setMeasurements(combined)
      } catch (error) {
        console.error('Failed to fetch history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [isDemoMode, demoMeasurements, authLoading, user])

  const filteredMeasurements = measurements.filter(m => 
    filter === 'all' || m.type === filter
  )

  // Delete measurement
  const handleDelete = async (measurementId: string, measurementType: 'daily' | 'exercise') => {
    if (!confirm('Haluatko varmasti poistaa tämän mittauksen? Tätä toimintoa ei voi perua.')) {
      return
    }

    if (isDemoMode) {
      alert('Demo-tilassa ei voi poistaa mittauksia. Kirjaudu sisään käyttääksesi tätä toimintoa.')
      return
    }

    try {
      // Call appropriate delete API
      if (measurementType === 'daily') {
        await apiClient.deleteDailyMeasurement(measurementId)
      } else {
        await apiClient.deleteExerciseMeasurement(measurementId)
      }

      // Remove from local state
      setMeasurements(prev => prev.filter(m => m.id !== measurementId))
    } catch (error) {
      console.error('Failed to delete measurement:', error)
      alert('Mittauksen poisto epäonnistui. Yritä uudelleen.')
    }
  }

  // Export functions
  const handleExportCSV = () => {
    const exportData = filteredMeasurements.map(m => formatMeasurementForExport(m))
    downloadCSV(
      exportData,
      `hapetus-historia-${new Date().toISOString().split('T')[0]}.csv`,
      Object.keys(exportData[0] || {})
    )
  }

  const handleExportJSON = () => {
    const exportData = {
      exported: new Date().toISOString(),
      filter: filter === 'all' ? 'Kaikki' : filter === 'daily' ? 'Päivittäiset' : 'Liikunta',
      totalMeasurements: filteredMeasurements.length,
      measurements: filteredMeasurements
    }
    downloadJSON(
      exportData,
      `hapetus-historia-${new Date().toISOString().split('T')[0]}.json`
    )
  }

  const handlePrint = () => {
    // Use native browser print to print the page with all measurements
    printCurrentPage()
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Historia - Hapetus</title>
      </Head>

      <main className="min-h-screen bg-background">
        {/* Print-only header */}
        <div className="hidden print-header">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
            <span className="text-3xl font-bold text-primary">Hapetus</span>
          </div>
          <h1 className="text-2xl font-bold mt-4">Mittaushistoria - Raportti</h1>
          <div className="print-date">
            Tulostettu: {new Date().toLocaleString('fi-FI')}
          </div>
          <div className="print-date">
            Suodatin: {filter === 'all' ? 'Kaikki mittaukset' : filter === 'daily' ? 'Päivittäiset mittaukset' : 'Liikuntamittaukset'}
          </div>
          <div className="print-date">
            Mittauksia yhteensä: {filteredMeasurements.length}
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
                <Link href="/history" className="text-lg font-semibold text-primary">
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
                  <Link
                    href="/dashboard"
                    className="text-lg text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Etusivu
                  </Link>
                  <Link
                    href="/history"
                    className="text-lg font-semibold text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Historia
                  </Link>
                  <Link
                    href="/statistics"
                    className="text-lg text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Tilastot
                  </Link>
                  <Link
                    href="/settings"
                    className="text-lg text-text-secondary hover:text-primary transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Asetukset
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
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-h1 font-bold text-text-primary mb-2">Mittaushistoria</h1>
                <p className="text-xl text-text-secondary">Kaikki tallennetut mittaukset</p>
              </div>
              
              {/* Export Buttons */}
              {filteredMeasurements.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="btn btn-secondary text-base py-3 px-5 min-h-[48px] flex items-center justify-center gap-2"
                    title="Tulosta lista"
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

          {/* Filters */}
          <div className="card p-6 mb-8 no-print">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`btn ${filter === 'all' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
              >
                Kaikki
              </button>
              <button
                onClick={() => setFilter('daily')}
                className={`btn ${filter === 'daily' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
              >
                Päivittäiset
              </button>
              <button
                onClick={() => setFilter('exercise')}
                className={`btn ${filter === 'exercise' ? 'bg-primary text-white hover:bg-primary-dark shadow-md' : 'btn-secondary'}`}
              >
                Liikunta
              </button>
            </div>
          </div>

          {/* Measurements List */}
          {loading ? (
            <div className="card p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4"></div>
              <p className="text-xl text-text-secondary">Ladataan historiaa...</p>
            </div>
          ) : filteredMeasurements.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-xl text-text-secondary mb-6">
                {filter === 'all' 
                  ? 'Ei mittauksia vielä. Aloita lisäämällä ensimmäinen mittaus!' 
                  : 'Ei mittauksia valitulla suodattimella'}
              </p>
              {filter === 'all' && (
                <Link href="/add-daily" className="btn btn-primary">
                  Lisää mittaus
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMeasurements.map((measurement) => (
              <div key={measurement.id} className="card p-6 hover:shadow-elevation-3 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {measurement.type === 'daily' ? (
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-success" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">
                        {measurement.type === 'daily' ? (
                          // Determine title based on what data exists
                          (measurement.spo2 || measurement.heartRate) && (measurement.systolic || measurement.diastolic)
                            ? 'SpO2 & Verenpaine'
                            : (measurement.systolic || measurement.diastolic)
                            ? 'Verenpaine'
                            : 'Päivittäinen mittaus'
                        ) : `Liikunta: ${measurement.exerciseType}`}
                      </h3>
                      <p className="text-text-secondary">
                        {new Date(measurement.date).toLocaleDateString('fi-FI', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} klo {measurement.time}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete button */}
                  {!isDemoMode && (
                    <button
                      onClick={() => handleDelete(measurement.id, measurement.type)}
                      className="btn btn-secondary p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Poista mittaus"
                      aria-label="Poista mittaus"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {measurement.type === 'daily' ? (
                  <div>
                    {/* Determine measurement type */}
                    {(measurement.spo2 || measurement.heartRate) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {measurement.spo2 && (
                          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                            <Heart className="w-8 h-8 text-success" />
                            <div>
                              <div className="text-3xl font-bold text-text-primary">{measurement.spo2}%</div>
                              <div className="text-sm text-text-secondary">Happisaturaatio</div>
                            </div>
                          </div>
                        )}
                        {measurement.heartRate && (
                          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                            <Activity className="w-8 h-8 text-error" />
                            <div>
                              <div className="text-3xl font-bold text-text-primary">{measurement.heartRate}</div>
                              <div className="text-sm text-text-secondary">Syke (bpm)</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Blood Pressure */}
                    {(measurement.systolic || measurement.diastolic) && (
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                        <div>
                          <div className="text-3xl font-bold text-text-primary">
                            {measurement.systolic}/{measurement.diastolic}
                          </div>
                          <div className="text-sm text-text-secondary">Verenpaine (mmHg)</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl border-2 border-primary">
                        <p className="text-sm font-semibold text-text-primary mb-2">Ennen</p>
                        <div className="flex gap-4">
                          <div>
                            <div className="text-2xl font-bold text-text-primary">{measurement.spo2Before}%</div>
                            <div className="text-xs text-text-secondary">SpO2</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-text-primary">{measurement.heartRateBefore}</div>
                            <div className="text-xs text-text-secondary">Syke</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl border-2 border-success">
                        <p className="text-sm font-semibold text-text-primary mb-2">Jälkeen</p>
                        <div className="flex gap-4">
                          <div>
                            <div className="text-2xl font-bold text-text-primary">{measurement.spo2After}%</div>
                            <div className="text-xs text-text-secondary">SpO2</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-text-primary">{measurement.heartRateAfter}</div>
                            <div className="text-xs text-text-secondary">Syke</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {measurement.duration && (
                      <p className="text-text-secondary">Kesto: {measurement.duration} min</p>
                    )}
                  </div>
                )}

                {measurement.notes && (
                  <div className="mt-4 p-4 bg-surface rounded-xl">
                    <p className="text-sm font-semibold text-text-primary mb-1">Muistiinpanot:</p>
                    <p className="text-text-secondary">{measurement.notes}</p>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
