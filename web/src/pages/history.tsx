import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, Calendar, Heart, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export default function History() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all') // all, daily, exercise
  const [measurements, setMeasurements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
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
  }, [])

  const filteredMeasurements = measurements.filter(m => 
    filter === 'all' || m.type === filter
  )

  return (
    <ProtectedRoute>
      <Head>
        <title>Historia - Hapetus</title>
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
          <div className="mb-8">
            <h1 className="text-h1 font-bold text-text-primary mb-2">Mittaushistoria</h1>
            <p className="text-xl text-text-secondary">Kaikki tallennetut mittaukset</p>
          </div>

          {/* Filters */}
          <div className="card p-6 mb-8">
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
                        {measurement.type === 'daily' ? 'Päivittäinen mittaus' : `Liikunta: ${measurement.exerciseType}`}
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
                </div>

                {measurement.type === 'daily' ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                      <Heart className="w-8 h-8 text-success" />
                      <div>
                        <div className="text-3xl font-bold text-text-primary">{measurement.spo2}%</div>
                        <div className="text-sm text-text-secondary">Happisaturaatio</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                      <Activity className="w-8 h-8 text-error" />
                      <div>
                        <div className="text-3xl font-bold text-text-primary">{measurement.heartRate}</div>
                        <div className="text-sm text-text-secondary">Syke (bpm)</div>
                      </div>
                    </div>
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
