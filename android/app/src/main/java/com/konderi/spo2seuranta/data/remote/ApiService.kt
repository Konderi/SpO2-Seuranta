package com.konderi.spo2seuranta.data.remote

import com.konderi.spo2seuranta.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Retrofit API service for Hapetus backend
 * Base URL: https://api.hapetus.info
 */
interface ApiService {
    
    // ============= Daily Measurements =============
    
    @GET("/api/daily")
    suspend fun getDailyMeasurements(
        @Header("Authorization") token: String
    ): Response<ListResponse<DailyMeasurementDto>>
    
    @GET("/api/daily/range")
    suspend fun getDailyMeasurementsByRange(
        @Header("Authorization") token: String,
        @Query("start") startTimestamp: Long,
        @Query("end") endTimestamp: Long
    ): Response<ListResponse<DailyMeasurementDto>>
    
    @POST("/api/daily")
    suspend fun createDailyMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: DailyMeasurementDto
    ): Response<ApiResponse<DailyMeasurementDto>>
    
    @PUT("/api/daily/{id}")
    suspend fun updateDailyMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String,
        @Body measurement: DailyMeasurementDto
    ): Response<ApiResponse<DailyMeasurementDto>>
    
    @DELETE("/api/daily/{id}")
    suspend fun deleteDailyMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String
    ): Response<ApiResponse<Unit>>
    
    // ============= Exercise Measurements =============
    
    @GET("/api/exercise")
    suspend fun getExerciseMeasurements(
        @Header("Authorization") token: String
    ): Response<ListResponse<ExerciseMeasurementDto>>
    
    @GET("/api/exercise/range")
    suspend fun getExerciseMeasurementsByRange(
        @Header("Authorization") token: String,
        @Query("start") startTimestamp: Long,
        @Query("end") endTimestamp: Long
    ): Response<ListResponse<ExerciseMeasurementDto>>
    
    @POST("/api/exercise")
    suspend fun createExerciseMeasurement(
        @Header("Authorization") token: String,
        @Body measurement: ExerciseMeasurementDto
    ): Response<ApiResponse<ExerciseMeasurementDto>>
    
    @DELETE("/api/exercise/{id}")
    suspend fun deleteExerciseMeasurement(
        @Header("Authorization") token: String,
        @Path("id") id: String
    ): Response<ApiResponse<Unit>>
    
    // ============= User Profile =============
    
    @GET("/api/user/profile")
    suspend fun getUserProfile(
        @Header("Authorization") token: String
    ): Response<ApiResponse<UserProfileDto>>
    
    // ============= User Settings =============
    
    @GET("/api/user/settings")
    suspend fun getUserSettings(
        @Header("Authorization") token: String
    ): Response<ApiResponse<UserSettingsDto>>
    
    @PUT("/api/user/settings")
    suspend fun updateUserSettings(
        @Header("Authorization") token: String,
        @Body settings: UpdateUserSettingsRequest
    ): Response<ApiResponse<UserSettingsDto>>
    
    // ============= Statistics =============
    
    @GET("/api/stats/week")
    suspend fun getWeeklyStats(
        @Header("Authorization") token: String
    ): Response<ApiResponse<StatisticsDto>>
    
    @GET("/api/stats/range")
    suspend fun getStatsForRange(
        @Header("Authorization") token: String,
        @Query("start") startTimestamp: Long,
        @Query("end") endTimestamp: Long
    ): Response<ApiResponse<StatisticsDto>>
    
    // ============= Health Check =============
    
    @GET("/health")
    suspend fun healthCheck(): Response<Map<String, String>>
}
