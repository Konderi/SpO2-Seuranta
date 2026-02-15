const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export interface DailyMeasurement {
  id: string;
  user_id: string;
  spo2: number;
  heart_rate: number;
  systolic?: number;
  diastolic?: number;
  notes?: string;
  measured_at: number;
  created_at: number;
  updated_at: number;
}

export interface ExerciseMeasurement {
  id: string;
  user_id: string;
  exercise_type: string;
  exercise_duration?: number;
  spo2_before: number;
  heart_rate_before: number;
  systolic_before?: number;
  diastolic_before?: number;
  spo2_after: number;
  heart_rate_after: number;
  systolic_after?: number;
  diastolic_after?: number;
  notes?: string;
  measured_at: number;
  created_at: number;
  updated_at: number;
}

export interface Statistics {
  // Flat structure for API compatibility
  avg_spo2?: number;
  avg_heart_rate?: number;
  avg_systolic?: number;
  avg_diastolic?: number;
  min_spo2?: number;
  max_spo2?: number;
  min_heart_rate?: number;
  max_heart_rate?: number;
  min_systolic?: number;
  max_systolic?: number;
  min_diastolic?: number;
  max_diastolic?: number;
  count?: number;
  
  // Nested structure for demo mode compatibility
  spo2?: {
    current: number;
    average7days: number;
    average30days: number;
    min: number;
    max: number;
  };
  heartRate?: {
    current: number;
    average7days: number;
    average30days: number;
    min: number;
    max: number;
  };
  bloodPressure?: {
    currentSystolic: number;
    currentDiastolic: number;
    average7daysSystolic: number;
    average7daysDiastolic: number;
    minSystolic: number;
    maxSystolic: number;
    minDiastolic: number;
    maxDiastolic: number;
  };
  totalMeasurements?: number;
  exerciseSessions?: number;
}

export interface UserSettings {
  user_id: string;
  spo2_low_threshold: number;
  spo2_high_threshold: number;
  heart_rate_low_threshold: number;
  heart_rate_high_threshold: number;
  large_font_enabled: boolean;
  manual_entry_enabled: boolean;
  notifications_enabled: boolean;
  gender?: 'male' | 'female' | 'other';
  birth_year?: number;
  date_of_birth?: string;
}

class ApiClient {
  private getAuthHeader = async (): Promise<Record<string, string>> => {
    const { auth } = await import('./firebase');
    
    if (!auth) {
      throw new Error('Firebase not initialized');
    }
    
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Not authenticated');
    }
    
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // Daily Measurements
  async getDailyMeasurements(): Promise<DailyMeasurement[]> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/daily`, { headers });
    if (!response.ok) throw new Error('Failed to fetch measurements');
    const data = await response.json();
    return data.data;
  }

  async createDailyMeasurement(measurement: Partial<DailyMeasurement>): Promise<void> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/daily`, {
      method: 'POST',
      headers,
      body: JSON.stringify(measurement),
    });
    if (!response.ok) throw new Error('Failed to create measurement');
  }

  async deleteDailyMeasurement(id: string): Promise<void> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/daily/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete measurement');
  }

  // Exercise Measurements
  async getExerciseMeasurements(): Promise<ExerciseMeasurement[]> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/exercise`, { headers });
    if (!response.ok) throw new Error('Failed to fetch measurements');
    const data = await response.json();
    return data.data;
  }

  async createExerciseMeasurement(measurement: Partial<ExerciseMeasurement>): Promise<void> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/exercise`, {
      method: 'POST',
      headers,
      body: JSON.stringify(measurement),
    });
    if (!response.ok) throw new Error('Failed to create measurement');
  }

  async deleteExerciseMeasurement(id: string): Promise<void> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/exercise/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete measurement');
  }

  // Statistics
  async getWeeklyStats(): Promise<Statistics> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/stats/week`, { headers });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    const data = await response.json();
    return data.data;
  }

  async getDailyStats(days: number = 30): Promise<any[]> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/stats/daily?days=${days}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    const data = await response.json();
    return data.data;
  }

  // User Settings
  async getUserSettings(): Promise<UserSettings> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/user/settings`, { headers });
    if (!response.ok) throw new Error('Failed to fetch settings');
    const data = await response.json();
    return data.data;
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/user/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
    });
    if (!response.ok) throw new Error('Failed to update settings');
  }

  // Delete all user data (GDPR "Right to be Forgotten")
  async deleteAllUserData(): Promise<{ success: boolean; message: string; deleted: any }> {
    const headers = await this.getAuthHeader();
    const response = await fetch(`${API_URL}/api/user/data`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user data');
    }
    return await response.json();
  }
}

export const apiClient = new ApiClient();
