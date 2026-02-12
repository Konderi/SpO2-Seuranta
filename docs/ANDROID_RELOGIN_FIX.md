# Android Re-Login Fix

**Date:** 12.2.2026  
**Status:** ✅ Complete  
**Commit:** e0f0747

## Problem

After logging out in the Android app, users could not log back in without killing and restarting the application. The authentication screen would not appear after logout, leaving users stuck.

## User Impact

**Before Fix:**
1. User logs in successfully ✅
2. User navigates to Settings → Kirjaudu ulos ✅
3. Logout completes ✅
4. User is stuck - no way to log back in ❌
5. User must force-close the app ❌
6. User reopens app ✅
7. Auth screen appears and user can log in ✅

**After Fix:**
1. User logs in successfully ✅
2. User navigates to Settings → Kirjaudu ulos ✅
3. Logout completes ✅
4. Auth screen automatically appears ✅
5. User clicks "Kirjaudu Google-tilillä" ✅
6. User logs in successfully ✅

## Root Cause Analysis

### Issue 1: Navigation Flow (AppNavigation.kt)

**Problem Code:**
```kotlin
when (authState) {
    is AuthState.Loading -> { LoadingScreen() }
    is AuthState.NotAuthenticated -> { AuthScreen() }
    is AuthState.Authenticated, is AuthState.Error -> { MainApp() }
}
```

**Issues:**
- `Error` state was grouped with `Authenticated` state
- If auth error occurred, app would still show MainApp instead of AuthScreen
- Navigation didn't properly re-evaluate when state changed from `Authenticated` → `NotAuthenticated`

### Issue 2: Auth State Management (AuthViewModel.kt)

**Problem Code:**
```kotlin
private fun checkAuthStatus() {
    viewModelScope.launch {
        settingsRepository.userSettings.collect { settings ->
            // Only update if we're still in Loading or NotAuthenticated state
            if (_authState.value is AuthState.Loading || 
                _authState.value is AuthState.NotAuthenticated) {
                _authState.value = if (!settings.userId.isNullOrEmpty()) {
                    AuthState.Authenticated(...)
                } else {
                    AuthState.NotAuthenticated
                }
            }
        }
    }
}
```

**Issues:**
- Conditional update blocked re-authentication after logout
- Once in `Authenticated` state, wouldn't update back to `NotAuthenticated`
- `settingsRepository.userSettings` changes were ignored if already authenticated

## Solution

### Fix 1: Corrected Navigation Flow

**New Code (AppNavigation.kt):**
```kotlin
when (authState) {
    is AuthState.Loading -> {
        LoadingScreen()
    }
    is AuthState.NotAuthenticated, is AuthState.Error -> {
        // Show auth screen for both not authenticated and error states
        AuthScreen(authViewModel = authViewModel)
    }
    is AuthState.Authenticated -> {
        MainApp(authViewModel = authViewModel)
    }
}
```

**Improvements:**
- Error state now correctly shows auth screen
- `Authenticated` state exclusively shows main app
- Clear separation of states ensures proper navigation
- `authViewModel` passed to `MainApp` for proper recomposition

### Fix 2: Improved Auth State Management

**New Code (AuthViewModel.kt):**
```kotlin
private fun checkAuthStatus() {
    viewModelScope.launch {
        settingsRepository.userSettings.collect { settings ->
            // Update auth state based on user settings
            // Always update to ensure proper re-authentication after logout
            val newState = if (!settings.userId.isNullOrEmpty()) {
                AuthState.Authenticated(
                    userId = settings.userId,
                    userName = settings.userName,
                    userEmail = settings.userEmail
                )
            } else {
                AuthState.NotAuthenticated
            }
            
            // Only update if state actually changed to avoid unnecessary recompositions
            if (_authState.value::class != newState::class) {
                _authState.value = newState
            }
        }
    }
}
```

**Improvements:**
- Removed conditional restriction on state updates
- Always monitors user settings changes
- Updates state whenever authentication status changes
- Optimized to prevent unnecessary recompositions (only updates when state class changes)
- Clear logic: has userId → Authenticated, no userId → NotAuthenticated

## Technical Details

### Authentication Flow

**Login:**
```
1. User clicks "Kirjaudu Google-tilillä"
2. Google Sign-In activity launches
3. handleSignInResult() called with account
4. User info saved to settingsRepository
5. checkAuthStatus() observes settings change
6. newState = Authenticated (userId exists)
7. _authState.value updated
8. AppNavigation recomposes → shows MainApp()
```

**Logout:**
```
1. User clicks "Kirjaudu ulos" in Settings
2. signOut() called on AuthViewModel
3. googleSignInClient.signOut() executed
4. settingsRepository.clearUserInfo() called
5. checkAuthStatus() observes settings change
6. newState = NotAuthenticated (userId null)
7. _authState.value updated
8. AppNavigation recomposes → shows AuthScreen()
```

**Re-Login:**
```
1. AuthScreen already visible (from logout)
2. User clicks "Kirjaudu Google-tilillä"
3. Google Sign-In flow same as first login
4. Works correctly because:
   - checkAuthStatus() actively monitoring
   - No conditional blocks preventing update
   - State properly transitions NotAuthenticated → Authenticated
```

