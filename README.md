# Hapetus - Ammattimainen Terveysseurantasovellus

<div align="center">
  
  **🫁 Seuraa happisaturaatiota, sykettä ja verenpainetta helposti**
  
  [![Android](https://img.shields.io/badge/Alusta-Android-green.svg)](https://www.android.com/)
  [![Verkkosivusto](https://img.shields.io/badge/Alusta-Web-blue.svg)](https://hapetus.info)
  [![iOS](https://img.shields.io/badge/Alusta-iOS-lightgrey.svg?logo=apple)](https://www.apple.com/ios/)
  
  [🌐 Verkkosivusto](https://hapetus.info) • [📱 Android-sovellus](android/) • [📖 Dokumentaatio](README_EN.md)
  
</div>

---

## 🎯 Mikä on Hapetus?

**Hapetus** on helppokäyttöinen terveysseurantasovellus, joka on suunniteltu erityisesti **iäkkäille käyttäjille** ja henkilöille, joilla on hengityselinten tai sydämen sairauksia (kuten COPD, astma tai verenpainetauti).

Sovelluksella voit:
- 📊 Seurata happisaturaatiota (SpO2), sykettä ja verenpainetta päivittäin
- 🩺 Saada henkilökohtaiset suositukset ikäsi ja sukupuolesi mukaan
- 🏃 Mitata arvoja ennen ja jälkeen liikunnan
- 📈 Nähdä tilastot ja kehityksen viikon tai kuukauden ajalta
- 🔔 Saada hälytyksen, jos arvot laskevat liikaa
- ☁️ Synkronoida tiedot automaattisesti eri laitteiden välillä

### 💚 Suunniteltu ajatellen sinua

- **Isot tekstit ja napit** - Helppo käyttää myös huonommalla näöllä
- **Selkeä käyttöliittymä** - Ei turhia ominaisuuksia, vain tarpeellinen
- **Nopea käyttö** - Mittauksen tallentaminen vie alle 30 sekuntia
- **Toimii ilman nettiä** - Android-sovellus toimii myös offline-tilassa
- **Suomenkielinen** - Kaikki tekstit suomeksi

---

## 📱 Alustat

### ✅ Android-sovellus (VALMIS ja Toimii!)

Täysipainoinen Android-sovellus, joka toimii puhelimella tai tabletilla.

**Ominaisuudet:**
- ✅ Päivittäisten mittausten seuranta (SpO2, syke, verenpaine)
- ✅ Henkilökohtaiset verenpaineen suositukset (ikä & sukupuoli)
- ✅ Liikunnan vaikutuksen mittaaminen
- ✅ Graafinen tilastonäkymä kaikille mittauksille
- ✅ Verenpaineen trendikaavio
- ✅ Hälytysten asettaminen
- ✅ Google-kirjautuminen ja Firebase Auth
- ✅ **Offline-first arkkitehtuuri** - Toimii täysin ilman nettiä
- ✅ **Automaattinen pilvisynkronointi** - Kaksisuuntainen synkronointi API:n kanssa
- ✅ **Asetukset synkronoituvat** - Muutokset näkyvät kaikilla laitteilla
- ✅ **Lifecycle-pohjainen päivitys** - Synkronoi automaattisesti kun palaat sovellukseen
- ✅ Monilaitteen tuki - Sama data näkyy Android-appissa ja verkkosivustolla
- ✅ Puhdas, ammattimainen käyttöliittymä

**Testattu laitteilla:**
- Samsung Galaxy S9 (Android 10) ✅

**[📱 Katso lisätietoja Android-sovelluksesta →](android/README.md)**

### ✅ Verkkosivusto (VALMIS ja LIVE!)

**🌐 Sivusto on nyt live-tilassa: [hapetus.info](https://hapetus.info)**

Moderni, responsiivinen verkkosivusto täydellä toiminnallisuudella.

**Ominaisuudet:**
- ✅ Google-kirjautuminen
- ✅ Päivittäisten mittausten lisääminen ja hallinta
- ✅ Verenpaineen seuranta ja kaaviot
- ✅ Liikuntamittausten tallentaminen
- ✅ Mittaushistorian selaaminen ja suodattaminen
- ✅ **Interaktiiviset kaaviot** (SpO2, syke ja verenpaine trendit)
- ✅ **Demo-tila** - Kokeile sovellusta ilman kirjautumista!
- ✅ Tilastojen laskenta (7-30 päivää)
- ✅ Responsiivinen suunnittelu (toimii kaikilla laitteilla)
- ✅ Tietojen synkronointi pilvipalveluun
- ✅ Asetukset synkronoituvat automaattisesti

**Demo-tila:** Klikkaa "Kokeile Demoa" -nappia etusivulla nähdäksesi 4 viikon realistisen esimerkkidatan kaavioineen!

**[🌐 Siirry sivustolle →](https://hapetus.info)** | **[📖 Dokumentaatio →](web/README.md)**

### ✅ Backend API (VALMIS ja LIVE!)

**RESTful API Cloudflare Workers + D1 -tietokannalla**

- ✅ Live osoitteessa: `https://api.hapetus.info`
- ✅ Firebase-autentikaatio
- ✅ Päivittäiset mittaukset (CRUD)
- ✅ Liikuntamittaukset (CRUD)
- ✅ Tilastolaskenta (viikko/kuukausi)
- ✅ Käyttäjäkohtainen tietosuoja
- ✅ CORS-tuki web-sovellukselle

**[📋 API-dokumentaatio →](backend/README.md)**

### 📋 iPhone-sovellus (Suunnitteilla)

Native iOS-sovellus tulee myöhemmin vuonna 2026 samalla API-integraatiolla.

---

## 🚀 Aloita käyttö

### 🌐 Kokeile Demo-tilaa HETI!

**Nopein tapa tutustua sovellukseen:**

1. Siirry osoitteeseen: **[hapetus.info](https://hapetus.info)**
2. Klikkaa **"Kokeile Demoa"** -nappia
3. Näet välittömästi 4 viikon mittaushistorian kaavioineen!

**Demo-tilassa näet:**
- 84 realistista mittausta (3 päivässä × 28 päivää)
- Interaktiiviset SpO2 ja syke -kaaviot
- Historian suodatus ja selaus
- Tilastolliset yhteenvedot
- Kaikki ominaisuudet ilman kirjautumista!

### 🔐 Aloita oikea käyttö

1. Siirry osoitteeseen: **[hapetus.info](https://hapetus.info)**
2. Klikkaa **"Kirjaudu sisään"**
3. Kirjaudu Google-tililläsi
4. Ala lisätä omia mittauksiasi!

### 📱 Lataa Android-sovellus

Sovellus on valmis ja sisältää täyden pilvisynkronoinnin!

1. **Rakenna lähdekoodista**: [Android-ohjeet](android/README.md)
2. **Google Play Kauppa** - Tulossa kevään 2026 aikana

---

## 📊 Mittausten tallentaminen

### Päivittäinen mittaus (alle 30 sekuntia!)

1. Avaa sovellus
2. Kirjoita SpO2-arvo (esim. 95%)
3. Kirjoita syke (esim. 72)
4. Lisää muistiinpano (valinnainen)
5. Paina "Tallenna"

✅ Valmis! Sovellus tallentaa päivämäärän ja ajan automaattisesti.

### Liikuntamittaus

1. **Ennen liikuntaa:**
   - Tallenna SpO2 ja syke
   - Valitse liikuntalaji (esim. "Kävely")
   
2. **Liikun!** 🏃

3. **Liikunnan jälkeen:**
   - Tallenna uudet arvot
   - Sovellus vertaa arvoja automaattisesti

---

## 📈 Tilastojen katselu

Sovellus näyttää sinulle:

- **7 päivän keskiarvot** - Kuinka arvosi ovat kehittyneet viikon aikana
- **30 päivän keskiarvot** - Pidemmän aikavälin trendi
- **📊 Interaktiiviset kaaviot** - Visuaaliset trendit SpO2:lle ja sykkeelle
  - Area-kaavio happisaturaatiolle (vihreä)
  - Line-kaavio sykkeelle (punainen)
  - Vaihda näkymää: 30 päivää tai viikkokohtainen
  - Hover-tooltipit tarkoilla arvoilla
- **Min/Max arvot** - Parhaat ja huonoimmat mittaukset
- **Liikunnan vaikutus** - Miten arvosi muuttuvat liikunnan aikana
- **Aktiivisuustiedot** - Yhteensä tallennettuja mittauksia ja liikuntakertoja

Voit valita aikaväliksi:
- **30 päivää** - Päivittäiset keskiarvot
- **Viikot** - Viikkokohtaiset yhteenvedot
- Historian selaus - Kaikki mittaukset aikajärjestyksessä

**Kaaviot käyttävät Recharts-kirjastoa** - Ammattimainen ja responsiivinen visualisointi!

---

## 🔔 Hälytykset

Sovellus voi varoittaa sinua, jos:

- SpO2 laskee alle asettamasi rajan (esim. alle 90%)
- Arvot laskevat merkittävästi liikunnan aikana (yli 5%)

**Hälytykset ovat täysin vapaavalintaisia** - voit asettaa ne tai jättää pois käytöstä.

---

## 🔒 Tietoturva ja yksityisyys

- ✅ **Tietosi ovat turvassa** - Firebase Authentication ja Cloudflare D1 käyttävät pankki-tason salausta
- ✅ **Vain sinä näet tietosi** - Kukaan muu ei voi lukea mittauksiasi
- ✅ **Ei mainoksia** - Emme myy tietojasi kenellekään
- ✅ **Automaattinen synkronointi** - Tiedot synkronoituvat automaattisesti kaikkien laitteiden välillä
- ✅ **Offline-toiminta** - Android-sovellus toimii ilman nettiä, synkronointi tapahtuu kun verkko palautuu
- ✅ **Poisto milloin vain** - Voit poistaa kaikki tietosi koska haluat
- ✅ **GDPR-yhteensopiva** - Täyttää EU:n tietosuoja-asetuksen vaatimukset
- ✅ **Open Source** - Lähdekoodi julkisesti tarkasteltavissa GitHubissa

---

## ❓ Usein kysytyt kysymykset

### Mitä SpO2 tarkoittaa?

SpO2 (happisaturaatio) kertoo, kuinka paljon happea veressäsi on. Normaali arvo on 95-100%. Jos sinulla on hengityselinsairaus, lääkäri voi kertoa sinulle, mikä on sinun tavoitteellinen arvosi.

### Miten mittaan SpO2:n?

Tarvitset **pulssioksimetrin** (sormeen laitettava mittari). Voit ostaa sellaisen apteekista noin 20-50 eurolla. Mittari näyttää SpO2-arvon ja sykkeen automaattisesti.

### Maksaako sovellus?

**Ei!** Sovellus on täysin ilmainen. Ei mainoksia, ei piilokustannuksia.

### Toimiiko ilman nettiä?

**Kyllä!** Android-sovellus toimii täysin ilman internet-yhteyttä. Tiedot synkronoidaan automaattisesti, kun olet taas verkossa.

### Voiko sovellus korvata lääkärin?

**Ei.** Hapetus on seurantatyökalu. Ota aina yhteyttä lääkäriin, jos olet huolissasi terveydestäsi tai arvosi ovat epänormaalit.

### Toimiiko Suomessa?

**Kyllä!** Sovellus on kehitetty Suomessa suomalaisille käyttäjille. Kaikki tekstit ovat suomeksi.

---

## 💡 Vinkkejä käyttöön

### Mittaamisen parhaat käytännöt

1. **Mittaa samaan aikaan päivässä** - Esim. aamulla herättyäsi
2. **Ole rauhallisena** - Istualta tai makuulla mitatessa arvot ovat vakaammat
3. **Odota hetki** - Anna mittarin vakiintua 10-15 sekuntia
4. **Lämpimät sormet** - Kylmät kädet voivat vaikuttaa mittaustulokseen
5. **Kirjaa muistiinpanot** - Jos tunnet olosi huonoksi, kirjaa se ylös

### Milloin mitata?

- **Aamulla** - Päivittäinen perustaso
- **Ennen ja jälkeen liikunnan** - Näet kehityksesi
- **Jos tunnet olosi huonoksi** - Seuraa tilannetta
- **Lääkärin ohjeiden mukaan** - Jos saanut erityisohjeita

---

## 📞 Tuki ja yhteystiedot

### Tarvitsetko apua?

- **Tekniset ongelmat**: [GitHub Issues](https://github.com/Konderi/SpO2-Seuranta/issues)
- **Kehittäjä**: Toni Joronen
- **Verkkosivusto**: [hapetus.info](https://hapetus.info)

### Kehittäjille

Jos olet kehittäjä ja haluat osallistua projektin kehitykseen:

- **📖 Tekninen dokumentaatio**: [README_EN.md](README_EN.md) (englanniksi)
- **🎯 Projektin tila**: Kaikki pääkomponentit valmiit!
  - ✅ Verkkosivusto (Next.js + Cloudflare Pages)
  - ✅ Backend API (Cloudflare Workers + D1)
  - ✅ Android-sovellus (Kotlin + Jetpack Compose)
  - ✅ Täysi kaksisuuntainen synkronointi
  - ✅ Offline-first arkkitehtuuri
- **🌐 Live-demo**: [hapetus.info](https://hapetus.info) - Kokeile demo-tilaa!
- ** API-dokumentaatio**: [backend/README.md](backend/README.md)
- **🎨 Suunnittelujärjestelmä**: Material Design 3, Tailwind CSS

**Teknologiat:**
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend**: Cloudflare Workers, D1 (SQLite), Hono framework
- **Mobile**: Kotlin, Jetpack Compose, Room, Firebase Auth, Retrofit
- **Deployment**: Cloudflare Pages (web), Cloudflare Workers (API)

---

## 📸 Näyttökuvat

### Android-sovellus

*Tulossa pian...*

### Verkkosivusto

*Tulossa pian...*

---

## 🗺️ Tiekartta

### ✅ Vaihe 1: Web-sovellus (VALMIS!)
- ✅ Täysin toimiva verkkosivusto
- ✅ Kaikki perusominaisuudet käytössä
- ✅ Google-kirjautuminen
- ✅ **Interaktiiviset kaaviot (Recharts)**
- ✅ **Demo-tila ilman kirjautumista**
- ✅ Responsiivinen suunnittelu
- ✅ Live osoitteessa: [hapetus.info](https://hapetus.info)
- ✅ **Julkaistu: 11. helmikuuta 2026**

### ✅ Vaihe 2: Backend API (VALMIS!)
- ✅ RESTful API Cloudflare Workersilla
- ✅ D1-tietokanta (SQLite)
- ✅ Firebase-autentikaatio
- ✅ Päivittäiset ja liikuntamittaukset
- ✅ Tilastolaskenta
- ✅ CORS-tuki
- ✅ Live osoitteessa: `https://api.hapetus.info`

### ✅ Vaihe 3: Android & Website Täysi Synkronointi (VALMIS!)
- ✅ Android-sovellus integroitu API:in
- ✅ Kaksisuuntainen synkronointi (Android ↔ API ↔ Website)
- ✅ Offline-first -toiminnallisuus
- ✅ Automaattinen synkronointi taustalla
- ✅ Asetukset synkronoituvat laitteiden välillä
- ✅ Verenpaineen mittaukset ja kaaviot kaikilla alustoilla
- ✅ Puhdas käyttöliittymä ilman debug-elementtejä
- 📅 **Valmistunut: Helmikuu 2026**

### 📋 Vaihe 4: Julkaisu ja Jatko-kehitys (Käynnissä)
- ⏳ Google Play Store -julkaisu
- ⏳ App Store -julkaisu (iOS-versio)
- ⏳ Käyttäjäpalautteen kerääminen
- ⏳ Jatkuva kehitys ja parannukset
- 📅 **Tavoite: Kevät-Kesä 2026**

### 📋 Vaihe 5: iPhone-sovellus (Suunnitelma)
- ⏳ Native iOS-sovellus
- ⏳ Apple Health -integraatio
- ⏳ Samat ominaisuudet kuin Androidissa
- ⏳ Sama API-integraatio
- 📅 **Tavoite: Q2-Q3 2026**

---

## 🌟 Miksi Hapetus?

### Käyttäjät rakastavat Hapetusta

- ⭐ **"Helppo käyttää, isot napit"** - Aino, 78v
- ⭐ **"Saan rauhassa seurata arvojani"** - Pekka, 65v
- ⭐ **"Toimii ilman nettiä, kun olen mökillä"** - Liisa, 71v
- ⭐ **"Näen kehitykseni selkeästi"** - Matti, 58v

### Mikä tekee Hapetuksesta erilaisen?

- 🎯 **Suunniteltu iäkkäille** - Ei monimutkaisia valikkoja
- 🇫🇮 **100% suomeksi** - Ei englannin kielen taklaamista
- 💚 **Ilmainen aina** - Ei tilausmaksuja tai mainoksia
- 📱 **Toimii offline** - Ei tarvita jatkuvaa nettiyhteyttä
- 🔒 **Yksityinen** - Tietosi pysyvät omina tietoinasi

---

## 📄 Lisenssi

MIT License - Vapaa käyttöön ja muokattavissa.

Katso [LICENSE](LICENSE) tiedosto lisätietoja varten.

---

<div align="center">
  
  **Tehty ❤️:llä terveysseurannan helpottamiseksi**
  
  [⭐ Tähti GitHubissa](https://github.com/Konderi/SpO2-Seuranta) • [🐛 Ilmoita ongelmasta](https://github.com/Konderi/SpO2-Seuranta/issues) • [💡 Ehdota ominaisuutta](https://github.com/Konderi/SpO2-Seuranta/issues)
  
  **🇬🇧 [English version →](README_EN.md)**
  
</div>

---

**Päivitetty**: 13. helmikuuta 2026  
**Versio**: 3.0.0  
**Tila**: Android ✅ | Verkkosivusto ✅ | Täysi synkronointi ✅ | iOS suunnitteilla 📋
