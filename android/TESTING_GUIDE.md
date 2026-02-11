# Hapetus - Android-sovelluksen testausohje

## Vaatimukset

### Tietokone
- **macOS** (sinun tapauksessasi)
- **Android Studio** Hedgehog (2023.1.1) tai uudempi
- **JDK 17** (Java Development Kit)
- **Git** (jo asennettu)

### Testipuhelin
- **Android 8.0 (API 26)** tai uudempi
- **USB-kaapeli** tietokoneen ja puhelimen välille
- **Kehittäjätila** aktivoituna (ohjeet alla)
- **USB-virheenkorjaus** (USB Debugging) päällä

---

## Vaihe 1: Asenna Android Studio

### 1.1 Lataa Android Studio
1. Avaa selain: https://developer.android.com/studio
2. Lataa **Android Studio** (Mac with Apple chip / Intel)
3. Avaa ladattu `.dmg`-tiedosto
4. Vedä **Android Studio** → **Applications**-kansioon

### 1.2 Käynnistä ja asenna komponentit
1. Avaa **Android Studio** Applications-kansiosta
2. Valitse **Standard Installation**
3. Hyväksy lisenssit (Accept All)
4. Odota että Android SDK, emulatorit ja työkalut asentuvat (~5-10 min)

### 1.3 Tarkista JDK
Android Studio asentaa JDK:n automaattisesti. Voit tarkistaa terminaalissa:
```bash
/Applications/Android\ Studio.app/Contents/jbr/Contents/Home/bin/java -version
```

---

## Vaihe 2: Valmistele testipuhelin

### 2.1 Aktivoi kehittäjätila

**Samsung / useimmat Android-puhelimet:**
1. Avaa **Asetukset** (Settings)
2. Mene **Tietoja puhelimesta** (About phone)
3. Etsi **Build number** tai **Koontiversio**
4. **Napauta 7 kertaa** Build number -kohtaa
5. Anna PIN-koodisi jos kysytään
6. Näet viestin: "Olet nyt kehittäjä!" (You are now a developer!)

### 2.2 Aktivoi USB-virheenkorjaus

1. Palaa **Asetukset**-valikkoon
2. Mene **Kehittäjäasetukset** (Developer options)
   - Jos et löydä: **System → Advanced → Developer options**
3. Kytke päälle: **USB debugging** / **USB-virheenkorjaus**
4. Hyväksy varoitus

### 2.3 Salli sovellukset tuntemattomista lähteistä (valinnainen)

1. **Asetukset** → **Tietoturva** (Security)
2. Kytke päälle: **Tuntemattomat lähteet** tai **Install unknown apps**
3. Anna lupa **Android Studio**:lle (kun kysytään ensimmäisellä kerralla)

---

## Vaihe 3: Avaa projekti Android Studiossa

### 3.1 Avaa projekti

1. Käynnistä **Android Studio**
2. Valitse **Open** etusivulta
3. Navigoi projektikansioon:
   ```
   /Users/tonijoronen/Library/Mobile Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
   ```
4. Valitse **android**-kansio ja klikkaa **Open**

### 3.2 Gradle Sync

- Android Studio lataa automaattisesti riippuvuudet (dependencies)
- Näet alareunassa: "Gradle build running..."
- **Odota kunnes valmis** (~3-10 minuuttia ensimmäisellä kerralla)
- Jos näet virheen, klikkaa **Sync Project with Gradle Files** (🐘-ikoni yläpalkissa)

### 3.3 Tarkista Firebase-konfiguraatio

Projekti tarvitsee Firebase-konfiguraation:
1. Tarkista että tiedosto on olemassa:
   ```
   android/app/google-services.json
   ```
2. Jos ei ole, kopioi se Firebase-konsolista (ohje alla)

---

## Vaihe 4: Yhdistä testipuhelin

### 4.1 Kytke USB-kaapeli

1. **Kytke puhelin tietokoneeseen** USB-kaapelilla
2. Puhelimeen ilmestyy dialogi: **"Salli USB-virheenkorjaus?"**
3. Valitse **Salli** (Allow)
4. ✅ Rastita: **Salli aina tästä tietokoneesta** (Always allow from this computer)

### 4.2 Tarkista yhteys

Android Studion yläpalkissa pitäisi näkyä:
- **Laitteen nimi** (esim. "Samsung SM-G991B")
- Jos näkyy "No devices", klikkaa ja valitse **Troubleshoot Device Connections**

**Terminaalissa voit myös tarkistaa:**
```bash
# Avaa Terminal
cd ~/Library/Android/sdk/platform-tools
./adb devices
```

Pitäisi näyttää:
```
List of devices attached
ABC123XYZ    device
```

---

