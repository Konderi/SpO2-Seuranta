package com.konderi.spo2seuranta.data.remote

import android.util.Log
import com.google.firebase.auth.FirebaseAuth
import com.konderi.hapetus.BuildConfig
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Retrofit client singleton for API communication
 */
object RetrofitClient {
    
    private const val BASE_URL = BuildConfig.API_BASE_URL
    
    /**
     * OkHttp interceptor to add Firebase auth token to every request
     */
    private class AuthInterceptor(private val auth: FirebaseAuth) : Interceptor {
        override fun intercept(chain: Interceptor.Chain): okhttp3.Response {
            val original = chain.request()
            
            val currentUser = auth.currentUser
            Log.d("SYNC_TEST", "🔑 Firebase user: ${currentUser?.uid ?: "NULL"}")
            
            // Get Firebase ID token
            val token = runBlocking {
                try {
                    auth.currentUser?.getIdToken(false)?.await()?.token
                } catch (e: Exception) {
                    Log.e("SYNC_TEST", "❌ Failed to get token: ${e.message}")
                    null
                }
            }
            
            Log.d("SYNC_TEST", "🎫 Token: ${if (token != null) "EXISTS (${token.take(20)}...)" else "NULL"}")
            
            // Add Authorization header if token exists
            val request = if (token != null) {
                original.newBuilder()
                    .header("Authorization", "Bearer $token")
                    .method(original.method, original.body)
                    .build()
            } else {
                Log.w("SYNC_TEST", "⚠️ No token - request will fail with 401!")
                original
            }
            
            return chain.proceed(request)
        }
    }
    
    /**
     * OkHttp client with logging and auth interceptor
     */
    private fun createOkHttpClient(auth: FirebaseAuth): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = if (BuildConfig.DEBUG) {
                HttpLoggingInterceptor.Level.BODY
            } else {
                HttpLoggingInterceptor.Level.NONE
            }
        }
        
        return OkHttpClient.Builder()
            .addInterceptor(AuthInterceptor(auth))
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    /**
     * Retrofit instance
     */
    fun createRetrofit(auth: FirebaseAuth): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(createOkHttpClient(auth))
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    /**
     * API service instance
     */
    fun createApiService(auth: FirebaseAuth): ApiService {
        return createRetrofit(auth).create(ApiService::class.java)
    }
}
