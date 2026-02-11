import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'

export default function AddDaily() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    spo2: '',
    heartRate: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const spo2Value = parseInt(formData.spo2)
    const heartRateValue = parseInt(formData.heartRate)

    if (!spo2Value || spo2Value < 50 || spo2Value > 100) {
      setError('Happisaturaation tulee olla 50-100% välillä')
      return
    }

    if (!heartRateValue || heartRateValue < 30 || heartRateValue > 220) {
      setError('Sykkeen tulee olla 30-220 välillä')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create timestamp from date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      const measured_at = Math.floor(dateTime.getTime() / 1000) // Unix timestamp in seconds
      
      // Save to backend API - Compatible with Android/iOS format
      await apiClient.createDailyMeasurement({
        spo2: spo2Value,
        heart_rate: heartRateValue,
        notes: formData.notes,
        measured_at,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      console.error('Failed to save measurement:', err)
      setError(err.message || 'Mittauksen tallennus epäonnistui. Yritä uudelleen.')
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Lisää päivittäinen mittaus - Hapetus</title>
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

        <div className="max-w-3xl mx-auto px-4 py-12">
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
            <h1 className="text-h1 font-bold text-text-primary mb-2">Päivittäinen mittaus</h1>
            <p className="text-xl text-text-secondary">Tallenna happisaturaatio ja syke</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="card bg-green-50 border-2 border-success p-6 mb-8 animate-fade-in">
              <p className="text-success font-bold text-xl text-center">
                ✓ Mittaus tallennettu onnistuneesti!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="card bg-red-50 border-2 border-error p-6 mb-8">
              <p className="text-error font-bold text-xl text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="card p-8">
            <div className="space-y-8">
              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-lg font-semibold text-text-primary mb-3">
                    Päivämäärä
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-lg font-semibold text-text-primary mb-3">
                    Kellonaika
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              {/* SpO2 */}
              <div>
                <label htmlFor="spo2" className="block text-lg font-semibold text-text-primary mb-3">
                  Happisaturaatio (SpO2) %
                </label>
                <input
                  type="number"
                  id="spo2"
                  min="50"
                  max="100"
                  value={formData.spo2}
                  onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                  className="input w-full text-3xl font-bold"
                  placeholder="96"
                  required
                />
                <p className="text-text-secondary mt-2">Normaali arvo: 95-100%</p>
              </div>

              {/* Heart Rate */}
              <div>
                <label htmlFor="heartRate" className="block text-lg font-semibold text-text-primary mb-3">
                  Syke (bpm)
                </label>
                <input
                  type="number"
                  id="heartRate"
                  min="30"
                  max="220"
                  value={formData.heartRate}
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                  className="input w-full text-3xl font-bold"
                  placeholder="72"
                  required
                />
                <p className="text-text-secondary mt-2">Normaali arvo: 60-100 bpm</p>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-lg font-semibold text-text-primary mb-3">
                  Muistiinpanot (valinnainen)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input w-full min-h-32"
                  placeholder="Esim. Tunsin oloni hyväksi, ei oireita..."
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving || success}
                  className="btn btn-large btn-primary flex-1"
                >
                  {saving ? (
                    'Tallennetaan...'
                  ) : success ? (
                    '✓ Tallennettu'
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Tallenna mittaus
                    </>
                  )}
                </button>

                <Link
                  href="/dashboard"
                  className="btn btn-large btn-secondary"
                >
                  Peruuta
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>
    </ProtectedRoute>
  )
}
