# Print Format Examples

This document shows how the print output looks for both Statistics and History pages.

## Statistics Print Format

**Title:** Hapetus Tilastot - 30 päivää  
**Metadata:** Tulostettu: 12.2.2026 klo 0.03.01

```
┌────────────────────────────────────┬─────────────────────────────────┐
│ Label (Bold, Dark Blue)            │ Value (Medium Gray)             │
├────────────────────────────────────┼─────────────────────────────────┤
│ Raportti                           │ Hapetus Terveystilastot         │
│ Luotu                              │ 12.2.2026 klo 0.03.01          │
│ Aikaväli                           │ 30 päivää                       │
│ SpO2 Viimeisin                     │ 95%                             │
│ SpO2 Keskiarvo (7pv)               │ 96%                             │
│ SpO2 Keskiarvo (30pv)              │ 95%                             │
│ SpO2 Minimi                        │ 92%                             │
│ SpO2 Maksimi                       │ 97%                             │
│ Syke Viimeisin                     │ 70 bpm                          │
│ Syke Keskiarvo (7pv)               │ 70 bpm                          │
│ Syke Keskiarvo (30pv)              │ 73 bpm                          │
│ Syke Minimi                        │ 65 bpm                          │
│ Syke Maksimi                       │ 85 bpm                          │
│ Mittauksia yhteensä                │ 79                              │
│ Liikuntakertoja                    │ 14                              │
└────────────────────────────────────┴─────────────────────────────────┘
```

**Font Sizes:**
- Title: 28px (bold, dark blue)
- Labels: 18px (bold, dark blue)
- Values: 18px (medium gray)
- Metadata: 16px

---

## History Print Format

**Title:** Hapetus Mittaushistoria - Kaikki mittaukset  
**Metadata:** Tulostettu: 12.2.2026 klo 0.15.30

### Example 1: Daily Measurement

```
┌────────────────────────────────────┬─────────────────────────────────┐
│ Päivämäärä                         │ 11.02.2026 klo 08.30           │
│ Tyyppi                             │ Päivittäinen                    │
│ SpO2 (%)                           │ 96                              │
│ Syke (bpm)                         │ 72                              │
│ Huomiot                            │ Aamumittaus, hyvä olo           │
│ Liikunta                           │                                 │
│ Kesto (min)                        │                                 │
│ Intensiteetti                      │                                 │
├────────────────────────────────────┴─────────────────────────────────┤
│                      (gray separator line)                           │
├────────────────────────────────────┬─────────────────────────────────┤
│ Päivämäärä                         │ 11.02.2026 klo 20.15           │
│ Tyyppi                             │ Päivittäinen                    │
│ SpO2 (%)                           │ 95                              │
│ Syke (bpm)                         │ 68                              │
│ Huomiot                            │                                 │
│ Liikunta                           │                                 │
│ Kesto (min)                        │                                 │
│ Intensiteetti                      │                                 │
└────────────────────────────────────┴─────────────────────────────────┘
```

### Example 2: Exercise Measurements (Before & After)

```
┌────────────────────────────────────┬─────────────────────────────────┐
│ Päivämäärä                         │ 10.02.2026 klo 16.00           │
│ Tyyppi                             │ Liikunta (ennen)                │
│ SpO2 (%)                           │ 96                              │
│ Syke (bpm)                         │ 70                              │
│ Huomiot                            │ Ennen kävelylenkkiä             │
│ Liikunta                           │ Kävely                          │
│ Kesto (min)                        │ 30                              │
│ Intensiteetti                      │ Kevyt                           │
├────────────────────────────────────┴─────────────────────────────────┤
│                      (gray separator line)                           │
├────────────────────────────────────┬─────────────────────────────────┤
│ Päivämäärä                         │ 10.02.2026 klo 16.35           │
│ Tyyppi                             │ Liikunta (jälkeen)              │
│ SpO2 (%)                           │ 94                              │
│ Syke (bpm)                         │ 85                              │
│ Huomiot                            │ Kävelylenkki suoritettu         │
│ Liikunta                           │ Kävely                          │
│ Kesto (min)                        │ 30                              │
│ Intensiteetti                      │ Kevyt                           │
├────────────────────────────────────┴─────────────────────────────────┤
│                      (gray separator line)                           │
├────────────────────────────────────┬─────────────────────────────────┤
│ Päivämäärä                         │ 09.02.2026 klo 14.00           │
│ Tyyppi                             │ Liikunta (ennen)                │
│ SpO2 (%)                           │ 97                              │
│ Syke (bpm)                         │ 68                              │
│ Huomiot                            │                                 │
│ Liikunta                           │ Pyöräily                        │
│ Kesto (min)                        │ 45                              │
│ Intensiteetti                      │ Kohtalainen                     │
└────────────────────────────────────┴─────────────────────────────────┘
```

