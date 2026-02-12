# SpO2 Monitoring Application - Copilot Instructions

## Project Overview
Professional Native Android application for SpO2 and heart rate monitoring, designed for older users with respiratory conditions (COPD, etc.).

## Technology Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose + Material Design 3
- **Architecture**: MVVM + Clean Architecture
- **Database**: Room (local storage) + Cloud sync via Retrofit
- **Backend API**: Cloudflare Workers + D1 (https://api.hapetus.info)
- **Authentication**: Google Sign-In + Firebase Auth
- **Target**: Android API 26+ (optimized for API 34+)

## Key Features
1. **Daily Measurements**: SpO2 (50-100%), Heart Rate, Notes, Auto date/time
2. **Exercise Measurements**: Before/After measurements with exercise details
3. **Reports & Statistics**: 7-day averages, trend graphs, multiple time ranges
4. **Settings**: Configurable alert thresholds, large font option
5. **Google Authentication**: User identification and cloud data sync
6. **Cloud Sync**: Automatic synchronization with backend API
7. **Offline-First**: Full functionality without internet, syncs when online
8. **Multi-Device**: Data accessible across all devices (Android, Web)

## Design Principles
- **Accessibility First**: Large touch targets, high contrast, clear typography
- **Simplicity**: Minimal navigation, intuitive workflows for older users
- **Professional**: Award-winning visual appearance, Material Design 3
- **Safety**: Configurable alerts for low SpO2 values
- **Offline-First**: Always works, syncs in background

## Project Status
✅ Phase 1: Native Android application with local database
✅ Phase 2: Backend API integration with cloud sync
⏳ Phase 3: Website deployment for web access

## Development Guidelines
- Follow Material Design 3 guidelines strictly
- Ensure all UI elements are accessible for older users
- Use Finnish language for UI strings (prepare for localization)
- Implement proper error handling and data validation
- Write clean, documented, maintainable code
- Maintain offline-first architecture (local Room DB is primary)
