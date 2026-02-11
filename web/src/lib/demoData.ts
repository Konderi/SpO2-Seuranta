// Demo data generator for showcase mode
// Generates realistic SpO2 and heart rate measurements

export interface DemoMeasurement {
  id: string
  type: 'daily' | 'exercise'
  date: string
  time: string
  spo2?: number
  heartRate?: number
  spo2Before?: number
  heartRateBefore?: number
  spo2After?: number
  heartRateAfter?: number
  exerciseType?: string
  duration?: number
  notes?: string
  measured_at: number
}

// Generate realistic SpO2 values (normal range: 95-99%)
const generateSpo2 = (base: number = 96): number => {
  const variation = Math.random() * 3 - 1.5 // ±1.5%
  return Math.round(Math.max(92, Math.min(99, base + variation)))
}

// Generate realistic heart rate (normal resting: 60-80 bpm)
const generateHeartRate = (base: number = 72, isExercise: boolean = false): number => {
  if (isExercise) {
    // Exercise: 90-120 bpm
    return Math.round(90 + Math.random() * 30)
  }
  const variation = Math.random() * 10 - 5 // ±5 bpm
  return Math.round(Math.max(60, Math.min(85, base + variation)))
}

// Generate demo data: 3 measurements per day for 3 months (90 days)
export const generateDemoData = (): DemoMeasurement[] => {
  const measurements: DemoMeasurement[] = []
  const now = new Date()
  const daysToGenerate = 90 // 3 months
  
  let idCounter = 1

  for (let day = 0; day < daysToGenerate; day++) {
    const date = new Date(now)
    date.setDate(date.getDate() - (daysToGenerate - day - 1))
    date.setHours(0, 0, 0, 0)

    // Morning measurement (8:00-9:00)
    const morningHour = 8
    const morningMinute = Math.floor(Math.random() * 60)
    const morningTime = new Date(date)
    morningTime.setHours(morningHour, morningMinute)
    
    measurements.push({
      id: `demo-${idCounter++}`,
      type: 'daily',
      date: date.toISOString().split('T')[0],
      time: `${String(morningHour).padStart(2, '0')}:${String(morningMinute).padStart(2, '0')}`,
      spo2: generateSpo2(96.5),
      heartRate: generateHeartRate(68),
      notes: day % 7 === 0 ? 'Viikonloppu, tunsin oloni virkeäksi' : undefined,
      measured_at: Math.floor(morningTime.getTime() / 1000)
    })

    // Afternoon measurement with occasional exercise (14:00-15:00)
    const afternoonHour = 14
    const afternoonMinute = Math.floor(Math.random() * 60)
    const afternoonTime = new Date(date)
    afternoonTime.setHours(afternoonHour, afternoonMinute)

    // 40% chance of exercise measurement
    if (Math.random() < 0.4) {
      const exercises = ['Kävely', 'Hiihto', 'Pyöräily', 'Jumppa', 'Uinti']
      const exercise = exercises[Math.floor(Math.random() * exercises.length)]
      const duration = 20 + Math.floor(Math.random() * 40) // 20-60 min

      measurements.push({
        id: `demo-${idCounter++}`,
        type: 'exercise',
        date: date.toISOString().split('T')[0],
        time: `${String(afternoonHour).padStart(2, '0')}:${String(afternoonMinute).padStart(2, '0')}`,
        exerciseType: exercise,
        spo2Before: generateSpo2(96),
        heartRateBefore: generateHeartRate(70),
        spo2After: generateSpo2(95),
        heartRateAfter: generateHeartRate(72, true),
        duration,
        notes: duration > 45 ? 'Hyvä harjoitus, jakson olo' : undefined,
        measured_at: Math.floor(afternoonTime.getTime() / 1000)
      })
    } else {
      measurements.push({
        id: `demo-${idCounter++}`,
        type: 'daily',
        date: date.toISOString().split('T')[0],
        time: `${String(afternoonHour).padStart(2, '0')}:${String(afternoonMinute).padStart(2, '0')}`,
        spo2: generateSpo2(95.5),
        heartRate: generateHeartRate(74),
        measured_at: Math.floor(afternoonTime.getTime() / 1000)
      })
    }

    // Evening measurement (20:00-21:00)
    const eveningHour = 20
    const eveningMinute = Math.floor(Math.random() * 60)
    const eveningTime = new Date(date)
    eveningTime.setHours(eveningHour, eveningMinute)
    
    measurements.push({
      id: `demo-${idCounter++}`,
      type: 'daily',
      date: date.toISOString().split('T')[0],
      time: `${String(eveningHour).padStart(2, '0')}:${String(eveningMinute).padStart(2, '0')}`,
      spo2: generateSpo2(96),
      heartRate: generateHeartRate(70),
      notes: day % 5 === 4 ? 'Iltamittaus ennen nukkumaanmenoa' : undefined,
      measured_at: Math.floor(eveningTime.getTime() / 1000)
    })
  }

  return measurements.sort((a, b) => b.measured_at - a.measured_at)
}

