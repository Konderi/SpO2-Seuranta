package com.konderi.spo2seuranta.data.local

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.konderi.spo2seuranta.domain.model.DailyMeasurement
import com.konderi.spo2seuranta.domain.model.ExerciseMeasurement

/**
 * Room database for SpO2 measurements
 */
@Database(
    entities = [DailyMeasurement::class, ExerciseMeasurement::class],
    version = 1,
    exportSchema = true
)
@TypeConverters(Converters::class)
abstract class SpO2Database : RoomDatabase() {
    abstract fun dailyMeasurementDao(): DailyMeasurementDao
    abstract fun exerciseMeasurementDao(): ExerciseMeasurementDao
}