### Example 3: Mixed Data (Daily + Exercise)

```
┌────────────────────────────────────┬─────────────────────────────────┐
│ Päivämäärä                         │ 12.02.2026 klo 08.00           │
│ Tyyppi                             │ Päivittäinen                    │
│ SpO2 (%)                           │ 95                              │
│ Syke (bpm)                         │ 70                              │
│ Huomiot                            │ Normaali aamumittaus            │
│ Liikunta                           │                                 │
│ Kesto (min)                        │                                 │
│ Intensiteetti                      │                                 │
├────────────────────────────────────┴─────────────────────────────────┤
│                      (gray separator line)                           │
├────────────────────────────────────┬─────────────────────────────────┤
│ Päivämäärä                         │ 11.02.2026 klo 17.30           │
│ Tyyppi                             │ Liikunta (ennen)                │
│ SpO2 (%)                           │ 96                              │
│ Syke (bpm)                         │ 72                              │
│ Huomiot                            │ Ennen uintia                    │
│ Liikunta                           │ Uinti                           │
│ Kesto (min)                        │ 60                              │
│ Intensiteetti                      │ Raskas                          │
├────────────────────────────────────┴─────────────────────────────────┤
│                      (gray separator line)                           │
├────────────────────────────────────┬─────────────────────────────────┤
│ Päivämäärä                         │ 11.02.2026 klo 18.35           │
│ Tyyppi                             │ Liikunta (jälkeen)              │
│ SpO2 (%)                           │ 92                              │
│ Syke (bpm)                         │ 88                              │
│ Huomiot                            │ Uinti valmis, väsynyt           │
│ Liikunta                           │ Uinti                           │
│ Kesto (min)                        │ 60                              │
│ Intensiteetti                      │ Raskas                          │
└────────────────────────────────────┴─────────────────────────────────┘
```

---

## Key Features

### Format Characteristics

1. **One Entry Per Line**
   - Clean, scannable layout
   - Label on left, value on right
   - No unnecessary punctuation

2. **Clear Separators**
   - Gray separator line between measurements
   - Light background on separator for visual distinction
   - Maintains readability when many measurements

3. **Empty Values Handled**
   - Empty fields still shown (for consistency)
   - Daily measurements: Exercise fields empty
   - Exercise measurements: All fields filled

4. **Professional Typography**
   - Labels: Bold, 18px, #2c3e50 (dark blue)
   - Values: Regular, 18px, #34495e (medium gray)
   - Excellent readability at both screen and print sizes

5. **Responsive to Content**
   - Adapts to any number of measurements
   - Scrollable in preview window
   - Proper page breaks when printing

### Data Fields Included

**All Measurements:**
- Päivämäärä (Date & Time)
- Tyyppi (Type: Daily, Exercise Before/After)
- SpO2 (%) 
- Syke (bpm) / Heart Rate

**Exercise Measurements Only:**
- Huomiot (Notes)
- Liikunta (Exercise Type: Kävely, Pyöräily, Uinti, etc.)
- Kesto (min) (Duration in minutes)
- Intensiteetti (Intensity: Kevyt, Kohtalainen, Raskas)

### Print Settings

**Screen View:**
- Font: 18px
- Padding: 12px per cell
- Max width: 1000px (centered)

**Print View:**
- Font: 16px (slightly smaller for paper)
- Padding: 10px per cell
- Margins: 15mm on all sides

---

## Comparison with Old Format

### Old Format Issues ❌
- Small font (11px) - hard to read
- CSV format with commas - cluttered
- Monospace font - unprofessional
- Showed undefined values
- No clear separation between records

### New Format Benefits ✅
- Large font (18px) - easy to read
- Table format - clean and organized
- Professional font (Arial) - modern
- Only valid data shown
- Clear separators between measurements
- Color-coded labels and values
- Better use of space
- Professional appearance

---

## Usage

### Statistics Page
Click "Tulosta" button → Opens print preview with summary statistics

### History Page  
Click "Tulosta" button → Opens print preview with all filtered measurements

Both automatically trigger the browser's print dialog where you can:
- Print to physical printer
- Save as PDF
- Adjust print settings (margins, orientation, etc.)

---

## Future Enhancements (Possible)

- [ ] Add page headers for multi-page prints
- [ ] Add page numbers
- [ ] Group exercise before/after measurements together
- [ ] Add summary statistics at top of history print
- [ ] Option to include/exclude empty fields
- [ ] Custom date range in title
- [ ] Add company/clinic logo option
- [ ] Chart/graph inclusion option
