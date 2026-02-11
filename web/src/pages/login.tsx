import Head from 'next/head'
import Link from 'next/link'
import { Activity } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Login() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if already logged in
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true)
      setError(null)
      await signInWithGoogle()
    } catch (err: any) {
      setSigningIn(false)
      setError('Kirjautuminen epäonnistui. Yritä uudelleen.')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-text-secondary">Ladataan...</p>
        </div>
      </div>
    )
  }

  // Don't show login page if already logged in
  if (user) {
    return null
  }

  return (
    <>
      <Head>
        <title>Kirjaudu sisään - Hapetus</title>
        <meta name="description" content="Kirjaudu Hapetus-palveluun Google-tililläsi" />
      </Head>

      <main className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <nav className="w-full bg-white border-b border-border shadow-elevation-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
                <span className="text-3xl font-bold text-primary">Hapetus</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full">
            <div className="card p-12 text-center">
              {/* Icon */}
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Activity className="w-12 h-12 text-primary" strokeWidth={2.5} />
              </div>

              {/* Heading */}
              <h1 className="text-h1 font-bold mb-4 text-text-primary">
                Tervetuloa takaisin
              </h1>
              <p className="text-xl text-text-secondary mb-12">
                Kirjaudu sisään jatkaaksesi terveyden seurantaa
              </p>

              {/* Error Message */}
              {error && (
                <div className="mb-8 p-4 bg-red-50 border-2 border-error rounded-lg">
                  <p className="text-error font-semibold">{error}</p>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="btn btn-large w-full bg-white border-2 border-border text-text-primary hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signingIn ? (
                  <span>Kirjaudutaan sisään...</span>
                ) : (
                  <>
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Kirjaudu Google-tilillä
                  </>
                )}
              </button>

              {/* Trust Signals */}
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-text-secondary mb-4">Miksi Google-kirjautuminen?</p>
                <ul className="text-left text-text-secondary space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-success text-xl">✓</span>
                    <span>Turvallinen ja nopea</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success text-xl">✓</span>
                    <span>Ei tarvitse muistaa uutta salasanaa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success text-xl">✓</span>
                    <span>Tietosi pysyvät synkronoituina</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center mt-8">
              <Link href="/" className="text-lg text-text-secondary hover:text-primary transition-colors">
                ← Takaisin etusivulle
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
