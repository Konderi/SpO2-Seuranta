# Hapetus iOS Application

**Native iOS app for health monitoring**

## 📋 Status: Planned (Phase 3)

This directory will contain the native iOS application for the Hapetus health monitoring platform.

---

## 🎯 Planned Features

### Core Functionality
- 📊 Daily SpO2 and heart rate measurements
- 🏃 Exercise tracking (before/after)
- 📈 Charts and statistics
- ⚠️ Smart alerts and notifications
- 🔐 Apple Sign-In / Google Sign-In
- 🔄 Real-time sync with cloud
- 📴 Offline support
- 🍎 HealthKit integration

### Design
- SwiftUI for modern, declarative UI
- Apple Human Interface Guidelines
- SF Symbols for icons
- SF Pro Display/Text fonts
- Consistent with Android and web design language

---

## 🏗️ Planned Technology Stack

```yaml
Language: Swift 5.9+
UI Framework: SwiftUI
Architecture: MVVM + Clean Architecture
Database: CoreData + CloudKit
Authentication: Firebase Auth
Backend: Firebase Firestore
Health: HealthKit
Minimum iOS: iOS 16+
Target iOS: iOS 17+
```

---

## 📂 Planned Structure

```
ios/
├── Hapetus/
│   ├── App/
│   │   └── HapetusApp.swift
│   │
│   ├── Core/
│   │   ├── Domain/          # Models & entities
│   │   ├── Data/            # Repositories & data sources
│   │   └── DI/              # Dependency injection
│   │
│   ├── Features/
│   │   ├── Auth/
│   │   ├── Daily/
│   │   ├── Exercise/
│   │   ├── Reports/
│   │   └── Settings/
│   │
│   ├── Shared/
│   │   ├── Components/      # Reusable UI components
│   │   ├── Extensions/
│   │   └── Utilities/
│   │
│   └── Resources/
│       ├── Assets.xcassets
│       ├── Localization/
│       └── Info.plist
│
├── HapetusTests/
├── HapetusUITests/
└── Hapetus.xcodeproj
```

---

## 🎨 Design System

Will follow the Hapetus design system with iOS-specific adaptations:
- **[View Design System →](../shared/design/DESIGN_SYSTEM.md)**

### iOS-Specific Considerations
- Native iOS design patterns
- SF Symbols for icons
- Dynamic Type support
- Dark Mode support
- Haptic feedback
- Accessibility (VoiceOver, Dynamic Type)

---

## 🍎 HealthKit Integration

### Features
- Read SpO2 data from Apple Watch
- Read heart rate data
- Write measurement data to Health app
- Request appropriate permissions
- Privacy-first approach

---

## 🚀 Development Roadmap

### Phase 3.1: Project Setup
- [ ] Create Xcode project
- [ ] Configure Firebase SDK
- [ ] Set up SwiftUI architecture
- [ ] Design system implementation
- [ ] Component library

### Phase 3.2: Core Features
- [ ] Authentication (Apple Sign-In / Google)
- [ ] Daily measurements
- [ ] Exercise tracking
- [ ] Data persistence (CoreData)

### Phase 3.3: Cloud Sync
- [ ] Firebase Firestore integration
- [ ] Real-time sync
- [ ] Offline support
- [ ] Conflict resolution

### Phase 3.4: Advanced Features
- [ ] Charts and statistics
- [ ] HealthKit integration
- [ ] Push notifications
- [ ] Alerts and reminders

### Phase 3.5: Polish & Launch
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] App Store preparation
- [ ] TestFlight beta
- [ ] App Store submission

---

## 📖 Resources

### Apple Documentation
- [SwiftUI](https://developer.apple.com/xcode/swiftui/)
- [HealthKit](https://developer.apple.com/documentation/healthkit)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Firebase iOS
- [Firebase iOS SDK](https://firebase.google.com/docs/ios/setup)
- [Firestore iOS](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Auth iOS](https://firebase.google.com/docs/auth/ios/start)

---

## 🤝 Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**Last Updated**: February 11, 2026  
**Status**: 📋 Planned  
**Target Start**: Q2 2026  
**Target Launch**: Q3 2026
