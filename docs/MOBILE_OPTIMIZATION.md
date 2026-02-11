# Mobile Optimization - Website Responsive Issues

## Status
📱 **Priority:** HIGH
🎯 **Target:** Improve mobile user experience on statistics and history pages

## Issues Found

### 1. Statistics Page - Custom Date Range Picker
**Problem:** Custom date range inputs don't fit properly on mobile screens
- Date inputs are too wide
- Layout breaks on small screens
- Buttons overlap or go off-screen

**Files:**
- `web/src/pages/statistics.tsx`

**Fix Needed:**
- Stack date inputs vertically on mobile
- Reduce input sizes for mobile
- Add proper spacing between elements
- Use Tailwind responsive classes (sm:, md:, lg:)

### 2. History Page - Data Table
**Problem:** Measurement history table doesn't scroll properly on mobile
- Table columns too wide
- Horizontal scroll not intuitive
- Data truncated or overlapping

**Files:**
- `web/src/pages/history.tsx`

**Fix Needed:**
- Make table responsive
- Consider card layout for mobile instead of table
- Add horizontal scroll indicators
- Reduce column widths or hide non-essential columns on mobile

### 3. Statistics Page - Chart Responsiveness
**Problem:** Charts may not scale properly on very small screens
- Legend overlaps chart
- Axis labels may be cut off

**Files:**
- `web/src/pages/statistics.tsx`

**Fix Needed:**
- Adjust chart height for mobile
- Reposition legend for mobile (bottom instead of right)
- Reduce font sizes on mobile

### 4. Export Buttons
**Problem:** Export button group may be too wide on mobile

**Files:**
- `web/src/pages/statistics.tsx`
- `web/src/pages/history.tsx`

**Fix Needed:**
- Stack buttons vertically on mobile
- Use icon-only buttons with tooltips on small screens
- Add dropdown menu for mobile

## Implementation Plan

### Phase 1: Statistics Page Custom Range
```tsx
// Before
<div className="flex gap-4">
  <input type="date" className="w-full" />
  <input type="date" className="w-full" />
  <button>Hae</button>
</div>

// After
<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
  <input type="date" className="w-full sm:w-auto" />
  <input type="date" className="w-full sm:w-auto" />
  <button className="w-full sm:w-auto">Hae</button>
</div>
```

### Phase 2: History Table to Cards
```tsx
// Mobile: Card layout
<div className="block md:hidden">
  {measurements.map(m => (
    <div className="card mb-4">
      <div className="flex justify-between">
        <span>{m.date}</span>
        <span>{m.spo2}%</span>
      </div>
    </div>
  ))}
</div>

// Desktop: Table layout
<table className="hidden md:table">
  ...
</table>
```

### Phase 3: Export Button Group
```tsx
// Mobile: Vertical stack or dropdown
<div className="flex flex-col sm:flex-row gap-2">
  <button className="w-full sm:w-auto">
    <FileDown className="w-4 h-4 sm:mr-2" />
    <span className="sm:inline">CSV</span>
  </button>
  ...
</div>
```

### Phase 4: Chart Adjustments
```tsx
// Adjust chart configuration for mobile
const chartHeight = window.innerWidth < 640 ? 250 : 400

<ResponsiveContainer width="100%" height={chartHeight}>
  <AreaChart data={chartData}>
    <Legend 
      layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
      verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
    />
  </AreaChart>
</ResponsiveContainer>
```

## Testing Checklist

- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13 (390px width)
- [ ] iPhone 14 Pro Max (430px width)
- [ ] Samsung Galaxy S9 (360px width)
- [ ] iPad Mini (768px width)
- [ ] Test in portrait and landscape
- [ ] Test all time ranges (7d, 30d, 3m, custom)
- [ ] Test export functions on mobile
- [ ] Verify charts are readable
- [ ] Check scrolling behavior

## Success Criteria

✅ Custom date range fits on smallest phones (320px+)
✅ All text is readable without zooming
✅ Buttons are easily tappable (min 44x44px)
✅ Tables scroll smoothly or use card layout
✅ Charts display properly with all elements visible
✅ Export buttons accessible on all screen sizes
✅ No horizontal overflow or layout breaks

## Related Files

- `web/src/pages/statistics.tsx` (Primary)
- `web/src/pages/history.tsx` (Primary)
- `web/src/lib/exportUtils.ts`
- `web/src/styles/globals.css` (responsive utilities)

## Timeline

- **Estimated Time:** 2-3 hours
- **Priority:** Complete before wider user testing
- **Dependencies:** None (can start immediately)

---

**Created:** 11.2.2026
**Status:** 🔴 Not Started
