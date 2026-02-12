package com.konderi.spo2seuranta.presentation.auth

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
        checkAuthStatus()
    }
    
    fun getSignInClient(): GoogleSignInClient = googleSignInClient
    
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
                
                if (shouldUpdate) {
                    _authState.value = newState
                }
            }
        }
    }
    
    fun handleSignInResult(account: GoogleSignInAccount?) {
        viewModelScope.launch {
            if (account != null) {
                try {
                    // Get ID token from Google Sign-In
                    val idToken = account.idToken
                    
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
                            
                            settingsRepository.updateUserInfo(
                                userId = userId,
                                userName = userName,
                                userEmail = userEmail
                            )
                            
                            // Update state to authenticated
                            _authState.value = AuthState.Authenticated(
                                userId = userId,
                                userName = userName,
                                userEmail = userEmail
                            )
                        } else {
                            _authState.value = AuthState.Error("Failed to get Firebase user")
                        }
                    } else {
                        // No ID token - authentication failed
                        _authState.value = AuthState.Error("Failed to get authentication token")
                    }
                } catch (e: Exception) {
                    // Firebase authentication failed
                    _authState.value = AuthState.Error("Authentication failed: ${e.message}")
                }
            } else {
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
