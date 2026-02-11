/**
 * Export utilities for data download and printing
 */

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], headers: string[]): string {
  const csvRows = []
  
  // Add headers
  csvRows.push(headers.join(','))
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      // Escape quotes and wrap in quotes if contains comma
      const escaped = ('' + value).replace(/"/g, '""')
      return escaped.includes(',') ? `"${escaped}"` : escaped
    })
    csvRows.push(values.join(','))
  }
  
  return csvRows.join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(data: any[], filename: string, headers: string[]) {
  const csv = convertToCSV(data, headers)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Download JSON file
 */
export function downloadJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Open print dialog with optimized view
 */
export function openPrintView() {
  window.print()
}

/**
 * Format date for export (Finnish format)
 */
export function formatDateForExport(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('fi-FI', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format measurement data for CSV export
 */
export function formatMeasurementForExport(measurement: any) {
  return {
    Päivämäärä: formatDateForExport(measurement.measured_at),
    Tyyppi: measurement.type === 'daily' ? 'Päivittäinen' : 
            measurement.type === 'exercise_before' ? 'Liikunta (ennen)' : 
            measurement.type === 'exercise_after' ? 'Liikunta (jälkeen)' : 
            measurement.type,
    'SpO2 (%)': measurement.spo2,
    'Syke (bpm)': measurement.heart_rate,
    Huomiot: measurement.notes || '',
    Liikunta: measurement.exercise_type || '',
    'Kesto (min)': measurement.duration || '',
    Intensiteetti: measurement.intensity || ''
  }
}

/**
 * Format statistics data for export
 */
export function formatStatisticsForExport(stats: any, timeRange: string) {
  const now = new Date()
  return {
    Raportti: 'Hapetus Terveystilastot',
    Luotu: now.toLocaleString('fi-FI'),
    Aikaväli: timeRange,
    'SpO2 Viimeisin': `${stats.spo2.current}%`,
    'SpO2 Keskiarvo (7pv)': `${stats.spo2.average7days}%`,
    'SpO2 Keskiarvo (30pv)': `${stats.spo2.average30days}%`,
    'SpO2 Minimi': `${stats.spo2.min}%`,
    'SpO2 Maksimi': `${stats.spo2.max}%`,
    'Syke Viimeisin': `${stats.heartRate.current} bpm`,
    'Syke Keskiarvo (7pv)': `${stats.heartRate.average7days} bpm`,
    'Syke Keskiarvo (30pv)': `${stats.heartRate.average30days} bpm`,
    'Syke Minimi': `${stats.heartRate.min} bpm`,
    'Syke Maksimi': `${stats.heartRate.max} bpm`,
    'Mittauksia yhteensä': stats.totalMeasurements,
    Liikuntakertoja: stats.exerciseSessions
  }
}
