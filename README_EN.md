# SpO2 Seuranta - Blood Oxygen & Heart Rate Monitoring App

**[🇫🇮 Lue suomeksi](README.md)**

<div align="center">
  
  **Professional Native Android Application for SpO2 and Heart Rate Tracking**
  
  [![Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://www.android.com/)
  [![Kotlin](https://img.shields.io/badge/Language-Kotlin-blue.svg)](https://kotlinlang.org/)
  [![Jetpack Compose](https://img.shields.io/badge/UI-Jetpack%20Compose-4285F4.svg)](https://developer.android.com/jetpack/compose)
  [![Material Design 3](https://img.shields.io/badge/Design-Material%203-757575.svg)](https://m3.material.io/)
  
</div>

## 📋 Overview

SpO2 Seuranta is a professional-grade Android application designed for tracking blood oxygen saturation (SpO2) and heart rate measurements. Specifically built for older users with respiratory conditions (COPD, etc.), the app features an accessible, intuitive interface with large touch targets and clear typography.

### Key Features

- **📊 Daily Measurements** - Quick entry of SpO2 (50-100%) and heart rate with automatic timestamping
- **🏃 Exercise Tracking** - Before/after measurements with exercise details
- **📈 Advanced Reports** - 7-day averages, trend analysis, and graphical charts
- **⚠️ Smart Alerts** - Configurable low oxygen warnings with customizable thresholds
- **🔐 Google Sign-In** - Secure authentication with multi-device sync
- **♿ Accessibility First** - Large font option, high contrast, simplified navigation
- **🎨 Professional Design** - Modern Material Design 3 with medical-grade appearance
- **📊 Visual Charts** - Trend graphs with Vico Charts library
- **🇫🇮 Finnish Language** - Full Finnish UI (prepared for localization)

## 🏗️ Architecture

### Technology Stack

- **Language**: Kotlin 1.9.22
- **UI Framework**: Jetpack Compose + Material Design 3
- **Architecture**: MVVM + Clean Architecture
- **Database**: Room 2.6.1 (local storage)
- **Dependency Injection**: Hilt
- **Authentication**: Firebase Auth + Google Sign-In
- **State Management**: Kotlin Flows + StateFlow
- **Navigation**: Jetpack Navigation Compose
- **Charts**: Vico Charts 1.13.1
- **Min SDK**: 26 (Android 8.0)
- **Target SDK**: 34 (Android 14)

### Project Structure

```
app/
├── src/main/
│   ├── java/com/konderi/spo2seuranta/
│   │   ├── data/
│   │   │   ├── local/          # Room database, DAOs, Converters
│   │   │   └── repository/     # Repository implementations
│   │   ├── domain/
│   │   │   └── model/          # Domain models (entities)
│   │   ├── di/                 # Hilt dependency injection modules
│   │   ├── presentation/
│   │   │   ├── auth/           # Authentication screen & ViewModel
│   │   │   ├── daily/          # Daily measurements
│   │   │   ├── exercise/       # Exercise measurements
│   │   │   ├── reports/        # Statistics, charts, and reports
│   │   │   ├── settings/       # Settings screen
│   │   │   ├── components/     # Reusable UI components & charts
│   │   │   ├── navigation/     # Navigation setup
│   │   │   └── theme/          # Material 3 theme, colors, typography
│   │   └── SpO2Application.kt  # Application class
│   └── res/                    # Resources (strings, themes, etc.)
└── build.gradle.kts
```

## 🚀 Getting Started

### Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 (required for Gradle 8.2)
- Android SDK 34
- Minimum Android API 26 (Android 8.0)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SpO2-Seuranta.git
   cd SpO2-Seuranta
   ```

2. **Configure Google Sign-In**
   
   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Add your Android app to the Firebase project:
      - Package name: `com.konderi.spo2seuranta`
      - SHA-1: Get debug keystore fingerprint:
        ```bash
        keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
        ```
   
   c. Download `google-services.json` and place it in `app/` directory
   
   d. Enable Google Sign-In in Firebase Authentication
   
   e. Add SHA-1 fingerprint to Firebase Console (Project Settings → Your Apps)

3. **Configure Gradle JDK**
   - Open Android Studio
   - File → Settings → Build, Execution, Deployment → Build Tools → Gradle
   - Set "Gradle JDK" to version 17
   - Click Apply → OK

4. **Build the project**
   ```bash
   ./gradlew build
   ```

5. **Run on device/emulator**
   - Open project in Android Studio
   - Click Run ▶️ or press `Shift + F10`

## 📱 Features in Detail

### Daily Measurements

- **Quick Entry**: Simple form for SpO2 and heart rate
- **Auto Timestamp**: Automatically records date and time
- **Notes Field**: Optional notes for each measurement
- **Validation**: Real-time input validation (SpO2: 50-100%, HR: 30-220 BPM)
- **History View**: Recent measurements displayed below entry form
- **Low Oxygen Alerts**: Automatic warning when SpO2 drops below threshold
- **Color-Coded Cards**: Visual distinction with soft indigo containers

### Exercise Measurements

- **Before/After Tracking**: Separate measurements before and after exercise
- **Exercise Details**: Custom description field (e.g., "Walking 15 minutes")
- **Change Calculation**: Automatic calculation of SpO2/heart rate changes
- **Significant Drop Warning**: Alert when SpO2 drops >5% during exercise
- **Historical Data**: View all past exercise sessions
- **Trend Analysis**: Compare before/after values over time

### Reports & Statistics

**Time Periods**:
- 7 days (Viikko)
- 30 days (Kuukausi)
- 3 months (3 kuukautta)
- All time (Kaikki)

**View Modes**:
- **Statistics (Tilastot)**: Average SpO2, average heart rate, min/max values, low oxygen count
- **List (Lista)**: Chronological list of all measurements
- **Graph (Kuvaaja)**: Visual trend charts with date labels

**Measurement Types**:
- Daily measurements (Päivittäinen)
- Exercise measurements (Liikunta)

**Chart Features**:
- Line charts powered by Vico Charts library
- Date-formatted X-axis (dd.MM)
- Automatic scaling for Y-axis
- Color-coded legends for before/after comparison
- Smooth animations and interactions

### Settings

- **Alert Threshold**: Customizable low SpO2 warning level (70-95%)
- **Large Font Mode**: Accessibility option for visually impaired users
- **Account Management**: View signed-in account, sign out option
- **App Information**: Version and description

## 🎨 Design Principles

### Accessibility for Older Users

1. **Large Touch Targets**: All buttons minimum 64dp height
2. **High Contrast**: Clear distinction between elements
3. **Floating Navigation**: Modern bottom navigation bar with rounded corners
4. **Large Fonts**: Optional large typography set
5. **Clear Labels**: Descriptive text for all inputs
6. **Minimal Complexity**: Straightforward workflows
7. **Professional Colors**: Soft indigo/lavender instead of harsh cyan

### Material Design 3

- **Dynamic Color Scheme**: Medical blue primary (#1565C0), soft indigo secondary (#5C6BC0)
- **Elevated Cards**: Rounded corners (16-20dp) with subtle shadows
- **Consistent Spacing**: 8dp grid system with generous padding
- **Professional Appearance**: Clean, medical-grade UI
- **Smooth Animations**: Material motion principles
- **Floating Elements**: Bottom bar with transparency and elevation

## 🔒 Data & Privacy

### Local Storage

- All measurements stored locally using Room database
- No data transmitted without user authentication
- Offline-first architecture
- Room TypeConverters for LocalDateTime

### Cloud Sync (with Google Sign-In)

- User data associated with Google account ID
- Phase 2: Sync to Cloudflare database
- Users control their data through sign-out

## 📊 Database Schema

### Daily Measurements
```kotlin
@Entity(tableName = "daily_measurements")
data class DailyMeasurement(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val spo2: Int,              // 50-100
    val heartRate: Int,         // 30-220
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null  // Google account ID
)
```

### Exercise Measurements
```kotlin
@Entity(tableName = "exercise_measurements")
data class ExerciseMeasurement(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val spo2Before: Int,
    val heartRateBefore: Int,
    val spo2After: Int,
    val heartRateAfter: Int,
    val exerciseDetails: String = "",
    val notes: String = "",
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val userId: String? = null
)
```

## 🔮 Roadmap

### Phase 1 (Current - Completed) ✅
- ✅ Native Android app with full features
- ✅ Local database storage with Room
- ✅ Google Sign-In authentication
- ✅ Daily and exercise measurements
- ✅ Statistics and reports with 4 time periods
- ✅ Configurable alerts
- ✅ Professional Material Design 3 UI
- ✅ Graphical trend charts with Vico
- ✅ Floating bottom navigation bar
- ✅ Accessibility features (large fonts)

### Phase 2 (Planned) 🔜
- ⏳ Cloudflare Workers backend API
- ⏳ Cloudflare D1 database for cloud storage
- ⏳ Cloudflare Pages website for data viewing
- ⏳ Real-time sync across devices
- ⏳ Advanced data visualization on web
- ⏳ Export to PDF reports
- ⏳ Doctor/caregiver sharing features
- ⏳ Multi-language support (English, Swedish)

## 🧪 Testing

Run unit tests:
```bash
./gradlew test
```

Run instrumented tests:
```bash
./gradlew connectedAndroidTest
```

## 📝 Development Notes

### Adding New Features

1. Follow MVVM architecture pattern
2. Create models in `domain/model`
3. Add database entities and DAOs in `data/local`
4. Implement repository in `data/repository`
5. Create ViewModel in `presentation/[feature]`
6. Build UI with Jetpack Compose
7. Update navigation if needed
8. Follow Material Design 3 guidelines

### Code Style

- Follow [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Use meaningful variable names in Finnish for UI strings
- Document complex logic with comments
- Keep functions small and focused
- Use Kotlin idioms (data classes, sealed classes, flows)
- Prefer Compose state management

### Important Notes

- **JDK Version**: Must use Java 17 (not 21) for Gradle 8.2 compatibility
- **Vico Charts**: Use `ChartEntryModelProducer` with `FloatEntry(x, y)` format
- **X-axis Precision**: Maximum 2 decimal places for chart x values
- **Flow Usage**: Use `.first()` for one-time reads, not `.collect()`
- **Firebase**: SHA-1 fingerprint must match between app and Firebase Console

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 👤 Author

**Konderi Development**

## 🙏 Acknowledgments

- Material Design 3 guidelines
- Android Jetpack libraries
- Vico Charts library (patrykandpatrick)
- Firebase/Google Sign-In
- Room persistence library
- Kotlin Coroutines & Flow
- Hilt dependency injection

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ for better health monitoring**
