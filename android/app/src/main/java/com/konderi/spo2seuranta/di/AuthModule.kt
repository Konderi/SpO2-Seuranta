package com.konderi.spo2seuranta.di

import android.content.Context
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for authentication dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object AuthModule {
    
    // Firebase Web Client ID for requesting ID tokens
    // This is from your google-services.json (Web client, not Android client)
    private const val FIREBASE_WEB_CLIENT_ID = "511544546057-t99nkjq6ni0h1dr9lm0bk40713esetpl.apps.googleusercontent.com"
    
    @Provides
    @Singleton
    fun provideGoogleSignInOptions(): GoogleSignInOptions {
        return GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(FIREBASE_WEB_CLIENT_ID)  // Critical: Request Firebase ID token
            .requestEmail()
            .requestId()
            .requestProfile()
            .build()
    }
    
    @Provides
    @Singleton
    fun provideGoogleSignInClient(
        @ApplicationContext context: Context,
        options: GoogleSignInOptions
    ): GoogleSignInClient {
        return GoogleSignIn.getClient(context, options)
    }
}
