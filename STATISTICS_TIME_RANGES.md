# Statistics Time Range Feature

**Date**: February 11, 2026  
**Feature**: Flexible Time Range Selection for Statistics Charts

## Overview

Enhanced the statistics page to support multiple predefined time ranges and custom date selection, giving users full control over the data visualization period.

---

## Features Implemented

### 1. Predefined Time Ranges

Four quick-select buttons for common time periods:

- **7 päivää** (7 days) - One week view
- **30 päivää** (30 days) - One month view (default)
- **3 kuukautta** (3 months) - Three month view
- **Valitse aikaväli** (Custom range) - Custom date picker

### 2. Custom Date Range Picker

When "Valitse aikaväli" is clicked:
- **Start Date Input**: Select beginning of range
- **End Date Input**: Select end of range
- **Validation**: Start date cannot be after end date
- **Max Date**: Cannot select future dates
- **Apply Button**: Loads data for selected period

### 3. Dynamic Data Filtering

**For Demo Mode:**
- Filters 84 pre-generated measurements by selected time range
- Recalculates statistics (avg, min, max) for filtered data
- Updates chart data accordingly

**For Real Data:**
- Fetches up to 90 days of daily statistics from API
- Filters data based on selected time range
- Optimizes API calls (single fetch, multiple filters)

### 4. User Experience

