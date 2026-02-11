# SpO2 Seuranta - Happisaturaatio ja Sykkeen Seurantasovellus

**[🇬🇧 Read in English](README_EN.md)** | **[📖 Technical Documentation](README_EN.md)**

<div align="center">
  
  **Ammattilaistason natiivi Android-sovellus happisaturaation ja sykkeen seurantaan**
  
  [![Android](https://img.shields.io/badge/Alusta-Android-green.svg)](https://www.android.com/)
  [![Kotlin](https://img.shields.io/badge/Kieli-Kotlin-blue.svg)](https://kotlinlang.org/)
  [![Jetpack Compose](https://img.shields.io/badge/UI-Jetpack%20Compose-4285F4.svg)](https://developer.android.com/jetpack/compose)
  [![Material Design 3](https://img.shields.io/badge/Muotoilu-Material%203-757575.svg)](https://m3.material.io/)
  
</div>

## 📋 Yleiskuvaus

SpO2 Seuranta on ammattilaistason Android-sovellus veren happisaturaation (SpO2) ja sykkeen seurantaan. Sovellus on suunniteltu erityisesti iäkkäille käyttäjille, joilla on hengityselinsairauksia (COPD yms.). Sovellus tarjoaa helppokäyttöisen käyttöliittymän, jossa on suuret painikkeet ja selkeä typografia.

### Keskeiset ominaisuudet

- **📊 Päivittäiset mittaukset** - Nopea SpO2 (50-100%) ja sykkeen tallentaminen automaattisella aikaleimalla
- **🏃 Liikunnan seuranta** - Ennen/jälkeen mittaukset liikunnan yhteydessä
- **📈 Raportit ja tilastot** - 7 päivän keskiarvot, trendianalyysi ja graafiset kuvaajat
- **⚠️ Älykäs hälytysjärjestelmä** - Säädettävät matalan hapen hälytykset
- **🔐 Google-kirjautuminen** - Turvallinen tunnistautuminen ja monilaitesynkronointi
- **♿ Esteettömyys** - Suuri fontti -vaihtoehto, korkea kontrasti, yksinkertainen navigointi
- **🎨 Ammattimainen ulkoasu** - Moderni Material Design 3 lääketieteellisellä ilmeellä
- **📊 Visuaaliset kuvaajat** - Trendigraafit Vico Charts -kirjastolla
- **🇫🇮 Suomen kieli** - Täysin suomenkielinen käyttöliittymä

## 🎯 Käyttötarkoitus

Sovellus on suunniteltu henkilöille, jotka tarvitsevat säännöllistä happisaturaation ja sykkeen seurantaa. Tyypillisiä käyttäjiä ovat:

- **COPD-potilaat** - Kroonisen keuhkoahtaumataudin seuranta
- **Astmaatikot** - Hengitystoiminnan tarkkailu
- **Sydänpotilaat** - Sykkeen ja hapen seuranta
- **Liikunta-aktiiviset** - Suorituskyvyn mittaaminen ennen ja jälkeen liikunnan
- **Ikääntyneet** - Yleinen terveydentilan seuranta

## 📱 Ominaisuudet yksityiskohtaisesti

### Päivittäinen mittaus

- **Nopea syöttö**: Yksinkertainen lomake SpO2:lle ja sykkeelle
- **Automaattinen aikaleima**: Päivämäärä ja kellonaika tallentuvat automaattisesti
- **Muistiinpanot**: Valinnainen kenttä huomioille (esim. "Väsynyt olo")
- **Vahvistus**: Reaaliaikainen syötteen tarkistus (SpO2: 50-100%, Syke: 30-220)
- **Historia**: Viimeisimmät mittaukset näkyvissä lomakkeen alapuolella
- **Matalan hapen hälytys**: Automaattinen varoitus, kun SpO2 laskee alle raja-arvon
- **Värillinen käyttöliittymä**: Kevyt indigonsininen kortti selkeään erotteluun

### Liikunnan mittaus

- **Ennen/jälkeen seuranta**: Erilliset mittaukset ennen ja jälkeen liikunnan
- **Liikunnan kuvaus**: Vapaa tekstikenttä (esim. "Kävely 15 minuuttia")
- **Muutoksen laskenta**: Automaattinen SpO2:n ja sykkeen muutoksen laskenta
- **Merkittävän laskun varoitus**: Hälytys, jos SpO2 laskee yli 5% liikunnan aikana
- **Historiatiedot**: Kaikki aiemmat liikuntasuoritukset nähtävissä
- **Trendianalyysi**: Ennen/jälkeen arvojen vertailu ajan mittaan

### Raportit ja tilastot

**Aikavälit**:
- 7 päivää (Viikko)
- 30 päivää (Kuukausi)
- 3 kuukautta
- Kaikki ajat

**Näkymätilat**:
- **Tilastot**: Keskiarvo SpO2, keskiarvo syke, min/max arvot, matalan hapen määrä
- **Lista**: Kronologinen lista kaikista mittauksista
- **Kuvaaja**: Visuaaliset trendigraafit päivämääräleimalla

**Mittaustyypit**:
- Päivittäinen mittaus
- Liikunnan mittaus (ennen/jälkeen vertailu)

**Kuvaajan ominaisuudet**:
- Viivakaaviot Vico Charts -kirjastolla
- Päivämäärämuotoiltu X-akseli (pp.kk)
- Automaattinen skaalaus Y-akselille
- Värillinen selite ennen/jälkeen vertailulle
- Sulava animaatio ja vuorovaikutus

### Asetukset

- **Hälytysraja-arvo**: Säädettävä matalan SpO2:n varoitustaso (70-95%)
- **Suuri fontti**: Esteettömyysvaihtoehto näkörajoitteisille
- **Tilin hallinta**: Näytä kirjautunut tili, uloskirjautuminen
- **Sovellustiedot**: Versio ja kuvaus

## 🎨 Suunnitteluperiaatteet

### Esteettömyys iäkkäille käyttäjille

1. **Suuret painikkeet**: Kaikki painikkeet vähintään 64dp korkeita
2. **Korkea kontrasti**: Selkeä erottelu elementtien välillä
3. **Kelluva navigointi**: Moderni alapalkin pyöristetyt kulmat
4. **Suuret fontit**: Valinnainen suuri typografia
5. **Selkeät otsikot**: Kuvaavat tekstit kaikille syötteille
6. **Minimaalinen monimutkaisuus**: Suoraviivainen käyttö
7. **Ammattimaiset värit**: Pehmeä indigo/laventeli, ei räikeää syaania

### Material Design 3

- **Dynaaminen värimaailma**: Lääketieteellinen sininen (#1565C0), pehmeä indigo (#5C6BC0)
- **Korostetut kortit**: Pyöristetyt kulmat (16-20dp) hienoilla varjoilla
- **Johdonmukainen välistys**: 8dp ruudukko ja runsas padding
- **Ammattimainen ilme**: Puhdas, lääketieteellisen tason käyttöliittymä
- **Sulava animaatio**: Material-liikkeen periaatteet
- **Kelluvat elementit**: Alapalkki läpinäkyvyydellä ja korostuksella

## 🔒 Tietosuoja ja tietoturva

### Paikallinen tallennus

- Kaikki mittaukset tallennetaan paikallisesti Room-tietokantaan
- Tietoja ei lähetetä ilman käyttäjän tunnistautumista
- Offline-first arkkitehtuuri
- Toimii ilman internet-yhteyttä

### Pilvisynkronointi (Google-kirjautumisen kanssa)

- Käyttäjätiedot yhdistetty Google-tilin ID:hen
- Vaihe 2: Synkronointi Cloudflare-tietokantaan
- Käyttäjä hallitsee tietojaan uloskirjautumalla
- Ei tietojen myyntiä tai kolmansille osapuolille jakamista

## 🔮 Kehityssuunnitelma

### Vaihe 1 (Valmis) ✅
- ✅ Natiivi Android-sovellus kaikilla ominaisuuksilla
- ✅ Paikallinen tietokannan tallennus Room-kirjastolla
- ✅ Google-kirjautuminen
- ✅ Päivittäiset ja liikunnan mittaukset
- ✅ Tilastot ja raportit 4 aikavälillä
- ✅ Säädettävät hälytykset
- ✅ Ammattimainen Material Design 3 käyttöliittymä
- ✅ Graafiset trendikaaviot Vico-kirjastolla
- ✅ Kelluva alapalkin navigointi
- ✅ Esteettömyysominaisuudet (suuret fontit)

### Vaihe 2 (Suunnitteilla) 🔜

**Backend ja pilvisynkronointi:**
- ⏳ Cloudflare Workers REST API
- ⏳ Cloudflare D1 tietokanta pilvivarastointiin
- ⏳ Reaaliaikainen synkronointi laitteiden välillä
- ⏳ Tietojen varmuuskopiointi pilveen
- ⏳ Konfliktien ratkaisu synkronoinnissa

**Verkkosivu katselua varten:**
- ⏳ Cloudflare Pages -verkkosivu
- ⏳ Kirjautuminen samalla Google-tilillä
- ⏳ Kaikkien mittausten katselu selaimessa
- ⏳ Edistyneet visualisoinnit ja kuvaajat
- ⏳ Responsiivinen muotoilu (puhelin, tabletti, tietokone)

**Lisäominaisuudet:**
- ⏳ PDF-raporttien vienti
- ⏳ Lääkärin/hoitajan jakamisominaisuudet
  - Aikarajoitetut jakolinkit
  - Vain luku -käyttöoikeudet
  - Yksityisyyden hallinta
- ⏳ Monikielinen tuki (englanti, ruotsi)
- ⏳ Tietojen vienti CSV-muodossa
- ⏳ Muistutukset mittauksiin
- ⏳ Pitkäaikaiset trendit ja analyysit
- ⏳ Vertailu normaaliarvoihin (ikä/sukupuoli mukaan)

### Vaihe 3 (Tulevaisuus) 💡

**Edistyneet ominaisuudet:**
- Tekoälyavusteinen trendianalyysi
- Ennustava analytiikka (mahdolliset ongelmat)
- Integraatio terveyssovelluksiin (Google Fit, Apple Health)
- Integraatio lääketieteellisiin laitteisiin (Bluetooth-hapettumismittarit)
- Perhetilien tuki (useita käyttäjiä per tili)

## 📲 Asennus ja käyttö

### Järjestelmävaatimukset

- Android 8.0 (API 26) tai uudempi
- Suositeltu: Android 10 tai uudempi
- Google Play -palvelut (Google-kirjautumista varten)
- Noin 50 Mt vapaata tallennustilaa

### Asennus (tulossa Google Play Storeen)

1. Lataa sovellus Google Play Storesta
2. Avaa sovellus
3. Kirjaudu Google-tilillä (valinnainen)
4. Aloita mittausten tallentaminen

### Ensimmäinen käyttökerta

1. **Kirjautuminen**: Valitse Google-tili tai jatka ilman kirjautumista
2. **Asetukset**: Aseta hälytysraja-arvo (oletus 90%)
3. **Ensimmäinen mittaus**: Siirry "Päivittäinen" -välilehdelle ja syötä ensimmäinen mittauksesi
4. **Tutki sovellusta**: Tutustu raportit- ja asetukset-välilehtiin

## 🛠️ Tekniset tiedot

### Käytetyt teknologiat

- **Ohjelmointikieli**: Kotlin 1.9.22
- **UI-framework**: Jetpack Compose + Material Design 3
- **Arkkitehtuuri**: MVVM + Clean Architecture
- **Tietokanta**: Room 2.6.1
- **Riippuvuuksien injektointi**: Hilt
- **Autentikointi**: Firebase Auth + Google Sign-In
- **Kuvaajat**: Vico Charts 1.13.1
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)

Katso yksityiskohtaiset tekniset tiedot: **[Technical Documentation (English)](README_EN.md)**

## 📄 Lisenssi

Tämä projekti on suojattu tekijänoikeuksilla. Kaikki oikeudet pidätetään.

## 👤 Tekijä

**Konderi Development**

## 📧 Yhteystiedot

Ongelmien, kysymysten tai ehdotusten osalta avaa issue GitHubissa.

## 🙏 Kiitokset

- Material Design 3 -suunnitteluohjeet
- Android Jetpack -kirjastot
- Vico Charts -kirjasto (patrykandpatrick)
- Firebase/Google Sign-In
- Room-tietokantakirjasto
- Kotlin Coroutines & Flow
- Hilt-riippuvuuksien injektointi
- Avoimen lähdekoodin yhteisö

---

**Rakennettu ❤️:lla parempaa terveydenseurantaa varten**