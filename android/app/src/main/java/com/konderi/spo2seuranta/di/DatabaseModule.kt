package com.konderi.spo2seuranta.di

import android.content.Context
import androidx.room.Room
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.konderi.spo2seuranta.data.local.DailyMeasurementDao
import com.konderi.spo2seuranta.data.local.ExerciseMeasurementDao
import com.konderi.spo2seuranta.data.local.SpO2Database
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

/**
 * Hilt module for database dependencies
 */
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    
    /**
     * Migration from version 2 to 3: Add blood pressure columns
     */
    private val MIGRATION_2_3 = object : Migration(2, 3) {
        override fun migrate(database: SupportSQLiteDatabase) {
            // Add blood pressure columns to daily_measurements
            database.execSQL("ALTER TABLE daily_measurements ADD COLUMN systolic INTEGER")
            database.execSQL("ALTER TABLE daily_measurements ADD COLUMN diastolic INTEGER")
            
            // Add blood pressure columns to exercise_measurements
            database.execSQL("ALTER TABLE exercise_measurements ADD COLUMN systolicBefore INTEGER")
            database.execSQL("ALTER TABLE exercise_measurements ADD COLUMN diastolicBefore INTEGER")
            database.execSQL("ALTER TABLE exercise_measurements ADD COLUMN systolicAfter INTEGER")
            database.execSQL("ALTER TABLE exercise_measurements ADD COLUMN diastolicAfter INTEGER")
        }
    }
    
    /**
     * Migration from version 3 to 4: Make spo2 and heartRate nullable
     * Note: SQLite doesn't support ALTER COLUMN, but Room handles nullability in Kotlin layer
     * The columns are already nullable in SQLite (INTEGER allows NULL by default)
     */
    private val MIGRATION_3_4 = object : Migration(3, 4) {
        override fun migrate(database: SupportSQLiteDatabase) {
            // No SQL changes needed - SQLite columns are already nullable by default
            // This migration just updates the schema version to match the Kotlin model changes
        }
    }
    
    @Provides
    @Singleton
    fun provideSpO2Database(
        @ApplicationContext context: Context
    ): SpO2Database {
        return Room.databaseBuilder(
            context,
            SpO2Database::class.java,
            "spo2_database"
        )
            .addMigrations(MIGRATION_2_3, MIGRATION_3_4)
            .fallbackToDestructiveMigration()
            .build()
    }
    
    @Provides
    @Singleton
    fun provideDailyMeasurementDao(database: SpO2Database): DailyMeasurementDao {
        return database.dailyMeasurementDao()
    }
    
    @Provides
    @Singleton
    fun provideExerciseMeasurementDao(database: SpO2Database): ExerciseMeasurementDao {
        return database.exerciseMeasurementDao()
    }
}