**Visual Feedback:**
- Active time range button highlighted in blue (#0070E6)
- Inactive buttons in light gray
- Custom date picker appears below buttons when activated
- Current range displayed as text below selector

**Information Display:**
```
"Näytetään viimeisten 7 päivän mittaukset"
"Näytetään viimeisten 30 päivän mittaukset"
"Näytetään viimeisten 3 kuukauden mittaukset"
"Näytetään mittaukset 1.1.2026 - 15.1.2026"
```

---

## Technical Implementation

### State Management

```typescript
type TimeRange = '7days' | '30days' | '3months' | 'custom'

const [timeRange, setTimeRange] = useState<TimeRange>('30days')
const [customStartDate, setCustomStartDate] = useState('')
const [customEndDate, setCustomEndDate] = useState('')
const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
```

### Data Filtering Function

```typescript
const filterDataByRange = (data: any[], range: TimeRange, startDate?: string, endDate?: string) => {
  const now = new Date()
  let cutoffDate = new Date()
  
  switch (range) {
    case '7days':
      cutoffDate.setDate(now.getDate() - 7)
      break
    case '30days':
      cutoffDate.setDate(now.getDate() - 30)
      break
    case '3months':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case 'custom':
      // Filter by exact start/end dates
      break
  }
  
  return filtered data
}
```

### Re-fetch Trigger

```typescript
useEffect(() => {
  fetchStatistics()
}, [isDemoMode, demoMeasurements, demoStats, timeRange, customStartDate, customEndDate])
```

Data automatically refetches when:
- Time range changes
- Custom dates change
- Mode switches (demo/real)

---

## UI Components

### Time Range Selector Buttons

```tsx
<div className="flex flex-wrap gap-2 mb-4">
  <button
    onClick={() => handleTimeRangeChange('7days')}
    className={`btn ${timeRange === '7days' ? 'bg-primary text-white' : 'btn-secondary'}`}
  >
    7 päivää
  </button>
  {/* More buttons... */}
</div>
```

### Custom Date Picker Panel

```tsx
{showCustomDatePicker && (
  <div className="bg-surface p-4 rounded-xl border-2 border-primary mb-4">
    <input type="date" value={customStartDate} />
    <input type="date" value={customEndDate} />
    <button onClick={applyCustomDateRange}>Näytä</button>
  </div>
)}
```

---

## Chart Updates

### Single Date Key

Charts now use consistent `dateLabel` key instead of switching between `dateLabel` and `weekLabel`:

```tsx
<XAxis dataKey="dateLabel" />
```

This works for all time ranges as the data is pre-formatted.

---

## API Compatibility

### Backend Requirements

The feature works with existing API endpoints:

```
GET /api/statistics?days=7
GET /api/statistics?days=30
GET /api/statistics?days=90
```

**Current Implementation:**
- Fetches 90 days of data (max for 3 months view)
- Filters client-side for different ranges
- Reduces API calls (single fetch, multiple views)

**Future Optimization:**
- Could pass time range to API for server-side filtering
- Reduces data transfer for shorter periods

---

## Benefits

### For Users

1. **Flexibility**: View data for any time period
2. **Quick Access**: Common periods (7d, 30d, 3m) one click away
3. **Custom Analysis**: Pick exact date range for specific needs
4. **Visual Clarity**: See exactly what period is displayed
5. **Responsive**: Works on mobile and desktop

### For Healthcare

1. **Weekly Trends**: 7-day view for short-term monitoring
2. **Monthly Patterns**: 30-day view for routine check-ups
3. **Long-term Analysis**: 3-month view for condition tracking
4. **Specific Events**: Custom range for symptom correlation

---

## Testing Checklist

- ✅ Build successful (no TypeScript errors)
- ✅ All 4 time range buttons functional
- ✅ Custom date picker appears/hides correctly
- ✅ Date validation works (no future dates, start < end)
- ✅ Charts update with correct filtered data
- ✅ Demo mode filtering works
- ✅ Real API data filtering works
- ✅ Info text updates for each range
- ✅ Mobile responsive layout
- ✅ Accessibility (keyboard navigation, labels)

---

## Statistics Page Size

**Before**: 224 kB  
**After**: 225 kB  
**Increase**: +1 kB (minimal impact)

The feature adds minimal bundle size while providing significant value.

---

## Future Enhancements

### Potential Additions

1. **Year View**: Add "1 vuosi" (1 year) button
2. **Week View**: Add "Tämä viikko" (This week) button
3. **Month View**: Add "Tämä kuukausi" (This month) button
4. **Comparison**: Compare two time periods side-by-side
5. **Export**: Download filtered data as CSV/PDF
6. **Bookmarks**: Save favorite time ranges
7. **Quick Presets**: "Last doctor visit", "Since medication change"

### API Enhancements

```typescript
// Server-side filtering
GET /api/statistics?start_date=2026-01-01&end_date=2026-01-31

// Aggregation options
GET /api/statistics?range=7days&granularity=hourly
GET /api/statistics?range=3months&granularity=weekly
```

---

## Code Quality

### Type Safety
- ✅ Strict TypeScript types for TimeRange
- ✅ Proper date string validation
- ✅ Type-safe state management

### Performance
- ✅ Single API fetch for multiple ranges
- ✅ Client-side filtering (fast)
- ✅ Memoized calculations where needed

### Maintainability
- ✅ Clear function names
- ✅ Separated concerns (filtering logic)
- ✅ Reusable helper functions
- ✅ Consistent code style

---

## Related Files

- `web/src/pages/statistics.tsx` - Main implementation
- `web/src/lib/demoData.ts` - Demo data generation
- `web/src/lib/api.ts` - API client
- `backend/src/routes/statistics.ts` - Backend endpoint

---

## User Guide

### How to Use

1. **Navigate** to Statistics page from dashboard
2. **View** current data (default: 30 days)
3. **Click** time range button (7 days, 30 days, 3 months)
4. **Charts update** automatically with filtered data
5. **For custom range**:
   - Click "Valitse aikaväli"
   - Select start and end dates
   - Click "Näytä" to apply

### Tips

- **Quick comparison**: Switch between time ranges to spot trends
- **Focus periods**: Use custom range for specific monitoring periods
- **Weekly checks**: Use 7-day view for medication effects
- **Doctor visits**: Use custom range for appointment preparation

---

## Accessibility

- ✅ Keyboard navigation (Tab, Enter, Space)
- ✅ Date inputs with native browser pickers
- ✅ Clear button labels
- ✅ Visible focus indicators
- ✅ Screen reader friendly
- ✅ Touch-friendly button sizes (44x44px minimum)
- ✅ High contrast colors

---

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Native date inputs supported in all modern browsers.

---

## Summary

This feature transforms the statistics page from a fixed 30-day view to a flexible analysis tool that adapts to user needs. Whether checking yesterday's readings (7-day view) or tracking long-term progress (3-month view), users now have complete control over their health data visualization.

**Status**: ✅ Implemented, Tested, Production-Ready  
**Impact**: High value, minimal complexity, excellent UX
