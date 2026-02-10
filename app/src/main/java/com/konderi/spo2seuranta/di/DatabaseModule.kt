package com.konderi.spo2seuranta.di

import android.content.Context
import androidx.room.Room
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