### State Diagram

```
┌─────────────┐
│   Loading   │ (Initial state)
└──────┬──────┘
       │
       ├──────────┐
       ↓          ↓
┌─────────────┐  ┌─────────────────┐
│NotAuthentic.│←→│  Authenticated  │
└─────────────┘  └─────────────────┘
       ↑                  │
       │                  │
       │         ┌────────┴────────┐
       │         │     signOut()   │
       └─────────┤  clearUserInfo()│
                 └─────────────────┘
```

### Files Modified

**1. AppNavigation.kt**
```kotlin
// Before
is AuthState.Authenticated, is AuthState.Error -> { MainApp() }

// After
is AuthState.NotAuthenticated, is AuthState.Error -> { AuthScreen() }
is AuthState.Authenticated -> { MainApp(authViewModel) }
```

**2. AuthViewModel.kt**
```kotlin
// Before
if (_authState.value is AuthState.Loading || 
    _authState.value is AuthState.NotAuthenticated) {
    _authState.value = /* calculate state */
}

// After
val newState = /* calculate state */
if (_authState.value::class != newState::class) {
    _authState.value = newState
}
```

## Testing

### Manual Test Cases

**✅ Test 1: Initial Login**
- Open app
- See auth screen
- Click Google Sign-In
- Complete authentication
- Verify main app shows

**✅ Test 2: Logout**
- From main app, go to Settings
- Click "Kirjaudu ulos"
- Verify auth screen appears
- Verify user info cleared

**✅ Test 3: Re-Login Without Killing App**
- After logout (auth screen visible)
- Click Google Sign-In
- Complete authentication
- Verify main app shows
- Verify user info restored

**✅ Test 4: App Restart**
- Close app (don't kill)
- Reopen app
- If logged in: main app shows
- If logged out: auth screen shows

**✅ Test 5: Error Handling**
- If sign-in fails/cancelled
- Verify auth screen remains visible
- Verify can retry sign-in

### Automated Tests Needed

```kotlin
@Test
fun `auth state flows correctly through login-logout-login cycle`() {
    // Given
    val viewModel = AuthViewModel(mockSignInClient, mockSettingsRepo)
    
    // When: Initial state
    assertEquals(AuthState.Loading, viewModel.authState.value)
    
    // When: No user in settings
    mockSettingsRepo.emitUserSettings(emptySettings)
    assertEquals(AuthState.NotAuthenticated, viewModel.authState.value)
    
    // When: User logs in
    viewModel.handleSignInResult(mockGoogleAccount)
    assertEquals(AuthState.Authenticated::class, viewModel.authState.value::class)
    
    // When: User logs out
    viewModel.signOut()
    advanceUntilIdle()
    assertEquals(AuthState.NotAuthenticated, viewModel.authState.value)
    
    // When: User logs in again
    viewModel.handleSignInResult(mockGoogleAccount)
    assertEquals(AuthState.Authenticated::class, viewModel.authState.value::class)
}
```

## Benefits

✅ **No More App Killing** - Users can log in/out freely  
✅ **Better UX** - Smooth authentication flow  
✅ **Proper State Management** - Auth state always reflects reality  
✅ **Error Handling** - Errors show auth screen for retry  
✅ **Code Quality** - Clearer logic, better separation of concerns  

## Future Enhancements

### 1. Remember Last Account
```kotlin
// Save last signed-in account
preferences.putString("last_account_email", account.email)

// On logout, suggest same account
val lastEmail = preferences.getString("last_account_email")
googleSignInClient.signInIntent.putExtra("suggest_email", lastEmail)
```

### 2. Session Timeout
```kotlin
// Auto-logout after inactivity
val TIMEOUT_MINUTES = 30
val lastActivity = preferences.getLong("last_activity")
if (System.currentTimeMillis() - lastActivity > TIMEOUT_MINUTES * 60 * 1000) {
    signOut()
}
```

### 3. Biometric Re-Authentication
```kotlin
// Quick re-auth with fingerprint/face
if (hasStoredCredentials() && biometricAvailable()) {
    showBiometricPrompt()
} else {
    showGoogleSignIn()
}
```

### 4. Multiple Account Support
```kotlin
// Switch between accounts without full re-auth
val accounts = googleSignInClient.silentSignIn().await()
showAccountPicker(accounts)
```

## Related Documentation

- [FIX_GOOGLE_SIGNIN.md](./FIX_GOOGLE_SIGNIN.md) - Initial Google Sign-In setup
- [SHA1_SETUP.md](./SHA1_SETUP.md) - SHA-1 fingerprint configuration
- [QUICK_START.md](../android/QUICK_START.md) - Android app quick start guide

## Conclusion

This fix resolves a critical usability issue that prevented users from logging back in after logout. The solution ensures proper auth state management and navigation flow, allowing seamless login/logout cycles without requiring app restart.

The implementation is clean, maintainable, and follows Android best practices for state management with Jetpack Compose and Flow.