// Calculate statistics from demo data
export const calculateDemoStats = (measurements: DemoMeasurement[]) => {
  const dailyMeasurements = measurements.filter(m => m.type === 'daily')
  const exerciseMeasurements = measurements.filter(m => m.type === 'exercise')

  if (dailyMeasurements.length === 0) {
    return null
  }

  // All measurements
  const allSpo2 = dailyMeasurements.map(m => m.spo2!).filter(v => v !== undefined)
  const allHeartRate = dailyMeasurements.map(m => m.heartRate!).filter(v => v !== undefined)

  // Last 7 days
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60)
  const last7Days = dailyMeasurements.filter(m => m.measured_at >= sevenDaysAgo)
  const spo2Last7 = last7Days.map(m => m.spo2!).filter(v => v !== undefined)
  const hrLast7 = last7Days.map(m => m.heartRate!).filter(v => v !== undefined)

  // Last 30 days
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
  const last30Days = dailyMeasurements.filter(m => m.measured_at >= thirtyDaysAgo)
  const spo2Last30 = last30Days.map(m => m.spo2!).filter(v => v !== undefined)
  const hrLast30 = last30Days.map(m => m.heartRate!).filter(v => v !== undefined)

  const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
  const min = (arr: number[]) => arr.length > 0 ? Math.min(...arr) : 0
  const max = (arr: number[]) => arr.length > 0 ? Math.max(...arr) : 0

  return {
    spo2: {
      current: allSpo2[0] || 0,
      average7days: Math.round(avg(spo2Last7)),
      average30days: Math.round(avg(spo2Last30)),
      min: min(allSpo2),
      max: max(allSpo2),
    },
    heartRate: {
      current: allHeartRate[0] || 0,
      average7days: Math.round(avg(hrLast7)),
      average30days: Math.round(avg(hrLast30)),
      min: min(allHeartRate),
      max: max(allHeartRate),
    },
    totalMeasurements: dailyMeasurements.length,
    exerciseSessions: exerciseMeasurements.length,
  }
}

// Generate daily aggregated data for charts (last 30 days)
export const generateDailyChartData = (measurements: DemoMeasurement[]) => {
  const dailyMeasurements = measurements.filter(m => m.type === 'daily')
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
  const recentMeasurements = dailyMeasurements.filter(m => m.measured_at >= thirtyDaysAgo)

  // Group by date
  const groupedByDate: { [date: string]: { spo2: number[], heartRate: number[] } } = {}
  
  recentMeasurements.forEach(m => {
    if (!groupedByDate[m.date]) {
      groupedByDate[m.date] = { spo2: [], heartRate: [] }
    }
    if (m.spo2) groupedByDate[m.date].spo2.push(m.spo2)
    if (m.heartRate) groupedByDate[m.date].heartRate.push(m.heartRate)
  })

  // Calculate daily averages
  const chartData = Object.keys(groupedByDate)
    .sort()
    .map(date => {
      const data = groupedByDate[date]
      const avgSpo2 = data.spo2.reduce((a, b) => a + b, 0) / data.spo2.length
      const avgHR = data.heartRate.reduce((a, b) => a + b, 0) / data.heartRate.length
      
      return {
        date,
        dateLabel: new Date(date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' }),
        spo2: Math.round(avgSpo2 * 10) / 10,
        heartRate: Math.round(avgHR)
      }
    })

  return chartData
}

// Generate weekly aggregated data for charts (last 12 weeks)
export const generateWeeklyChartData = (measurements: DemoMeasurement[]) => {
  const dailyMeasurements = measurements.filter(m => m.type === 'daily')
  
  // Group by week
  const weeklyData: { [week: string]: { spo2: number[], heartRate: number[] } } = {}
  
  dailyMeasurements.forEach(m => {
    const date = new Date(m.measured_at * 1000)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay() + 1) // Monday
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { spo2: [], heartRate: [] }
    }
    if (m.spo2) weeklyData[weekKey].spo2.push(m.spo2)
    if (m.heartRate) weeklyData[weekKey].heartRate.push(m.heartRate)
  })

  // Calculate weekly averages for last 12 weeks
  const twelveWeeksAgo = new Date()
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84)
  
  const chartData = Object.keys(weeklyData)
    .filter(week => new Date(week) >= twelveWeeksAgo)
    .sort()
    .map(week => {
      const data = weeklyData[week]
      const avgSpo2 = data.spo2.reduce((a, b) => a + b, 0) / data.spo2.length
      const avgHR = data.heartRate.reduce((a, b) => a + b, 0) / data.heartRate.length
      
      const weekDate = new Date(week)
      const weekLabel = `Vk ${weekDate.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' })}`
      
      return {
        week,
        weekLabel,
        spo2: Math.round(avgSpo2 * 10) / 10,
        heartRate: Math.round(avgHR)
      }
    })

  return chartData
}