## Vaihe 5: Buildaa ja asenna sovellus

### 5.1 Valitse Build Variant (valinnainen)

1. Android Studio: **Build → Select Build Variant**
2. Valitse **debug** (oletuksena, helpompi testata)

### 5.2 Käynnistä sovellus

**Vaihtoehto 1: Android Studio UI**
1. Klikkaa **▶ Run** -painiketta (vihreä kolmio yläpalkissa)
2. Valitse **app** (jos kysyy)
3. Odota että build valmistuu (~2-5 min ensimmäisellä kerralla)
4. Sovellus käynnistyy automaattisesti puhelimessa

**Vaihtoehto 2: Terminaali (nopeampi kun osaat)**
```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew installDebug
```

### 5.3 Tarkista sovellus

Puhelimessasi pitäisi nyt näkyä:
- **Hapetus**-sovellus sovelluskentässä (app drawer)
- Ikoni: Activity-symboli (järjestelmän oletusikoni toistaiseksi)
- Voit avata sovelluksen napauttamalla

---

## Vaihe 6: Testaa sovellusta

### 6.1 Kirjaudu sisään

1. Avaa **Hapetus**-sovellus
2. Näet **Tervetuloa**-näytön
3. Napauta **"Kirjaudu Google-tilillä"**
4. Valitse Google-tilisi
5. Anna luvat (jos kysyy)
6. ✅ Pitäisi ohjautua sovelluksen etusivulle

### 6.2 Testaa toiminnot

**Päivittäinen mittaus:**
1. Napauta **"Päivittäinen"** alavalikosta
2. Syötä SpO2-arvo (esim. 96)
3. Syötä syke (esim. 72)
4. Lisää muistiinpano (valinnainen)
5. Napauta **"Tallenna mittaus"**
6. ✅ Pitäisi näyttää "Tallennettu onnistuneesti"

**Liikuntamittaus:**
1. Napauta **"Liikunta"**
2. Täytä ennen-mittaukset
3. Täytä jälkeen-mittaukset
4. Lisää liikunnan kuvaus (esim. "Kävely 15 min")
5. Tallenna
6. ✅ Pitäisi tallentua Firebase-tietokantaan

**Raportit:**
1. Napauta **"Raportit"**
2. Valitse **7 päivää** / **30 päivää**
3. Näet mittauksesi kuvaajina ja tilastoina

**Asetukset:**
1. Napauta **"Asetukset"**
2. Kokeile **"Suuri fontti"** -vipua
3. Teksti kasvaa/pienenee heti
4. Säädä **"Matalan SpO2:n raja-arvo"**

---

## Vaihe 7: Firebase-konfiguraatio (jos tarpeen)

Jos sovellus ei yhdistä Firebase-tietokantaan:

### 7.1 Lataa google-services.json

1. Avaa Firebase Console: https://console.firebase.google.com
2. Valitse projekti: **spo2-seuranta**
3. Mene **Project Settings** (⚙️ → Project settings)
4. **Your apps** -osiossa valitse **Android-ikoni**
5. Jos ei ole Android-sovellusta:
   - Klikkaa **Add app** → **Android**
   - Android package name: `com.konderi.hapetus`
   - App nickname: `Hapetus`
   - Lataa **google-services.json**
6. Jos sovellus on jo olemassa:
   - Klikkaa **Download google-services.json**

### 7.2 Kopioi tiedosto projektiin

```bash
# Kopioi ladattu tiedosto
cp ~/Downloads/google-services.json /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android/app/
```

### 7.3 Rebuild

```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew clean
./gradlew installDebug
```

---

## Vaihe 8: Lokien tarkastelu (virheiden korjaus)

### 8.1 Logcat (Android Studion sisällä)

1. Android Studio: **View → Tool Windows → Logcat**
2. Valitse **laitteesi** pudotusvalikosta
3. Valitse **com.konderi.hapetus** (Hapetus-prosessi)
4. Näet kaikki sovelluksen lokit reaaliajassa
5. Suodata virheitä: Kirjoita hakuun `tag:Hapetus` tai `level:error`

### 8.2 Terminaali logit

```bash
cd ~/Library/Android/sdk/platform-tools
./adb logcat | grep Hapetus
```

### 8.3 Crash-raportit

Jos sovellus kaatuu:
1. **Logcat** näyttää stack tracen
2. Kopioi virhe ja etsi Google/Stack Overflow
3. Tai lähetä minulle (Copilot) virheviesti

---

## Vaihe 9: Yleisiä ongelmia ja ratkaisut

### "Device not found" / Laitetta ei löydy

