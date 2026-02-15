import Head from 'next/head'
import Link from 'next/link'
import { Activity, ArrowLeft, Save, User, Trash2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { apiClient } from '@/lib/api'

export default function Settings() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [formData, setFormData] = useState({
    spo2_low_threshold: 90,
    large_font_enabled: false,
    manual_entry_enabled: false,
    gender: '' as '' | 'male' | 'female' | 'other',
    birth_year: '',
  })

  useEffect(() => {
    // Wait for auth to be ready and user to be authenticated
    if (authLoading || !user) return;
    
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const settings = await apiClient.getUserSettings()
        setFormData({
          spo2_low_threshold: settings.spo2_low_threshold || 90,
          large_font_enabled: settings.large_font_enabled || false,
          manual_entry_enabled: settings.manual_entry_enabled || false,
          gender: settings.gender || '',
          birth_year: settings.birth_year?.toString() || '',
        })
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [authLoading, user])

  const calculateAge = () => {
    if (!formData.birth_year) return null
    const year = parseInt(formData.birth_year)
    return new Date().getFullYear() - year
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const threshold = formData.spo2_low_threshold
    if (threshold < 70 || threshold > 95) {
      setError('SpO2-raja-arvon tulee olla 70-95% välillä')
      return
    }

    if (formData.birth_year) {
      const year = parseInt(formData.birth_year)
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        setError('Tarkista syntymävuosi (1900 - ' + new Date().getFullYear() + ')')
        return
      }
    }

    setSaving(true)
    setError(null)

    try {
      const settingsPayload = {
        spo2_low_threshold: threshold,
        large_font_enabled: formData.large_font_enabled,
        manual_entry_enabled: formData.manual_entry_enabled,
        gender: formData.gender || undefined,
        birth_year: formData.birth_year ? parseInt(formData.birth_year) : undefined,
      };
      
      await apiClient.updateUserSettings(settingsPayload);

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      console.error('❌ Failed to save settings:', err)
      setError(err.message || 'Asetusten tallennus epäonnistui. Yritä uudelleen.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAllData = async () => {
    if (deleteConfirmText !== 'POISTA') {
      setError('Kirjoita "POISTA" vahvistaaksesi')
      return
    }

    setDeleting(true)
    setError(null)

    try {
      await apiClient.deleteAllUserData()
      
      // Sign out after deletion
      await signOut()
      
      // Redirect to homepage with message
      router.push('/?deleted=true')
    } catch (err: any) {
      console.error('❌ Failed to delete data:', err)
      setError(err.message || 'Tietojen poisto epäonnistui. Yritä uudelleen.')
      setDeleting(false)
    }
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'male': return 'Mies'
      case 'female': return 'Nainen'
      case 'other': return 'Muu'
      default: return ''
    }
  }

  return (
    <ProtectedRoute>
      <Head>
        <title>Asetukset - Hapetus</title>
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
            <h1 className="text-h1 font-bold text-text-primary mb-2">Asetukset</h1>
            <p className="text-xl text-text-secondary">Muokkaa sovelluksen asetuksia</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="card bg-green-50 border-2 border-success p-6 mb-8 animate-fade-in">
              <p className="text-success font-bold text-xl text-center">
                ✓ Asetukset tallennettu onnistuneesti!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="card bg-red-50 border-2 border-error p-6 mb-8">
              <p className="text-error font-bold text-xl text-center">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="card p-8 text-center">
              <p className="text-xl text-text-secondary">Ladataan asetuksia...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* User Information Card */}
              <div className="card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold text-text-primary">Käyttäjätiedot</h2>
                </div>
                
                <div className="space-y-2 mb-6">
                  <p className="text-lg text-text-secondary">
                    <span className="font-semibold">Nimi:</span> {user?.displayName || 'Ei asetettu'}
                  </p>
                  <p className="text-lg text-text-secondary">
                    <span className="font-semibold">Sähköposti:</span> {user?.email}
                  </p>
                </div>
              </div>

              {/* Henkilötiedot Card */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Henkilötiedot</h2>
                <p className="text-base text-text-secondary mb-6">
                  Tiedot auttavat antamaan ikä- ja sukupuolikohtaisia suosituksia verenpaineelle
                </p>

                <div className="space-y-6">
                  {/* Gender Selection */}
                  <div>
                    <label htmlFor="gender" className="block text-lg font-semibold text-text-primary mb-3">
                      Sukupuoli (valinnainen)
                    </label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="input w-full"
                    >
                      <option value="">Ei valittu</option>
                      <option value="male">Mies</option>
                      <option value="female">Nainen</option>
                      <option value="other">Muu</option>
                    </select>
                    <p className="mt-2 text-sm text-text-secondary">
                      Sukupuoli auttaa antamaan tarkempia suosituksia verenpaineelle
                    </p>
                  </div>

                  {/* Birth Year */}
                  <div>
                    <label htmlFor="birth_year" className="block text-lg font-semibold text-text-primary mb-3">
                      Syntymävuosi (valinnainen)
                    </label>
                    <input
                      type="number"
                      id="birth_year"
                      value={formData.birth_year}
                      onChange={(e) => setFormData({ ...formData, birth_year: e.target.value })}
                      placeholder="esim. 1960"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="input w-full"
                    />
                    {formData.birth_year && (
                      <p className="mt-2 text-sm text-primary font-semibold">
                        Ikä: {calculateAge()} vuotta
                      </p>
                    )}
                    <p className="mt-2 text-sm text-text-secondary">
                      Ikä auttaa antamaan ikäkohtaisia suosituksia verenpaineelle
                    </p>
                  </div>

                  {/* Demographics Info */}
                  {(formData.gender || formData.birth_year) && (
                    <div className="bg-blue-50 border-l-4 border-primary p-4 mt-4">
                      <p className="text-sm text-text-primary">
                        <strong>ℹ️ Huomio:</strong> Henkilötietojasi käytetään ainoastaan terveyssuositusten 
                        personointiin. Tietoja ei jaeta kolmansille osapuolille.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Alerts Card */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Hälytykset</h2>
                
                <div>
                  <label htmlFor="spo2_threshold" className="block text-lg font-semibold text-text-primary mb-3">
                    Matalan SpO2:n raja-arvo
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      id="spo2_threshold"
                      value={formData.spo2_low_threshold}
                      onChange={(e) => setFormData({ ...formData, spo2_low_threshold: parseInt(e.target.value) || 90 })}
                      min="70"
                      max="95"
                      className="input w-32"
                      required
                    />
                    <span className="text-xl text-text-secondary">%</span>
                  </div>
                  <p className="mt-2 text-base text-text-secondary">
                    Raja-arvo: 70-95%. Suositellaan: 90%
                  </p>
                </div>
              </div>

              {/* Display Card */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Näyttö ja syöttö</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-text-primary">Suuri fontti</p>
                      <p className="text-base text-text-secondary">Käytä suurempaa tekstikokoa</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.large_font_enabled}
                        onChange={(e) => setFormData({ ...formData, large_font_enabled: e.target.checked })}
                        className="sr-only peer"
                        aria-label="Suuri fontti"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-text-primary">Manuaalinen syöttö</p>
                      <p className="text-base text-text-secondary">Valitse päivämäärä ja aika manuaalisesti</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.manual_entry_enabled}
                        onChange={(e) => setFormData({ ...formData, manual_entry_enabled: e.target.checked })}
                        className="sr-only peer"
                        aria-label="Manuaalinen syöttö"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary w-full text-xl py-4 flex items-center justify-center gap-3"
              >
                <Save className="w-6 h-6" />
                <span>{saving ? 'Tallennetaan...' : 'Tallenna asetukset'}</span>
              </button>
            </form>
          )}

          {/* Privacy and Data Deletion Section - Always visible when not loading */}
          {!loading && (
            <div className="mt-8 space-y-6">
              {/* Privacy Policy Link */}
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">Tietosuoja</h2>
                <p className="text-base text-text-secondary mb-4">
                  Lue tietosuojaseloste saadaksesi tietoa siitä, miten käsittelemme henkilötietojasi.
                </p>
                <Link 
                  href="/privacy"
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  <User className="w-5 h-5" />
                  <span>Lue tietosuojaseloste</span>
                </Link>
              </div>

              {/* Delete All Data Section */}
              <div className="card p-8 border-2 border-red-200 bg-red-50">
                <div className="flex items-start gap-4 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-900 mb-2">Poista kaikki tiedot</h2>
                    <p className="text-base text-red-800 mb-4">
                      Tämä toiminto poistaa pysyvästi <strong>kaikki</strong> tietosi palvelusta:
                    </p>
                    <ul className="list-disc list-inside text-red-800 space-y-1 mb-4 ml-4">
                      <li>Kaikki mittaukset (SpO2, syke, verenpaine, liikunta)</li>
                      <li>Kaikki henkilökohtaiset asetukset</li>
                      <li>Käyttäjätilisi tiedot</li>
                    </ul>
                    <p className="text-base text-red-900 font-semibold">
                      ⚠️ Tätä toimintoa ei voi perua. Tiedot poistetaan lopullisesti.
                    </p>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn bg-red-600 hover:bg-red-700 text-white w-full text-xl py-4 flex items-center justify-center gap-3"
                  >
                    <Trash2 className="w-6 h-6" />
                    <span>Poista kaikki tietoni</span>
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="confirmDelete" className="block text-base font-semibold text-red-900 mb-2">
                        Vahvista kirjoittamalla: <span className="font-mono bg-red-200 px-2 py-1 rounded">POISTA</span>
                      </label>
                      <input
                        id="confirmDelete"
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Kirjoita POISTA"
                        className="input w-full text-lg"
                        disabled={deleting}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmText('')
                          setError(null)
                        }}
                        disabled={deleting}
                        className="btn bg-gray-500 hover:bg-gray-600 text-white flex-1 py-3"
                      >
                        Peruuta
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteAllData}
                        disabled={deleting || deleteConfirmText !== 'POISTA'}
                        className="btn bg-red-600 hover:bg-red-700 text-white flex-1 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span>{deleting ? 'Poistetaan...' : 'Poista pysyvästi'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
