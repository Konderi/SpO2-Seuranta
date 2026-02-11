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
 * Open print dialog with clean table-style layout (similar to CSV format)
 * @param data Array of objects to print
 * @param headers Array of header names (keys from data objects)
 * @param title Title for the print page
 */
export function openPrintView(data: any[], headers: string[], title: string) {
  // Create table rows with proper formatting (one entry per line)
  let tableRows = ''
  
  data.forEach((row, index) => {
    // For each row, create entries (one per line for better readability)
    Object.keys(row).forEach(key => {
      const value = row[key]
      if (value !== undefined && value !== null && value !== '') {
        tableRows += `<tr><td class="label">${key}</td><td class="value">${value}</td></tr>`
      }
    })
    
    // Add separator between different sections
    if (index < data.length - 1) {
      tableRows += '<tr><td colspan="2" class="separator"></td></tr>'
    }
  })
  
  // Create HTML for print window with table formatting
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
          font-family: Arial, sans-serif;
          padding: 30px;
          background: white;
          color: #000;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2c3e50;
        }
        
        .metadata {
          font-size: 16px;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid #2c3e50;
          color: #555;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 18px;
          line-height: 1.6;
        }
        
        tr {
          border-bottom: 1px solid #e0e0e0;
        }
        
        td {
          padding: 12px 16px;
          vertical-align: top;
        }
        
        td.label {
          font-weight: 600;
          width: 45%;
          text-align: left;
          color: #2c3e50;
        }
        
        td.value {
          width: 55%;
          text-align: left;
          color: #34495e;
        }
        
        .separator {
          height: 20px;
          border-bottom: 2px solid #bdc3c7;
          background-color: #f8f9fa;
        }
        
        @media print {
          body {
            padding: 15mm;
          }
          
          h1 {
            font-size: 24px;
          }
          
          .metadata {
            font-size: 14px;
          }
          
          table {
            font-size: 16px;
          }
          
          td {
            padding: 10px 12px;
          }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="metadata">
        <div><strong>Tulostettu:</strong> ${new Date().toLocaleString('fi-FI')}</div>
      </div>
      <table>
        ${tableRows}
      </table>
      <script>
        // Auto-print when loaded
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `
  
  // Open new window with formatted content
  const printWindow = window.open('', '_blank', 'width=1000,height=800')
  
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

/**
 * Print current page graphically using browser's native print
 * This will print the actual page with all charts and styling
 */
export function printCurrentPage() {
  window.print()
}
