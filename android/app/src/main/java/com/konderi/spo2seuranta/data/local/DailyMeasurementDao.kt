package com.konderi.spo2seuranta.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime

/**
 * Data Access Object for daily measurements
 */
@Dao
interface DailyMeasurementDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(measurement: DailyMeasurement): Long
    
    @Update
    suspend fun update(measurement: DailyMeasurement)
    
    @Delete
    suspend fun delete(measurement: DailyMeasurement)
    
    @Query("SELECT * FROM daily_measurements ORDER BY timestamp DESC")
    fun getAllMeasurements(): Flow<List<DailyMeasurement>>
    
    @Query("SELECT * FROM daily_measurements WHERE id = :id")
    suspend fun getMeasurementById(id: Long): DailyMeasurement?
    
    @Query("SELECT * FROM daily_measurements WHERE timestamp >= :startDate AND timestamp <= :endDate ORDER BY timestamp DESC")
    fun getMeasurementsByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): Flow<List<DailyMeasurement>>
    
    @Query("SELECT * FROM daily_measurements WHERE userId = :userId ORDER BY timestamp DESC")
    fun getMeasurementsByUser(userId: String): Flow<List<DailyMeasurement>>
    
    @Query("SELECT AVG(spo2) FROM daily_measurements WHERE timestamp >= :startDate")
    suspend fun getAverageSpo2Since(startDate: LocalDateTime): Double?
    
    @Query("SELECT AVG(heartRate) FROM daily_measurements WHERE timestamp >= :startDate")
    suspend fun getAverageHeartRateSince(startDate: LocalDateTime): Double?
    
    @Query("SELECT COUNT(*) FROM daily_measurements WHERE spo2 < :threshold AND timestamp >= :startDate")
    suspend fun getLowOxygenCountSince(threshold: Int, startDate: LocalDateTime): Int
    
    @Query("DELETE FROM daily_measurements")
    suspend fun deleteAll()
}
