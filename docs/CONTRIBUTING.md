# SpO2 Seuranta - Contributing Guide

## 🤝 Welcome Contributors

Thank you for your interest in contributing to SpO2 Seuranta! This guide will help you get started.

## 🎯 Areas for Contribution

### High Priority
- 📊 **Chart Implementation** - Add graph visualization using Vico library
- 🌍 **Localization** - Add English and Swedish translations
- 🧪 **Unit Tests** - Increase test coverage
- ♿ **Accessibility** - Enhance TalkBack support
- 📱 **Tablet UI** - Optimize layout for larger screens

### Feature Ideas
- Export measurements to CSV
- Dark theme refinements
- Data backup/restore functionality
- Medication tracking integration
- Doctor appointment reminders
- Family member sharing
- Widget for home screen

### Bug Fixes
- Check issues tab on GitHub
- Report new bugs with reproduction steps

## 📋 Contribution Process

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/SpO2-Seuranta.git
cd SpO2-Seuranta
git checkout -b feature/your-feature-name
```

### 2. Setup Development Environment
Follow [SETUP.md](./SETUP.md) for complete setup instructions.

### 3. Code Guidelines

#### Kotlin Style
- Follow [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html)
- Use meaningful variable names
- Add KDoc comments for public functions
- Keep functions small and focused

#### Architecture Rules
- Follow MVVM pattern
- UI logic in ViewModels, not Composables
- Business logic in repositories
- Domain models should be pure Kotlin

#### Compose Best Practices
```kotlin
// Good: Stateless composable
@Composable
fun MeasurementCard(measurement: DailyMeasurement) { }

// Good: State hoisting
@Composable
fun InputField(
    value: String,
    onValueChange: (String) -> Unit
) { }

// Avoid: UI logic in composable
@Composable
fun BadExample() {
    val data = repository.getData() // ❌ Don't do this
}
```

#### File Organization
```
feature/
├── FeatureScreen.kt        # UI composables
├── FeatureViewModel.kt     # State management
└── FeatureUiState.kt       # UI state data class
```

### 4. Testing

#### Write Unit Tests
```kotlin
@Test
fun `saveMeasurement should update state correctly`() {
    // Given
    val viewModel = DailyMeasurementViewModel(mockRepository, mockSettings)
    
    // When
    viewModel.saveMeasurement(95, 72, "Test")
    
    // Then
    assertTrue(viewModel.uiState.value.saveSuccess)
}
```

#### Run Tests
```bash
./gradlew test
./gradlew connectedAndroidTest
```

### 5. Commit Guidelines

Use conventional commits:
```
feat: Add graph visualization for reports
fix: Correct SpO2 validation range
docs: Update setup instructions
refactor: Simplify measurement card layout
test: Add unit tests for ExerciseViewModel
chore: Update dependencies
```

### 6. Pull Request

1. **Update your branch**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create PR** with:
   - Clear title describing the change
   - Description of what was changed and why
   - Screenshots for UI changes
   - Test results
   - Reference related issues

## 🔍 Code Review Process

### What We Look For
- ✅ Follows architecture patterns
- ✅ Has appropriate tests
- ✅ Code is well-documented
- ✅ UI is accessible
- ✅ No hardcoded strings (use strings.xml)
- ✅ Handles edge cases

### Review Timeline
- Initial review within 2-3 days
- Feedback on requested changes
- Approval and merge

## 📝 Documentation

When adding features:
1. Update README.md if needed
2. Add KDoc comments to public functions
3. Update SETUP.md for new dependencies
4. Create example usage if complex

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Android Version: 
- Device Model:
- App Version:

## Screenshots
If applicable
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
What feature would you like to see?

## Use Case
Why is this feature needed?

## Proposed Solution
How could this be implemented?

## Alternatives Considered
Any alternative approaches?
```

## 🎨 UI/UX Guidelines

### Material Design 3
- Follow [Material 3 guidelines](https://m3.material.io/)
- Use theme colors, not hardcoded values
- Maintain consistent spacing (8dp grid)
- Ensure 48dp minimum touch targets

### Accessibility
- All images need contentDescription
- Buttons need clear labels
- Support large font sizes
- Maintain sufficient color contrast (4.5:1)

### Finnish Language
- All UI strings in Finnish (`strings.xml`)
- Prepare for localization (no hardcoded text)
- Use plural resources where appropriate

## 🧪 Testing Checklist

Before submitting PR:
- [ ] Unit tests pass
- [ ] Instrumented tests pass (if added)
- [ ] Manual testing on real device
- [ ] Tested with large font enabled
- [ ] Tested on API 26 (minimum) and API 34 (target)
- [ ] No new lint warnings
- [ ] ProGuard rules updated if needed

## 📦 Dependencies

### Adding New Dependencies
1. Check license compatibility
2. Verify active maintenance
3. Update `app/build.gradle.kts`
4. Document in README.md
5. Add ProGuard rules if needed

### Current Stack
- Jetpack Compose (UI)
- Room (Database)
- Hilt (DI)
- Navigation Compose
- Vico Charts (planned)
- Google Sign-In

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Credited in release notes
- Appreciated for their work! 🎉

## ❓ Questions?

- Open a discussion on GitHub
- Check existing issues
- Review documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to better health monitoring!** ❤️