**Ratkaisu:**
```bash
# Tarkista USB-yhteys
cd ~/Library/Android/sdk/platform-tools
./adb devices

# Jos tyhjä lista, tee:
./adb kill-server
./adb start-server
./adb devices

# Irrota USB-kaapeli ja yhdistä uudelleen
```

### "Gradle sync failed"

**Ratkaisu:**
1. Android Studio: **File → Invalidate Caches → Invalidate and Restart**
2. Tai terminaalissa:
   ```bash
   cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
   ./gradlew clean
   ./gradlew build
   ```

### "Google Sign-In failed"

**Ratkaisu:**
1. Tarkista että `google-services.json` on oikea
2. Tarkista Firebase Consolesta:
   - **Authentication → Sign-in method → Google: Enabled**
   - **Android SHA-1 fingerprint** lisätty (ohje alla)

**Lisää SHA-1 fingerprint:**
```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew signingReport
```

Kopioi **SHA-1** debug-osiosta ja lisää Firebase Consoleen:
- **Project Settings → Your apps → Android app → Add fingerprint**

### Sovellus hidasta tai kaatuu

**Ratkaisu:**
1. Tarkista että puhelimessa on vapaata muistia (>1 GB)
2. Sulje muut sovellukset
3. Käynnistä puhelin uudelleen
4. Buildaa **Release**-versio (optimoitu):
   ```bash
   ./gradlew assembleRelease
   ```

---

## Vaihe 10: Seuraavat askeleet

### 10.1 Jatkuva kehitys

**Hot Reload -tyyli kehitys:**
- Muokkaa koodia Android Studiossa
- Klikkaa **▶ Run** uudelleen
- Sovellus päivittyy puhelimessa

**Nopea debug-build:**
```bash
./gradlew installDebug
```

### 10.2 Generoi Release APK (jakamista varten)

Jos haluat jakaa APK-tiedoston muille testaajille:

```bash
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew assembleRelease
```

APK sijainti:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

**Huom:** Tuotantoversiota varten tarvitset signing key:n (ohje erillisessä dokumentissa).

### 10.3 Google Play Store -julkaisu

**Tulevaisuudessa:**
1. Luo signing key
2. Generoi signed AAB (Android App Bundle)
3. Luo Google Play Console -tili
4. Lataa AAB Play Consoleen
5. Täytä store listing (kuvaukset, kuvat)
6. Julkaise Internal/Alpha/Beta testiin ensin
7. Lopulta julkaise Production-kanavalle

---

## Yhteenveto: Nopea aloitusohje

**Jos haluat testata sovellusta nopeasti:**

```bash
# 1. Avaa Android Studio ja projekti
# 2. Kytke puhelin USB:llä ja salli USB debugging
# 3. Android Studiossa klikkaa ▶ Run

# TAI terminaalissa:
cd /Users/tonijoronen/Library/Mobile\ Documents/com~apple~CloudDocs/Git/SpO2-Seuranta/android
./gradlew installDebug
```

**Sovelluksen nimi:** Hapetus
**Package:** com.konderi.hapetus
**Värit:** Tummansininen #0070E6 (vastaa verkkosivua)
**Min Android:** 8.0 (API 26)
**Target Android:** 14 (API 34)

---

## Apua ja tuki

**Virheet?**
- Kopioi virheviesti Logcatista
- Lähetä minulle (GitHub Copilot) Chat-ikkunassa
- Tai: Stack Overflow, r/androiddev

**Firebase-ongelmat?**
- Firebase Console: https://console.firebase.google.com
- Dokumentaatio: https://firebase.google.com/docs/android/setup

**Android Studio -ongelmat?**
- Dokumentaatio: https://developer.android.com/studio/intro
- Invalidate Caches auttaa usein!

---

## Lisätiedot

**Projektin rakenne:**
```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/konderi/hapetus/  (Kotlin-koodi)
│   │   ├── res/                        (Resurssit: värit, tekstit, kuvat)
│   │   └── AndroidManifest.xml         (Sovelluksen määrittelyt)
│   ├── build.gradle.kts                (Build-konfiguraatio)
│   └── google-services.json            (Firebase-konfiguraatio)
└── build.gradle.kts                    (Projektin build-konfiguraatio)
```

**Tärkeimmät tiedostot:**
- `Color.kt` - Värimaailma (vastaa nyt verkkosivua)
- `Theme.kt` - Material Design 3 teema
- `strings.xml` - Kaikki tekstit suomeksi

**Testausvinkit:**
- Käytä **debug**-buildia kehityksessä (nopeampi)
- Käytä **release**-buildia lopulliseen testaukseen (optimoitu)
- Pidä Logcat auki kehittäessäsi
- Testaa sekä pienellä että isolla fontilla (Asetukset → Suuri fontti)

Onnea testaukseen! 🚀
