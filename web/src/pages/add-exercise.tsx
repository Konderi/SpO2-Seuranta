import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'

export default function AddExercise() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    exerciseType: '',
    // Before exercise
    spo2Before: '',
    heartRateBefore: '',
    // After exercise
    spo2After: '',
    heartRateAfter: '',
    // Additional info
    duration: '',
    intensity: 'medium',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const spo2BeforeValue = parseInt(formData.spo2Before)
    const heartRateBeforeValue = parseInt(formData.heartRateBefore)
    const spo2AfterValue = parseInt(formData.spo2After)
    const heartRateAfterValue = parseInt(formData.heartRateAfter)

    if (!spo2BeforeValue || spo2BeforeValue < 50 || spo2BeforeValue > 100) {
      setError('Happisaturaation (ennen) tulee olla 50-100% välillä')
      return
    }

    if (!heartRateBeforeValue || heartRateBeforeValue < 30 || heartRateBeforeValue > 220) {
      setError('Sykkeen (ennen) tulee olla 30-220 välillä')
      return
    }

    if (!spo2AfterValue || spo2AfterValue < 50 || spo2AfterValue > 100) {
      setError('Happisaturaation (jälkeen) tulee olla 50-100% välillä')
      return
    }

    if (!heartRateAfterValue || heartRateAfterValue < 30 || heartRateAfterValue > 220) {
      setError('Sykkeen (jälkeen) tulee olla 30-220 välillä')
      return
    }

    if (!formData.exerciseType) {
      setError('Valitse liikuntalaji')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create timestamp from date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      const measured_at = Math.floor(dateTime.getTime() / 1000) // Unix timestamp in seconds
      
      // Save to backend API - Compatible with Android/iOS format
      await apiClient.createExerciseMeasurement({
        exercise_type: formData.exerciseType,
        exercise_duration: formData.duration ? parseInt(formData.duration) : undefined,
        spo2_before: spo2BeforeValue,
        heart_rate_before: heartRateBeforeValue,
        spo2_after: spo2AfterValue,
        heart_rate_after: heartRateAfterValue,
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
      console.error('Failed to save exercise measurement:', err)
      setError(err.message || 'Mittauksen tallennus epäonnistui. Yritä uudelleen.')
      setSaving(false)
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Lisää liikuntamittaus - Hapetus</title>
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
            <h1 className="text-h1 font-bold text-text-primary mb-2">Liikuntamittaus</h1>
            <p className="text-xl text-text-secondary">Mittaa arvot ennen ja jälkeen liikunnan</p>
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date and Time */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Ajankohta</h2>
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
            </div>

            {/* Exercise Details */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Liikunnan tiedot</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="exerciseType" className="block text-lg font-semibold text-text-primary mb-3">
                    Liikuntalaji
                  </label>
                  <select
                    id="exerciseType"
                    value={formData.exerciseType}
                    onChange={(e) => setFormData({ ...formData, exerciseType: e.target.value })}
                    className="input w-full"
                    required
                  >
                    <option value="">Valitse laji...</option>
                    <option value="walking">Kävely</option>
                    <option value="nordic_walking">Sauvakävely</option>
                    <option value="jogging">Hölkkä</option>
                    <option value="cycling">Pyöräily</option>
                    <option value="swimming">Uinti</option>
                    <option value="gym">Kuntosali</option>
                    <option value="other">Muu</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="duration" className="block text-lg font-semibold text-text-primary mb-3">
                      Kesto (minuuttia)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      min="1"
                      max="300"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="input w-full"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label htmlFor="intensity" className="block text-lg font-semibold text-text-primary mb-3">
                      Intensiteetti
                    </label>
                    <select
                      id="intensity"
                      value={formData.intensity}
                      onChange={(e) => setFormData({ ...formData, intensity: e.target.value })}
                      className="input w-full"
                    >
                      <option value="light">Kevyt</option>
                      <option value="medium">Kohtalainen</option>
                      <option value="hard">Raskas</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Before Exercise */}
            <div className="card p-8 bg-blue-50 border-2 border-primary">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Ennen liikuntaa</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="spo2Before" className="block text-lg font-semibold text-text-primary mb-3">
                    Happisaturaatio (SpO2) %
                  </label>
                  <input
                    type="number"
                    id="spo2Before"
                    min="50"
                    max="100"
                    value={formData.spo2Before}
                    onChange={(e) => setFormData({ ...formData, spo2Before: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="96"
                    required
                  />
                  <p className="text-text-secondary mt-2">Normaali arvo: 95-100%</p>
                </div>

                <div>
                  <label htmlFor="heartRateBefore" className="block text-lg font-semibold text-text-primary mb-3">
                    Syke (bpm)
                  </label>
                  <input
                    type="number"
                    id="heartRateBefore"
                    min="30"
                    max="220"
                    value={formData.heartRateBefore}
                    onChange={(e) => setFormData({ ...formData, heartRateBefore: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="72"
                    required
                  />
                  <p className="text-text-secondary mt-2">Normaali arvo: 60-100 bpm</p>
                </div>
              </div>
            </div>

            {/* After Exercise */}
            <div className="card p-8 bg-green-50 border-2 border-success">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Liikunnan jälkeen</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="spo2After" className="block text-lg font-semibold text-text-primary mb-3">
                    Happisaturaatio (SpO2) %
                  </label>
                  <input
                    type="number"
                    id="spo2After"
                    min="50"
                    max="100"
                    value={formData.spo2After}
                    onChange={(e) => setFormData({ ...formData, spo2After: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="94"
                    required
                  />
                  <p className="text-text-secondary mt-2">Normaali arvo: 95-100%</p>
                </div>

                <div>
                  <label htmlFor="heartRateAfter" className="block text-lg font-semibold text-text-primary mb-3">
                    Syke (bpm)
                  </label>
                  <input
                    type="number"
                    id="heartRateAfter"
                    min="30"
                    max="220"
                    value={formData.heartRateAfter}
                    onChange={(e) => setFormData({ ...formData, heartRateAfter: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="98"
                    required
                  />
                  <p className="text-text-secondary mt-2">Tavoite: Alle 85% maksimista</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="card p-8">
              <label htmlFor="notes" className="block text-lg font-semibold text-text-primary mb-3">
                Muistiinpanot (valinnainen)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input w-full min-h-32"
                placeholder="Esim. Liikunta tuntui hyvältä, ei hengenahdistusta..."
                rows={4}
              />
            </div>

            {/* Submit Buttons */}
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
          </form>
        </div>
      </main>
    </ProtectedRoute>
  )
}
