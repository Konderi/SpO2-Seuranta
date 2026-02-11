import Head from 'next/head'
import Link from 'next/link'
import { Activity, Heart, TrendingUp, Shield, Smartphone, BarChart3, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Head>
        <title>Hapetus - Helppoa Terveyden Seurantaa</title>
        <meta name="description" content="Seuraa happisaturaatiota ja sykettä helposti. Suunniteltu erityisesti ikäihmisille ja hengitysvaikeuksista kärsiville." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Main Container */}
      <main className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="sticky top-0 w-full z-50 bg-white border-b border-border shadow-elevation-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <Activity className="w-10 h-10 text-primary" strokeWidth={2.5} />
                <span className="text-3xl font-bold text-primary">Hapetus</span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#ominaisuudet" className="text-lg text-text-secondary hover:text-primary transition-colors font-medium">
                  Ominaisuudet
                </a>
                <a href="#miten-toimii" className="text-lg text-text-secondary hover:text-primary transition-colors font-medium">
                  Miten toimii
                </a>
                <Link href="/login" className="btn bg-primary text-white hover:bg-primary-dark transition-all px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl">
                  Kirjaudu sisään
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <Link href="/login" className="btn bg-primary text-white hover:bg-primary-dark transition-all px-6 py-3 rounded-2xl font-semibold shadow-lg">
                  Kirjaudu
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section with Blue Banner */}
        <section className="relative pt-16 md:pt-24 pb-20 px-4 bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
          {/* Decorative Graphics */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full border-4 border-white"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full border-4 border-white"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full border-4 border-white"></div>
            <Activity className="absolute top-20 left-20 w-24 h-24 text-white opacity-20" strokeWidth={1.5} />
            <Heart className="absolute bottom-32 right-32 w-32 h-32 text-white opacity-20" strokeWidth={1.5} />
            <TrendingUp className="absolute top-1/3 right-1/4 w-20 h-20 text-white opacity-20" strokeWidth={1.5} />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center animate-slide-up">
              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Seuraa Terveyttäsi
                <br />
                <span className="text-white opacity-90">Yksinkertaisesti ja Turvallisesti</span>
              </h1>
              
              {/* Subheading */}
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                Hapetus auttaa sinua seuraamaan happisaturaatiota ja sykettä. 
                Suunniteltu erityisesti ikäihmisille – helppo käyttää, selkeä ja luotettava.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/login" className="btn btn-large bg-white text-primary hover:bg-gray-50 shadow-elevation-3 hover:shadow-elevation-4">
                  Aloita käyttö
                </Link>
                <a href="#ominaisuudet" className="btn btn-large border-2 border-white text-white hover:bg-white/10">
                  Lue lisää
                </a>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-center gap-8 text-white">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <span className="text-lg">Turvallinen</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <span className="text-lg">Helppo käyttää</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <span className="text-lg">Suomeksi</span>
                </div>
              </div>
            </div>

            {/* Preview Cards */}
            <div className="mt-20 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">{[
                { 
                  icon: Heart, 
                  value: '96%', 
                  label: 'Happisaturaatio', 
                  color: 'text-spo2-healthy',
                  bgColor: 'bg-green-50'
                },
                { 
                  icon: Activity, 
                  value: '72', 
                  label: 'Syke (lyöntiä/min)', 
                  color: 'text-heart-rate',
                  bgColor: 'bg-red-50'
                },
                { 
                  icon: TrendingUp, 
                  value: '+2%', 
                  label: 'Kehitys', 
                  color: 'text-success',
                  bgColor: 'bg-blue-50'
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`card ${stat.bgColor} border-2 hover:shadow-elevation-3 transition-all duration-normal`}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <stat.icon className={`w-16 h-16 ${stat.color} mx-auto mb-4`} strokeWidth={2} />
                  <div className="text-5xl font-bold mb-3 text-text-primary">{stat.value}</div>
                  <div className="text-lg text-text-secondary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="ominaisuudet" className="py-24 px-4 bg-surface">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-h1 font-bold mb-4 text-text-primary">
                Kaikki tarvitsemasi
                <span className="text-primary"> yhdessä paikassa</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Suunniteltiin alusta alkaen helppokäyttöiseksi ja selkeäksi
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Activity,
                  title: 'Päivittäinen seuranta',
                  description: 'Tallenna happisaturaatio ja syke päivittäin. Seuraa arvojen kehitystä ajan mittaan.',
                },
                {
                  icon: BarChart3,
                  title: 'Selkeät graafit',
                  description: 'Näe kehityksesi helposti luettavista kaavioista. Isot numerot ja selkeät värit.',
                },
                {
                  icon: Shield,
                  title: 'Turvallinen',
                  description: 'Tietosi on suojattu ja salattu. Vain sinä näet omat mittaustuloksesi.',
                },
                {
                  icon: Smartphone,
                  title: 'Toimii puhelimessa',
                  description: 'Käytä Android-puhelimella tai tietokoneella. Tiedot päivittyvät automaattisesti.',
                },
                {
                  icon: Heart,
                  title: 'Liikunta-aktiviteetit',
                  description: 'Mittaa arvot ennen ja jälkeen liikunnan. Seuraa palautumista.',
                },
                {
                  icon: TrendingUp,
                  title: 'Historian seuranta',
                  description: 'Katso kaikkien mittausten historia. Tulosta raportit lääkärille.',
                },
              ].map((feature, i) => (
                <div key={i} className="card hover:shadow-elevation-3 transition-all duration-normal">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <feature.icon className="w-9 h-9 text-primary" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">{feature.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="miten-toimii" className="py-24 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-h1 font-bold mb-4 text-text-primary">
                Näin helppoa se on
              </h2>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                Kolme yksinkertaista vaihetta päivittäiseen terveysseurantaan
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  number: '1',
                  title: 'Kirjaudu sisään',
                  description: 'Käytä Google-tiliäsi kirjautumiseen. Turvallista ja helppoa.',
                },
                {
                  number: '2',
                  title: 'Mittaa arvot',
                  description: 'Syötä happisaturaatio ja syke. Lisää halutessasi muistiinpanoja.',
                },
                {
                  number: '3',
                  title: 'Seuraa kehitystä',
                  description: 'Näe selkeät graafit ja viikon keskiarvot. Jaa tiedot lääkärille.',
                },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold mx-auto mb-6 shadow-elevation-2">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-text-primary">{step.title}</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-primary text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Aloita terveyden seuranta tänään
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Liity tuhansien käyttäjien joukkoon, jotka seuraavat terveyttään Hapetuksen avulla
            </p>
            <Link href="/login" className="inline-flex items-center justify-center gap-3 bg-white text-primary px-12 py-5 rounded-lg text-xl font-semibold hover:bg-gray-50 transition-all shadow-elevation-3 hover:shadow-elevation-4">
              Kirjaudu sisään
              <Activity className="w-6 h-6" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-surface border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-8 h-8 text-primary" strokeWidth={2.5} />
                  <span className="text-2xl font-bold text-primary">Hapetus</span>
                </div>
                <p className="text-text-secondary">
                  Helppoa terveyden seurantaa ikäihmisille
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold mb-4 text-text-primary">Linkit</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#ominaisuudet" className="text-text-secondary hover:text-primary transition-colors">
                      Ominaisuudet
                    </a>
                  </li>
                  <li>
                    <a href="#miten-toimii" className="text-text-secondary hover:text-primary transition-colors">
                      Miten toimii
                    </a>
                  </li>
                  <li>
                    <Link href="/login" className="text-text-secondary hover:text-primary transition-colors">
                      Kirjaudu sisään
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-bold mb-4 text-text-primary">Yhteystiedot</h4>
                <p className="text-text-secondary">
                  Tuki: support@hapetus.info
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="pt-8 border-t border-border text-center text-text-secondary">
              <p>&copy; {new Date().getFullYear()} Hapetus. Kaikki oikeudet pidätetään.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
