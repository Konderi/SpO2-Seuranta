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
     * SQLite doesn't support ALTER COLUMN, so we need to recreate the table
     */
    private val MIGRATION_3_4 = object : Migration(3, 4) {
        override fun migrate(database: SupportSQLiteDatabase) {
            // Create new table with nullable spo2 and heartRate
            database.execSQL("""
                CREATE TABLE daily_measurements_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    spo2 INTEGER,
                    heartRate INTEGER,
                    systolic INTEGER,
                    diastolic INTEGER,
                    notes TEXT NOT NULL DEFAULT '',
                    timestamp TEXT NOT NULL,
                    userId TEXT,
                    serverId TEXT,
                    syncedToServer INTEGER NOT NULL DEFAULT 0
                )
            """.trimIndent())
            
            // Copy data from old table to new table
            database.execSQL("""
                INSERT INTO daily_measurements_new 
                (id, spo2, heartRate, systolic, diastolic, notes, timestamp, userId, serverId, syncedToServer)
                SELECT id, spo2, heartRate, systolic, diastolic, notes, timestamp, userId, serverId, syncedToServer
                FROM daily_measurements
            """.trimIndent())
            
            // Drop old table
            database.execSQL("DROP TABLE daily_measurements")
            
            // Rename new table to original name
            database.execSQL("ALTER TABLE daily_measurements_new RENAME TO daily_measurements")
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
