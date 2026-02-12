import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'
import { classifyBP } from '@/lib/bpGuidelines'

export default function AddBloodPressure() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userAge, setUserAge] = useState<number | null>(null)
  const [userGender, setUserGender] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  })

  // Load user settings for BP classification
  useEffect(() => {
    // Wait for auth to be ready and user to be authenticated
    if (loading || !user) return;
    
    const loadUserSettings = async () => {
      try {
        const settings = await apiClient.getUserSettings()
        if (settings.birth_year) {
          const age = new Date().getFullYear() - settings.birth_year
          setUserAge(age)
        }
        setUserGender(settings.gender || null)
      } catch (err) {
        console.error('Failed to load user settings:', err)
      }
    }
    loadUserSettings()
  }, [loading, user])

  // Calculate BP classification
  const bpClassification = formData.systolic && formData.diastolic && userAge !== null
    ? classifyBP(
        parseInt(formData.systolic),
        parseInt(formData.diastolic),
        userAge,
        (userGender as 'male' | 'female' | 'other') || 'other'
      )
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const systolicValue = parseInt(formData.systolic)
    const diastolicValue = parseInt(formData.diastolic)

    if (!systolicValue || systolicValue < 80 || systolicValue > 200) {
      setError('Yläpaineen tulee olla 80-200 mmHg välillä')
      return
    }

    if (!diastolicValue || diastolicValue < 50 || diastolicValue > 130) {
      setError('Alapaineen tulee olla 50-130 mmHg välillä')
      return
    }

    if (systolicValue <= diastolicValue) {
      setError('Yläpaineen tulee olla suurempi kuin alapaineen')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create timestamp from date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`)
      const measured_at = Math.floor(dateTime.getTime() / 1000) // Unix timestamp in seconds
      
      // Save to backend API - BP only, no SpO2/HR (undefined means not measured)
      await apiClient.createDailyMeasurement({
        systolic: systolicValue,
        diastolic: diastolicValue,
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
        <title>Lisää verenpainemittaus - Hapetus</title>
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
            <h1 className="text-h1 font-bold text-text-primary mb-2">Verenpainemittaus</h1>
            <p className="text-xl text-text-secondary">Seuraa verenpaineesi kehitystä säännöllisesti</p>
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

              {/* Blood Pressure */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="systolic" className="block text-lg font-semibold text-text-primary mb-3">
                    Yläpaine (mmHg)
                  </label>
                  <input
                    type="number"
                    id="systolic"
                    min="80"
                    max="200"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="120"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="diastolic" className="block text-lg font-semibold text-text-primary mb-3">
                    Alapaine (mmHg)
                  </label>
                  <input
                    type="number"
                    id="diastolic"
                    min="50"
                    max="130"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    className="input w-full text-3xl font-bold"
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              {/* BP Status Indicator */}
              {bpClassification && (
                <div
                  className="card p-6 border-2"
                  style={{ 
                    backgroundColor: bpClassification.color + '20', 
                    borderColor: bpClassification.color
                  }}
                >
                  <p 
                    className="text-lg font-semibold" 
                    style={{ color: bpClassification.color }}
                  >
                    {bpClassification.message}
                  </p>
                  {userAge && (
                    <p className="text-text-secondary mt-2">
                      Arvio perustuu ikääsi ({userAge} v) ja nykyisiin terveyssuosituksiin
                    </p>
                  )}
                </div>
              )}

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
                  placeholder="Esim. Aamulla ennen lääkettä, levossa..."
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
