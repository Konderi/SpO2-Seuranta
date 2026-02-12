package com.konderi.spo2seuranta.di

import com.google.firebase.auth.FirebaseAuth
import com.konderi.spo2seuranta.data.remote.ApiService
import com.konderi.spo2seuranta.data.remote.RetrofitClient
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for network dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideFirebaseAuth(): FirebaseAuth {
        return FirebaseAuth.getInstance()
    }
    
    @Provides
    @Singleton
    fun provideApiService(auth: FirebaseAuth): ApiService {
        return RetrofitClient.createApiService(auth)
    }
}
