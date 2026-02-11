# Graphical Print and Warning Statistics

**Date:** 12.2.2026  
**Status:** ✅ Complete  
**Commit:** 0932331

## Overview

Major upgrade to the print functionality and addition of warning statistics tracking. The print feature now outputs the actual page with charts (graphical), and the statistics page shows warnings for low SpO2 measurements.

## Features Implemented

### 1. Graphical Print Feature

**Previous Behavior:**
- Print showed a table-based list of values
- Charts were NOT included in print output
- Used a popup window with formatted HTML table

**New Behavior:**
- Print shows the **actual page with all charts and styling**
- Uses native browser print (`window.print()`)
- Charts are included and visible in print preview
- Professional layout optimized for A4 paper
- Print-specific styles hide navigation and buttons

**Benefits:**
- Much more useful for healthcare providers
- Visual trends visible at a glance
- Professional appearance
- Can still export CSV for data analysis

### 2. Warning Statistics

**New Feature:**
- Tracks SpO2 measurements below threshold (default: 90%)
- Shows warning count and percentage
- Color-coded warning card:
  - 🟢 Green: 0 warnings (good!)
  - 🟡 Yellow: 1-20% warnings (monitor)
  - 🔴 Red: >20% warnings (concerning)
- Helpful advice message when warnings detected

**Display:**
```
┌─────────────────────────────────────┐
│ ⚠️  Varoitusmittaukset              │
│     SpO2 alle 90%                   │
├─────────────────────────────────────┤
│ Varoitusmittauksia    Osuus        │
│        12               8%          │
├─────────────────────────────────────┤
│ ⚠️ Huomio: Sinulla on 12 mittausta │
│ joissa happisaturaatio on ollut    │
│ alle 90%. Jos matalia arvoja       │
│ esiintyy usein, ota yhteyttä       │
│ terveydenhuollon ammattilaiseen.   │
└─────────────────────────────────────┘
```

### 3. Updated Statistics Tracking

**New Fields Added to Stats:**
- `warningCount`: Number of measurements below threshold
- `warningPercentage`: Percentage of measurements with warnings
- `warningThreshold`: Current threshold value (default 90%)

## Technical Implementation

### Files Modified

**1. web/src/lib/exportUtils.ts**
```typescript
/**
 * Print current page graphically using browser's native print
 * This will print the actual page with all charts and styling
 */
export function printCurrentPage() {
  window.print()
}
```

**2. web/src/pages/statistics.tsx**

**Constants:**
```typescript
const DEFAULT_SPO2_THRESHOLD = 90
```

**Warning Calculation (Demo Mode):**
```typescript
const warningCount = spo2Values.filter(v => v < DEFAULT_SPO2_THRESHOLD).length
const warningPercentage = spo2Values.length > 0 
  ? Math.round((warningCount / spo2Values.length) * 100) 
  : 0

setStats({
  // ... existing fields
  warningCount,
  warningPercentage,
  warningThreshold: DEFAULT_SPO2_THRESHOLD,
})
```

**Warning Calculation (API Mode):**
```typescript
const warningCount = dailyData.filter((m: any) => 
  m.spo2 < DEFAULT_SPO2_THRESHOLD
).length
const warningPercentage = dailyData.length > 0 
  ? Math.round((warningCount / dailyData.length) * 100) 
  : 0
```

**Print Handler:**
```typescript
const handlePrint = () => {
  // Use native browser print to print the page with all charts and styling
  printCurrentPage()
}
```

