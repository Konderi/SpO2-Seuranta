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
 * Open print dialog with CSV-style tabular format
 * @param data Array of objects to print
 * @param headers Array of header names (keys from data objects)
 * @param title Title for the print page
 */
export function openPrintView(data: any[], headers: string[], title: string) {
  // Generate CSV content
  const csvContent = convertToCSV(data, headers)
  
  // Create HTML for print window with CSV-style formatting
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Courier New', Courier, monospace;
          padding: 20px;
          background: white;
          color: #000;
        }
        
        h1 {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          font-family: Arial, sans-serif;
        }
        
        .metadata {
          font-size: 12px;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #333;
          font-family: Arial, sans-serif;
        }
        
        .data {
          font-size: 11px;
          line-height: 1.4;
          white-space: pre;
          word-wrap: break-word;
        }
        
        @media print {
          body {
            padding: 10mm;
          }
          
          .data {
            font-size: 10px;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="metadata">
        <div>Tulostettu: ${new Date().toLocaleString('fi-FI')}</div>
        <div>Rivejä: ${data.length}</div>
      </div>
      <div class="data">${csvContent.replace(/\n/g, '<br>')}</div>
      <script>
        // Auto-print when loaded
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `
  
  // Open new window with CSV-style content
  const printWindow = window.open('', '_blank', 'width=900,height=700')
  
  if (!printWindow) {
    alert('Pop-up ikkuna estettiin. Salli pop-upit tulostaaksesi.')
    return
  }
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
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
