package com.konderi.spo2seuranta.presentation.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.konderi.spo2seuranta.data.repository.SettingsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for authentication
 */
@HiltViewModel
class AuthViewModel @Inject constructor(
    private val googleSignInClient: GoogleSignInClient,
    private val settingsRepository: SettingsRepository
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
                val userId = account.id ?: account.email ?: "unknown"
                val userName = account.displayName ?: "User"
                val userEmail = account.email ?: ""
                
                settingsRepository.updateUserInfo(
                    userId = userId,
                    userName = userName,
                    userEmail = userEmail
                )
                
                // Immediately update state
                _authState.value = AuthState.Authenticated(
                    userId = userId,
                    userName = userName,
                    userEmail = userEmail
                )
            } else {
                _authState.value = AuthState.NotAuthenticated
            }
        }
    }
    
    fun signOut() {
        viewModelScope.launch {
            // First update the state to NotAuthenticated
            _authState.value = AuthState.NotAuthenticated
            
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
