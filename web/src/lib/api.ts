const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

export interface DailyMeasurement {
  id: string;
  user_id: string;
  spo2: number;
  heart_rate: number;
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
  spo2_after: number;
  heart_rate_after: number;
  notes?: string;
  measured_at: number;
  created_at: number;
  updated_at: number;
}

export interface Statistics {
  avg_spo2: number;
  avg_heart_rate: number;
  min_spo2: number;
  max_spo2: number;
  min_heart_rate: number;
  max_heart_rate: number;
  count: number;
}

export interface UserSettings {
  user_id: string;
  spo2_low_threshold: number;
  spo2_high_threshold: number;
  heart_rate_low_threshold: number;
  heart_rate_high_threshold: number;
  large_font_enabled: boolean;
  notifications_enabled: boolean;
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
}

export const apiClient = new ApiClient();
