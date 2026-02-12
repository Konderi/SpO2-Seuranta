package com.konderi.spo2seuranta.presentation.auth

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await
import javax.inject.Inject

private const val TAG = "AuthViewModel"

/**
 * ViewModel for authentication with Firebase integration
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val googleSignInClient: GoogleSignInClient,
    private val settingsRepository: SettingsRepository,
    private val firebaseAuth: FirebaseAuth
) : ViewModel() {
    
    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()
    
    init {
        Log.d(TAG, "AuthViewModel initialized")
        checkAuthStatus()
    }
    
    fun getSignInClient(): GoogleSignInClient = googleSignInClient
    
    private fun checkAuthStatus() {
        viewModelScope.launch {
            settingsRepository.userSettings.collect { settings ->
                Log.d(TAG, "checkAuthStatus: userId=${settings.userId}, current state=${_authState.value::class.simpleName}")
                
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
                
                // Update state if it's different
                // Compare by class type for NotAuthenticated/Authenticated transition
                // For Authenticated state, also check if user data changed
                val shouldUpdate = when {
                    _authState.value::class != newState::class -> true
                    newState is AuthState.Authenticated && _authState.value is AuthState.Authenticated -> {
                        val current = _authState.value as AuthState.Authenticated
                        current.userId != newState.userId
                    }
                    else -> false
                }
                
                Log.d(TAG, "checkAuthStatus: shouldUpdate=$shouldUpdate, newState=${newState::class.simpleName}")
                
                if (shouldUpdate) {
                    _authState.value = newState
                    Log.d(TAG, "checkAuthStatus: Updated state to ${newState::class.simpleName}")
                }
            }
        }
    }
    
    fun handleSignInResult(account: GoogleSignInAccount?) {
        Log.d(TAG, "handleSignInResult called: account=${account?.email}")
        viewModelScope.launch {
            if (account != null) {
                try {
                    // Get ID token from Google Sign-In
                    val idToken = account.idToken
                    Log.d(TAG, "handleSignInResult: Got ID token: ${idToken != null}")
                    
                    if (idToken != null) {
                        // Authenticate with Firebase using the Google ID token
                        val credential = GoogleAuthProvider.getCredential(idToken, null)
                        val authResult = firebaseAuth.signInWithCredential(credential).await()
                        
                        // Get Firebase user ID (this is what the API expects!)
                        val firebaseUser = authResult.user
                        if (firebaseUser != null) {
                            val userId = firebaseUser.uid  // Use Firebase UID
                            val userName = account.displayName ?: firebaseUser.displayName ?: "User"
                            val userEmail = account.email ?: firebaseUser.email ?: ""
                            
                            Log.d(TAG, "handleSignInResult: Firebase auth success - userId=$userId, userName=$userName")
                            
                            settingsRepository.updateUserInfo(
                                userId = userId,
                                userName = userName,
                                userEmail = userEmail
                            )
                            
                            Log.d(TAG, "handleSignInResult: User info saved to repository")
                            
                            // Update state to authenticated
                            _authState.value = AuthState.Authenticated(
                                userId = userId,
                                userName = userName,
                                userEmail = userEmail
                            )
                            
                            Log.d(TAG, "handleSignInResult: State updated to Authenticated")
                        } else {
                            Log.e(TAG, "handleSignInResult: Firebase user is null")
                            _authState.value = AuthState.Error("Failed to get Firebase user")
                        }
                    } else {
                        // No ID token - authentication failed
                        Log.e(TAG, "handleSignInResult: No ID token")
                        _authState.value = AuthState.Error("Failed to get authentication token")
                    }
                } catch (e: Exception) {
                    // Firebase authentication failed
                    Log.e(TAG, "handleSignInResult: Firebase auth failed", e)
                    _authState.value = AuthState.Error("Authentication failed: ${e.message}")
                }
            } else {
                Log.d(TAG, "handleSignInResult: Account is null")
                _authState.value = AuthState.NotAuthenticated
            }
        }
    }
    
    fun signOut() {
        viewModelScope.launch {
            // First update the state to NotAuthenticated
            _authState.value = AuthState.NotAuthenticated
            
            // Sign out from Firebase
            firebaseAuth.signOut()
            
            // Then clear Google Sign-In and user data
            googleSignInClient.signOut().addOnCompleteListener {
                viewModelScope.launch {
                    settingsRepository.clearUserInfo()
                }
            }
        }
    }
}

sealed class AuthState {
    object Loading : AuthState()
    object NotAuthenticated : AuthState()
    data class Authenticated(
        val userId: String?,
        val userName: String?,
        val userEmail: String?
    ) : AuthState()
    data class Error(val message: String) : AuthState()
}
