import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Takaisin</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tietosuojaseloste</h1>
          <p className="text-gray-600">Päivitetty: 15.2.2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          
          {/* 1. Rekisterinpitäjä */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Rekisterinpitäjä</h2>
            <div className="text-gray-700 space-y-2">
              <p><strong>Palvelun nimi:</strong> SpO2-Seuranta / Hapetus</p>
              <p><strong>Verkkosivusto:</strong> hapetus.info</p>
              <p><strong>Sähköposti:</strong> toni.joronen@gmail.com</p>
            </div>
          </section>

          {/* 2. Rekisterin nimi */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Rekisterin nimi</h2>
            <p className="text-gray-700">SpO2-Seuranta terveystietorekisteri</p>
          </section>

          {/* 3. Henkilötietojen käsittelyn tarkoitus */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Henkilötietojen käsittelyn tarkoitus</h2>
            <p className="text-gray-700 mb-3">Henkilötietoja käsitellään seuraaviin tarkoituksiin:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Käyttäjätunnuksen luominen ja käyttäjän tunnistaminen</li>
              <li>Terveystietojen (happisaturaatio, syke, verenpaine) tallentaminen ja esittäminen</li>
              <li>Palvelun toimivuuden varmistaminen</li>
              <li>Tietojen synkronointi käyttäjän eri laitteiden välillä</li>
            </ul>
          </section>

          {/* 4. Rekisterin tietosisältö */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Rekisterin tietosisältö</h2>
            <p className="text-gray-700 mb-3">Palveluun tallennettavat tiedot:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Käyttäjätiedot:</strong> Google-kirjautumisen kautta saatu käyttäjätunnus (UID), sähköpostiosoite</li>
              <li><strong>Terveystiedot:</strong> Happisaturaatiomittaukset (SpO2%), syke (BPM), verenpaine (mmHg), mittausajankohdat</li>
              <li><strong>Asetukset:</strong> Käyttäjän henkilökohtaiset asetukset (ikä, sukupuoli, hälytysrajat, näyttöasetukset)</li>
              <li><strong>Huomiot:</strong> Käyttäjän lisäämät vapaamuotoiset tekstihuomiot mittauksiin liittyen</li>
              <li><strong>Liikuntamittaukset:</strong> Ennen/jälkeen liikuntaa tehdyt mittaukset ja liikunnan tyyppi</li>
            </ul>
          </section>

          {/* 5. Säännönmukaiset tietolähteet */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Säännönmukaiset tietolähteet</h2>
            <p className="text-gray-700">Tiedot kerätään käyttäjältä itseltään:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Kirjautumistiedot Google-kirjautumisen kautta</li>
              <li>Käyttäjän itse syöttämät terveystiedot ja mittaukset</li>
              <li>Käyttäjän määrittämät henkilökohtaiset asetukset</li>
            </ul>
          </section>

          {/* 6. Tietojen säilytysaika */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Tietojen säilytysaika</h2>
            <p className="text-gray-700">
              Henkilötietoja säilytetään niin kauan kuin käyttäjätili on aktiivinen. Käyttäjä voi milloin tahansa 
              poistaa kaikki tietonsa palvelusta käyttämällä &quot;Poista kaikki tiedot&quot; -toimintoa asetuksissa.
            </p>
          </section>

          {/* 7. Tietojen luovutus */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Tietojen luovutus ja siirto</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                <strong>Tietoja ei luovuteta kolmansille osapuolille.</strong>
              </p>
              <p>Tiedot tallennetaan ja käsitellään:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Cloudflare D1 -tietokanta:</strong> Euroopan talousalueella (ETA)</li>
                <li><strong>Firebase Authentication:</strong> Google Cloud Platform, ETA-alue</li>
              </ul>
              <p>Kaikki tiedonsiirto palvelimille tapahtuu salatun HTTPS-yhteyden kautta.</p>
            </div>
          </section>

          {/* 8. Rekisterin suojaus */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Rekisterin suojaus</h2>
            <p className="text-gray-700 mb-3">Tietoturvatoimenpiteet:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Käyttäjän tunnistus Google-kirjautumisen ja Firebase Authenticationin kautta</li>
              <li>Kaikki tietoliikenne salataan HTTPS/TLS-protokollalla</li>
              <li>Pääsy tietoihin vaatii aina käyttäjän kirjautumisen</li>
              <li>Tietokanta on suojattu ja pääsy rajattu vain palvelun ylläpitäjälle</li>
              <li>Käyttäjä näkee ja voi hallita vain omia tietojaan</li>
            </ul>
          </section>

          {/* 9. Rekisteröidyn oikeudet */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Rekisteröidyn oikeudet</h2>
            <div className="text-gray-700 space-y-3">
              <p>Sinulla on oikeus:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Tarkastusoikeus:</strong> Näet kaikki sinusta tallennetut tiedot palvelussa (mittaukset, asetukset)</li>
                <li><strong>Oikeus tietojen oikaisuun:</strong> Voit muokata tai poistaa yksittäisiä mittauksia ja asetuksia</li>
                <li><strong>Oikeus tietojen poistamiseen:</strong> Voit poistaa kaikki tietosi käyttämällä &quot;Poista kaikki tiedot&quot; -toimintoa</li>
                <li><strong>Oikeus siirtää tiedot:</strong> Voit viedä tietosi CSV/JSON-muodossa (tulossa)</li>
                <li><strong>Oikeus peruuttaa suostumus:</strong> Voit lopettaa palvelun käytön ja poistaa tilisi milloin tahansa</li>
              </ul>
              <p className="mt-4">
                Tietosuojaan liittyvissä kysymyksissä voit ottaa yhteyttä sähköpostitse: 
                <a href="mailto:toni.joronen@gmail.com" className="text-primary hover:underline ml-1">
                  toni.joronen@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* 10. GDPR ja EU-lainsäädäntö */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Sovellettava lainsäädäntö</h2>
            <p className="text-gray-700">
              Tämä tietosuojaseloste noudattaa EU:n yleistä tietosuoja-asetusta (GDPR 2016/679) 
              ja Suomen tietosuojalakia (1050/2018).
            </p>
          </section>

          {/* 11. Erityiset terveystiedot */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Arkaluonteiset tiedot</h2>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
              <p className="text-gray-800 font-medium mb-2">⚠️ Huomio terveystiedoista</p>
              <p className="text-gray-700">
                Palveluun tallennettavat terveystiedot ovat GDPR:n artiklan 9 mukaisia erityisiä henkilötietoryhmiä. 
                Käsittely perustuu käyttäjän nimenomaiseen suostumukseen palvelun käyttöön. 
                Palvelu on tarkoitettu henkilökohtaiseen terveyden seurantaan, ei lääketieteelliseen diagnosointiin. 
                Ota aina yhteyttä lääkäriin terveyshuoliin liittyen.
              </p>
            </div>
          </section>

          {/* 12. Muutokset tietosuojaselosteeseen */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Muutokset tietosuojaselosteeseen</h2>
            <p className="text-gray-700">
              Pidätämme oikeuden päivittää tätä tietosuojaselostetta. Ilmoitamme merkittävistä muutoksista 
              palvelussa tai sähköpostitse. Tietosuojaselosteen viimeisin versio on aina saatavilla osoitteessa 
              hapetus.info/privacy.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline">
            Takaisin etusivulle
          </Link>
        </div>
      </div>
    </div>
  )
}
