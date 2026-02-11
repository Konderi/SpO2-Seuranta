# Hapetus - Professional Health Monitoring Platform

<div align="center">
  
  **🫁 Professional SpO2 and Heart Rate Monitoring**
  
  [![Android](https://img.shields.io/badge/Platform-Android-green.svg)](https://www.android.com/)
  [![Website](https://img.shields.io/badge/Platform-Web-blue.svg)](https://hapetus.info)
  [![iOS](https://img.shields.io/badge/Platform-iOS-lightgrey.svg?logo=apple)](https://www.apple.com/ios/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  [🌐 Website](https://hapetus.info) • [📱 Android App](android/) • [📖 Documentation](shared/docs/) • [🎨 Design System](shared/design/)
  
</div>

---

## 🎯 Project Overview

**Hapetus** (Finnish: Oxygenation) is a professional, multi-platform health monitoring system for tracking blood oxygen saturation (SpO2) and heart rate. Designed specifically for individuals with respiratory conditions (COPD, asthma) and elderly users who need simple, reliable health monitoring.

### 🌟 Core Values

- **🏥 Medical-Grade Quality** - Professional, trustworthy, accurate
- **♿ Accessibility First** - Designed for all ages, especially elderly users
- **📱 Multi-Platform** - Seamless experience across web, Android, and iOS
- **🔒 Privacy Focused** - Your health data stays yours
- **🎨 Beautiful Design** - Modern, clean, award-winning aesthetics

---

## 🚀 Project Status

### ✅ Phase 1: Android Application (Complete)
Native Android app with full functionality:
- Daily and exercise measurements
- Real-time charts and statistics  
- Google Sign-In authentication
- Configurable alerts
- Material Design 3 UI
- Offline support

**[📱 View Android App →](android/)**

### 🚧 Phase 2: Website (In Progress)
Professional web application for data viewing and management:
- Modern Next.js with TypeScript
- Real-time synchronization with mobile apps
- Interactive data visualization
- Responsive design (mobile, tablet, desktop)
- Firebase backend integration

**Target Launch**: March 2026

### 📋 Phase 3: iOS Application (Planned)
Native iOS app with feature parity to Android:
- SwiftUI implementation
- HealthKit integration
- Apple Sign-In support
- Consistent design language

**Target Launch**: Q2 2026

---

## 🏗️ Repository Structure

```
SpO2-Seuranta/
├── android/              # Native Android application
│   ├── app/
│   ├── build.gradle.kts
│   └── README.md
│
├── web/                  # Next.js website
│   ├── src/
│   ├── public/
│   └── README.md
│
├── ios/                  # iOS application (future)
│   └── README.md
│
├── backend/              # Cloudflare Workers (if needed)
│   └── README.md
│
├── shared/               # Shared resources
│   ├── docs/            # Documentation
│   │   ├── ARCHITECTURE.md
│   │   └── API_SPEC.md
│   ├── design/          # Design system
│   │   ├── DESIGN_SYSTEM.md
│   │   └── assets/
│   └── api-specs/       # API specifications
│
├── .github/             # GitHub workflows & Copilot instructions
├── docs/                # General documentation
├── README.md            # This file
├── CONTRIBUTING.md      # Contribution guidelines
├── LICENSE              # MIT License
└── .gitignore
```

---

## 🎨 Design System

Hapetus features a professional, modern design language inspired by award-winning agencies like [Halo Lab](https://www.halo-lab.com/):

### Key Design Elements
- **Color Palette**: Medical blue (#2196F3) with semantic health indicators
- **Typography**: Inter font family for clarity and readability
- **Spacing**: 4px base unit with progressive scale
- **Components**: Consistent UI across all platforms
- **Motion**: Purposeful animations that enhance usability
- **Accessibility**: WCAG 2.1 Level AA compliant

**[🎨 View Complete Design System →](shared/design/DESIGN_SYSTEM.md)**

---

## 🏗️ Technical Architecture

### Technology Stack

| Platform | Technologies |
|----------|--------------|
| **Web** | Next.js 14+, TypeScript, Tailwind CSS, Recharts, Firebase |
| **Android** | Kotlin, Jetpack Compose, Material Design 3, Room, Hilt, Firebase |
| **iOS** | Swift, SwiftUI, CoreData, HealthKit (planned) |
| **Backend** | Firebase (Authentication, Firestore, Hosting) |

### Backend: Firebase
- **Authentication**: Google Sign-In with JWT tokens
- **Database**: Cloud Firestore with real-time sync
- **Hosting**: Firebase Hosting for web application
- **Cost**: $0/month for up to 100 users (free tier)

**[📖 View Architecture Details →](shared/docs/ARCHITECTURE.md)**

---

## ✨ Key Features

### 📊 Comprehensive Measurements
- **Daily Tracking**: Quick SpO2 (50-100%) and heart rate entry
- **Exercise Monitoring**: Before/after measurements with exercise details
- **Notes & Context**: Optional notes for each measurement
- **Auto Timestamps**: Automatic date and time recording

### 📈 Advanced Analytics
- **Time Ranges**: View data by week, month, quarter, or all time
- **Statistics**: Averages, min/max values, trend analysis
- **Visual Charts**: Interactive line graphs with date labels
- **Comparison Views**: Before/after exercise comparisons

### ⚠️ Smart Alerts
- **Low Oxygen Warnings**: Configurable threshold (70-95%)
- **Significant Changes**: Alert on drops >5% during exercise
- **Visual Indicators**: Color-coded status (red/orange/green)

### 🔐 Secure Authentication
- **Google Sign-In**: OAuth 2.0 authentication
- **Multi-Device Sync**: Access data from any device
- **Offline Support**: Android app works without internet
- **Privacy First**: Your data, your control

### ♿ Accessibility
- **Large Font Mode**: Enhanced readability for visually impaired
- **High Contrast**: Clear differentiation between elements
- **Simple Navigation**: Intuitive flow for elderly users
- **Touch Targets**: Minimum 48dp for easy tapping

---

## 🚀 Quick Start

### For Users

#### 🌐 Web Application
Visit [hapetus.info](https://hapetus.info)
1. Click "Sign in with Google"
2. Start tracking your health data
3. View reports and statistics

#### 📱 Android Application
1. Download from Google Play Store (coming soon)
2. Or build from source: [Android README](android/README.md)

### For Developers

#### Clone Repository
```bash
git clone https://github.com/Konderi/SpO2-Seuranta.git
cd SpO2-Seuranta
```

#### Android Development
```bash
cd android
# Open in Android Studio
# See android/README.md for setup
```

#### Web Development
```bash
cd web
npm install
npm run dev
# See web/README.md for setup
```

**[📖 Full Development Guide →](CONTRIBUTING.md)**

---

## 📊 Cost Analysis (Firebase)

| Service | Free Tier | Estimated Usage (10 users) | Cost |
|---------|-----------|----------------------------|------|
| Authentication | Unlimited | 10 users | $0 |
| Firestore Reads | 50,000/day | ~500/day | $0 |
| Firestore Writes | 20,000/day | ~100/day | $0 |
| Firestore Storage | 1 GB | <10 MB | $0 |
| Hosting | 10 GB/month | <1 GB/month | $0 |
| **Total** | | | **$0/month** |

**Scalability**: 
- 100 users: Still free ($0/month)
- 1,000 users: ~$10/month
- 10,000 users: ~$110/month

**Recommendation**: Firebase is perfect for your current needs (max 10 users) and will remain free indefinitely.

---

## 🤝 Contributing

We welcome contributions! Whether it's:
- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🎨 Design enhancements
- 💻 Code contributions

**[📖 Read Contributing Guidelines →](CONTRIBUTING.md)**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌐 Links & Resources

### Project Links
- **Website**: [hapetus.info](https://hapetus.info)
- **GitHub**: [github.com/Konderi/SpO2-Seuranta](https://github.com/Konderi/SpO2-Seuranta)
- **Issues**: [GitHub Issues](https://github.com/Konderi/SpO2-Seuranta/issues)

### Documentation
- [Architecture Overview](shared/docs/ARCHITECTURE.md)
- [Design System](shared/design/DESIGN_SYSTEM.md)
- [Android App](android/README.md)
- [Web App](web/README.md)

### Design Inspiration
- [Halo Lab](https://www.halo-lab.com/) - Design inspiration for website
- [Material Design 3](https://m3.material.io/) - Android design system
- [Apple HIG](https://developer.apple.com/design/) - iOS design patterns

---

## 📞 Contact & Support

- **Developer**: Toni Joronen
- **GitHub Issues**: [Report a bug or request a feature](https://github.com/Konderi/SpO2-Seuranta/issues)
- **Website**: [hapetus.info](https://hapetus.info)

---

## 🙏 Acknowledgments

- **Design Inspiration**: [Halo Lab](https://www.halo-lab.com/)
- **Icons**: Material Design Icons
- **Charts**: Recharts (web), Vico Charts (Android)
- **Backend**: Firebase / Google Cloud Platform
- **Community**: Open source contributors worldwide

---

<div align="center">
  
  **Built with ❤️ for better health monitoring**
  
  [⭐ Star this project](https://github.com/Konderi/SpO2-Seuranta) • [🐛 Report Bug](https://github.com/Konderi/SpO2-Seuranta/issues) • [💡 Request Feature](https://github.com/Konderi/SpO2-Seuranta/issues)
  
</div>

---

**Last Updated**: February 11, 2026  
**Version**: 2.0.0 (Multi-platform monorepo)  
**Status**: Phase 1 Complete ✅ | Phase 2 In Progress 🚧 | Phase 3 Planned 📋