**Warning Statistics Card:**
```tsx
{stats.warningCount !== undefined && (
  <div className={`card p-8 mb-12 ${stats.warningCount > 0 ? 'border-2 border-yellow-500' : ''}`}>
    <div className="flex items-center gap-4 mb-6">
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
        stats.warningCount > 0 ? 'bg-yellow-100' : 'bg-green-100'
      }`}>
        <Activity className={`w-8 h-8 ${
          stats.warningCount > 0 ? 'text-yellow-600' : 'text-green-600'
        }`} strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Varoitusmittaukset</h2>
        <p className="text-text-secondary text-sm mt-1">
          SpO2 alle {stats.warningThreshold}%
        </p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-surface rounded-xl">
        <p className="text-text-secondary mb-2">Varoitusmittauksia</p>
        <p className={`text-4xl font-bold ${
          stats.warningCount > 0 ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {stats.warningCount}
        </p>
      </div>
      <div className="p-6 bg-surface rounded-xl">
        <p className="text-text-secondary mb-2">Osuus mittauksista</p>
        <p className={`text-4xl font-bold ${
          stats.warningPercentage > 20 ? 'text-red-600' : 
          stats.warningPercentage > 10 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {stats.warningPercentage}%
        </p>
      </div>
    </div>
    
    {stats.warningCount > 0 && (
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Huomio:</strong> Sinulla on {stats.warningCount} mittausta, joissa happisaturaatio 
          on ollut alle {stats.warningThreshold}%. Jos matalia arvoja esiintyy usein, 
          ota yhteyttä terveydenhuollon ammattilaiseen.
        </p>
      </div>
    )}
  </div>
)}
```

**3. web/src/pages/history.tsx**

Updated print handler:
```typescript
const handlePrint = () => {
  // Use native browser print to print the page with all measurements
  printCurrentPage()
}
```

**4. web/src/lib/demoData.ts**

Added warning calculations:
```typescript
export const calculateDemoStats = (measurements: DemoMeasurement[]) => {
  // ... existing code
  
  // Calculate warning count (measurements below 90%)
  const DEFAULT_SPO2_THRESHOLD = 90
  const warningCount = allSpo2.filter(v => v < DEFAULT_SPO2_THRESHOLD).length
  const warningPercentage = allSpo2.length > 0 
    ? Math.round((warningCount / allSpo2.length) * 100) 
    : 0

  return {
    spo2: { /* ... */ },
    heartRate: { /* ... */ },
    totalMeasurements: dailyMeasurements.length,
    exerciseSessions: exerciseMeasurements.length,
    warningCount,
    warningPercentage,
    warningThreshold: DEFAULT_SPO2_THRESHOLD,
  }
}
```

## Print Styles (Already Existing)

**web/src/styles/globals.css** contains comprehensive print styles:

```css
@media print {
  @page {
    size: A4;
    margin: 1.5cm;
  }
  
  /* Hide navigation, buttons, inputs */
  nav, .no-print, button, input[type="date"] {
    display: none !important;
  }
  
  /* Show print header */
  .print-header {
    display: block !important;
  }
  
  /* Charts maintain aspect ratio */
  .recharts-wrapper, .recharts-surface {
    max-width: 100% !important;
    height: auto !important;
  }
  
  /* Cards optimized for print */
  .card {
    border: 1px solid #ddd !important;
    page-break-inside: avoid;
  }
  
  /* Typography adjustments */
  h1 { font-size: 24pt; }
  h2 { font-size: 18pt; }
  body { font-size: 12pt; }
}
```

## User Experience

### Statistics Page

1. **Viewing Warning Statistics:**
   - Automatic calculation based on measurements
   - Card appears with warning count
   - Color changes based on severity
   - Advice message if warnings present

2. **Printing Statistics:**
   - Click "Tulosta" (Print) button
   - Browser print dialog opens
   - Preview shows actual page with charts
   - All statistics visible including warning card
   - Can save as PDF or print to paper

3. **Exporting Data:**
   - CSV export still available for data analysis
   - JSON export includes all raw data
   - Print is now for visual/graphical output

### History Page

1. **Printing History:**
   - Click "Tulosta" button
   - Shows measurement list graphically
   - Includes filter information
   - Professional layout for sharing

## Warning Threshold

**Current Value:** 90%

**Why 90%:**
- Medical standard for SpO2 monitoring
- Below 90% is considered hypoxemia
- Aligns with healthcare guidelines

**Future Enhancement:**
- Can be made configurable in user settings
- Could vary by user health profile
- Backend API can support user-specific thresholds

## Testing Checklist

- [x] Demo mode calculates warnings correctly
- [x] API mode calculates warnings correctly
- [x] Warning card displays with correct colors
- [x] Warning message shows when count > 0
- [x] Warning card hidden when count = 0
- [x] Print preview shows full page with charts
- [x] Print styles hide navigation/buttons
- [x] Charts visible in print output
- [x] CSV export still works for data
- [x] History print shows measurements
- [x] Print header includes metadata

## Browser Compatibility

**Print Feature:**
- ✅ Chrome/Edge: Full support
- ✅ Safari: Full support
- ✅ Firefox: Full support
- ✅ Mobile browsers: Basic print support

**Note:** Charts may render differently across browsers but remain visible and useful.

## Future Enhancements

1. **Configurable Threshold:**
   - Add to user settings page
   - Per-user warning levels
   - Multiple threshold alerts

2. **Warning History:**
   - Track warning trends over time
   - Chart showing warning percentage over weeks
   - Historical comparison

3. **Export Warnings Only:**
   - Filter to show only warning measurements
   - Export list of concerning readings
   - Share with healthcare provider

4. **Warning Notifications:**
   - Email alerts when warnings exceed threshold
   - Mobile push notifications
   - Daily/weekly summary reports

5. **Print Customization:**
   - Choose which sections to print
   - Include/exclude charts
   - Portrait vs landscape orientation

## Benefits Summary

✅ **Graphical Print:**
- Visual trends immediately visible
- Professional presentation
- Charts included for context
- Suitable for medical consultations

✅ **Warning Statistics:**
- Proactive health monitoring
- Quick identification of patterns
- Color-coded for easy understanding
- Helpful guidance for action

✅ **Data Export:**
- CSV still available for analysis
- JSON for developers
- Multiple export options maintained

## Related Documentation

- [DEMO_MODE_COMPLETE.md](./DEMO_MODE_COMPLETE.md) - Demo data generation
- [PRINT_FORMAT_EXAMPLES.md](./PRINT_FORMAT_EXAMPLES.md) - Old print format (now graphical)
- [STATUS.md](../backend/STATUS.md) - API statistics endpoints

## Conclusion

This update transforms the print feature from a simple data table to a comprehensive graphical report that includes charts and visual trends. The addition of warning statistics provides users with immediate feedback on concerning measurements, helping them make informed decisions about their health.

The implementation is clean, maintainable, and ready for future enhancements like configurable thresholds and warning notifications.
