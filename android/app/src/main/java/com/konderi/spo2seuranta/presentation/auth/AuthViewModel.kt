package com.konderi.spo2seuranta.presentation.auth

import android.util.Log
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
                
                // Only update if state actually changed to avoid unnecessary recompositions
                if (_authState.value::class != newState::class) {
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
                
                Log.d("AuthViewModel", "Saving user info: userId=$userId, userName=$userName, email=$userEmail")
                
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
                
                Log.d("AuthViewModel", "Auth state updated to Authenticated")
            } else {
                Log.w("AuthViewModel", "Account is null, staying NotAuthenticated")
                _authState.value = AuthState.NotAuthenticated
            }
        }
    }
    
    fun signOut() {
        viewModelScope.launch {
            googleSignInClient.signOut().addOnCompleteListener {
                viewModelScope.launch {
                    settingsRepository.clearUserInfo()
                    _authState.value = AuthState.NotAuthenticated
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
