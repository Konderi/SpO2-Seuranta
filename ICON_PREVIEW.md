# SpO2 Custom Icons Preview

This document shows visual descriptions of each custom icon created for the Daily (SpO2) tab.

## Icon Options

### 1. ic_oxygen_symbol.xml - O₂ Symbol
```
    ┌─────────┐
   ╱           ╲
  │             │
  │   O    ₂    │  ← Clean O₂ text inside circle
  │             │
   ╲           ╱
    └─────────┘
```
**Description:** Simple circle with "O₂" text inside. Professional medical appearance.

---

### 2. ic_pulse_oximeter.xml - Pulse Oximeter Device
```
    ┌─────────┐
    │ ▔▔▔▔▔ │  ← Display screen with pulse wave
    │  ⌇⌇⌇   │
    └─────────┘
         │
    │────────│  ← Finger clip body
    │  👆   │
    └────────┘
```
**Description:** Finger clip device with display screen showing pulse wave. Represents the actual measurement tool.

---

### 3. ic_blood_oxygen.xml - Blood Drop with O₂
```
       ╱╲
      ╱  ╲
     │ O₂ │  ← O₂ text inside blood drop
     │    │
      ╲  ╱
       ╲╱
        ●
```
**Description:** Blood drop shape with "O₂" inside. Combines blood and oxygen concepts.

---

### 4. ic_lungs_oxygen.xml - Lungs with Oxygen
```
       │        ← Trachea
      ╱ ╲
    ╱     ╲
   │   ●   │   ← Left and right lungs with O₂ molecules
    ╲     ╱
     ─────
```
**Description:** Anatomical lungs with small oxygen molecules. Direct breathing/respiratory representation.

---

### 5. ic_heartbeat_oxygen.xml - ECG + O₂
```
    ⌇⌇⌇⌇   ┌───┐
  ─╱ ╲╱ ╲─ │O₂ │  ← Pulse wave + O₂ in circle
           └───┘
```
**Description:** ECG/pulse waveform combined with O₂ symbol in circle. Dynamic vital signs feel.

---

### 6. ic_blood_saturation.xml - Blood Drop with Level
```
       ╱╲
      ╱  ╲
     │ ⌇⌇ │  ← Pulse wave inside
     │████│  ← Fill level showing saturation
      ╲  ╱
       ╲╱
        ●
```
**Description:** Blood drop with fill level indicator and pulse wave. Shows measurement/saturation concept.

---

## Quick Preview Test

To see these icons in your app, I need to:
1. Update AppNavigation.kt to use the icon
2. Build the app
3. Install on your device

**Which icon number (1-6) would you like to try first?**

Or would you like me to create a test screen that shows all 6 icons side-by-side?
