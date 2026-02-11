import Head from 'next/head'
import Link from 'next/link'
import { Activity, Heart, TrendingUp, Shield, Smartphone, Cloud } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hapetus - Professional SpO2 & Heart Rate Monitoring</title>
        <meta name="description" content="Professional SpO2 and heart rate monitoring for respiratory health management. Track your oxygen saturation and vital signs with ease." />
      </Head>

      {/* Hero Section */}
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold gradient-text">Hapetus</span>
              </div>
              <div className="flex items-center gap-6">
                <Link href="#features" className="text-text-secondary hover:text-primary transition-colors">
                  Features
                </Link>
                <Link href="#about" className="text-text-secondary hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/login" className="btn btn-primary">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-slide-up">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                Monitor Your Health
                <br />
                <span className="gradient-text">Breathe with Confidence</span>
              </h1>
              <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Professional SpO2 and heart rate monitoring designed for respiratory health management. 
                Track, analyze, and understand your vital signs.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/login" className="btn btn-primary text-lg px-8 py-4">
                  Get Started
                </Link>
                <a href="#features" className="btn glass text-lg px-8 py-4">
                  Learn More
                </a>
              </div>
            </div>

            {/* Floating Cards Animation */}
            <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Heart, value: '98%', label: 'SpO2', color: 'text-error' },
                { icon: Activity, value: '72', label: 'BPM', color: 'text-primary' },
                { icon: TrendingUp, value: '+5%', label: 'Trend', color: 'text-success' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="card animate-fade-in glass"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16">
              Everything You Need to
              <span className="gradient-text"> Stay Healthy</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Activity,
                  title: 'Real-Time Monitoring',
                  description: 'Track your SpO2 and heart rate with precision. Get instant feedback on your vital signs.',
                },
                {
                  icon: TrendingUp,
                  title: 'Advanced Analytics',
                  description: 'Visualize trends and patterns. Understand your health data with beautiful charts and insights.',
                },
                {
                  icon: Shield,
                  title: 'Secure & Private',
                  description: 'Your health data is encrypted and protected. HIPAA-compliant security standards.',
                },
                {
                  icon: Smartphone,
                  title: 'Mobile First',
                  description: 'Native Android app designed for older users. Large fonts, simple navigation, accessible design.',
                },
                {
                  icon: Cloud,
                  title: 'Cloud Sync',
                  description: 'Access your data anywhere. Seamless synchronization across all your devices.',
                },
                {
                  icon: Heart,
                  title: 'Exercise Tracking',
                  description: 'Monitor before and after exercise measurements. Track your recovery and progress.',
                },
              ].map((feature, i) => (
                <div key={i} className="card group">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-8">
              Built for <span className="gradient-text">Respiratory Health</span>
            </h2>
            <p className="text-xl text-text-secondary leading-relaxed mb-12">
              Hapetus is designed specifically for individuals managing respiratory conditions like COPD. 
              Our intuitive interface and powerful features make it easy to stay on top of your health, 
              whether you're at home or on the go.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="card">
                <h3 className="text-2xl font-bold mb-4">For Patients</h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-success text-xl">✓</span>
                    <span>Easy-to-use daily measurement tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success text-xl">✓</span>
                    <span>Visual trends and 7-day averages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success text-xl">✓</span>
                    <span>Customizable alert thresholds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success text-xl">✓</span>
                    <span>Exercise before/after tracking</span>
                  </li>
                </ul>
              </div>
              <div className="card">
                <h3 className="text-2xl font-bold mb-4">Technology</h3>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span>Native Android application</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span>Cloudflare edge computing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span>Firebase authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary text-xl">✓</span>
                    <span>Real-time data synchronization</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-surface">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Take Control?
            </h2>
            <p className="text-xl text-text-secondary mb-12">
              Start monitoring your health today with Hapetus.
            </p>
            <Link href="/login" className="btn btn-primary text-lg px-12 py-5">
              Create Free Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <span className="text-xl font-bold">Hapetus</span>
              </div>
              <div className="text-text-secondary text-center">
                © 2026 Hapetus. Professional health monitoring for everyone.
              </div>
              <div className="flex gap-6 text-text-secondary">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
