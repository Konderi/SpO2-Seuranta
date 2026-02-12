package com.konderi.spo2seuranta.data.local

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement
import kotlinx.coroutines.flow.Flow
import java.time.LocalDateTime

/**
 * Data Access Object for exercise measurements
 */
@Dao
interface ExerciseMeasurementDao {
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(measurement: ExerciseMeasurement): Long
    
    @Update
    suspend fun update(measurement: ExerciseMeasurement)
    
    @Delete
    suspend fun delete(measurement: ExerciseMeasurement)
    
    @Query("SELECT * FROM exercise_measurements ORDER BY timestamp DESC")
    fun getAllMeasurements(): Flow<List<ExerciseMeasurement>>
    
    @Query("SELECT * FROM exercise_measurements WHERE id = :id")
    suspend fun getMeasurementById(id: Long): ExerciseMeasurement?
    
    @Query("SELECT * FROM exercise_measurements WHERE timestamp >= :startDate AND timestamp <= :endDate ORDER BY timestamp DESC")
    fun getMeasurementsByDateRange(startDate: LocalDateTime, endDate: LocalDateTime): Flow<List<ExerciseMeasurement>>
    
    @Query("SELECT * FROM exercise_measurements WHERE userId = :userId ORDER BY timestamp DESC")
    fun getMeasurementsByUser(userId: String): Flow<List<ExerciseMeasurement>>
    
    @Query("SELECT AVG(spo2Before) FROM exercise_measurements WHERE timestamp >= :startDate")
    suspend fun getAverageSpo2BeforeSince(startDate: LocalDateTime): Double?
    
    @Query("SELECT AVG(spo2After) FROM exercise_measurements WHERE timestamp >= :startDate")
    suspend fun getAverageSpo2AfterSince(startDate: LocalDateTime): Double?
    
    @Query("SELECT * FROM exercise_measurements WHERE syncedToServer = 0")
    suspend fun getUnsyncedMeasurements(): List<ExerciseMeasurement>
    
    @Query("SELECT * FROM exercise_measurements WHERE serverId = :serverId LIMIT 1")
    suspend fun getMeasurementByServerId(serverId: String): ExerciseMeasurement?
    
    @Query("DELETE FROM exercise_measurements")
    suspend fun deleteAll()
}
