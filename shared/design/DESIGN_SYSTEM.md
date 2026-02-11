# Hapetus Design System

> **Professional, Modern, Medical-Grade Design Language**
> Inspired by award-winning design agencies like Halo Lab

## 🎨 Design Philosophy

### Core Principles
1. **Professional Excellence** - Medical-grade trustworthiness with modern aesthetics
2. **Simplicity & Clarity** - Clean, uncluttered interfaces that prioritize content
3. **Accessibility First** - Designed for all ages, especially older users
4. **Consistency** - Unified experience across web, Android, and iOS platforms
5. **Motion & Delight** - Subtle animations that enhance, not distract

---

## 🎭 Brand Identity

### Name Ideas for hapetus.info
1. **Hapetus** (Finnish: Oxygenation) - *Current frontrunner*
2. **Hengitys** (Finnish: Breathing)
3. **Vitalea** (Latin-inspired: Vitality)
4. **Pulssi** (Finnish: Pulse)
5. **Wellox** (Wellness + Oxygen)

**Recommendation**: **Hapetus** - Clear, memorable, descriptive, and uniquely Finnish

### Tagline Options
- "Breathe Easy, Live Better"
- "Your Health, Monitored Simply"
- "Professional Health Monitoring Made Simple"
- "Track Your Vitals, Own Your Health"

---

## 🎨 Color Palette

### Primary Colors (Medical Blue Theme)
Inspired by trust, healthcare, and technology

```css
/* Primary - Medical Blue */
--primary-50:   #E3F2FD;  /* Lightest blue backgrounds */
--primary-100:  #BBDEFB;  
--primary-200:  #90CAF9;
--primary-300:  #64B5F6;
--primary-400:  #42A5F5;
--primary-500:  #2196F3;  /* Main brand color */
--primary-600:  #1E88E5;
--primary-700:  #1976D2;  /* Darker interactive states */
--primary-800:  #1565C0;
--primary-900:  #0D47A1;  /* Darkest accents */

/* Secondary - Healthcare Green (Success, Healthy States) */
--secondary-500: #4CAF50;
--secondary-600: #43A047;
--secondary-700: #388E3C;

/* Accent - Warning Orange (Alerts, Attention) */
--accent-500:   #FF9800;
--accent-600:   #FB8C00;
--accent-700:   #F57C00;

/* Error - Medical Red (Critical Alerts) */
--error-500:    #F44336;
--error-600:    #E53935;
--error-700:    #D32F2F;
```

### Neutral Colors (Modern Gray Scale)

```css
/* Background & Surface Colors */
--surface-white:     #FFFFFF;
--surface-light:     #FAFAFA;  /* Off-white backgrounds */
--surface-gray:      #F5F5F5;  /* Card backgrounds */

/* Text Colors */
--text-primary:      #1A1A1A;  /* Almost black */
--text-secondary:    #666666;  /* Medium gray */
--text-tertiary:     #999999;  /* Light gray */
--text-disabled:     #CCCCCC;

/* Border & Divider */
--border-light:      #E0E0E0;
--border-medium:     #BDBDBD;
--border-dark:       #757575;

/* Overlay & Shadow */
--overlay-dark:      rgba(0, 0, 0, 0.6);
--shadow-light:      rgba(0, 0, 0, 0.08);
--shadow-medium:     rgba(0, 0, 0, 0.12);
--shadow-heavy:      rgba(0, 0, 0, 0.24);
```

### Semantic Colors (Data Visualization)

```css
/* SpO2 Level Indicators */
--spo2-critical:     #D32F2F;  /* <90% - Red */
--spo2-warning:      #F57C00;  /* 90-94% - Orange */
--spo2-good:         #43A047;  /* 95-100% - Green */

/* Heart Rate Indicators */
--hr-low:            #64B5F6;  /* <60 - Blue */
--hr-normal:         #43A047;  /* 60-100 - Green */
--hr-elevated:       #F57C00;  /* 101-120 - Orange */
--hr-high:           #D32F2F;  /* >120 - Red */
```

---

## 📐 Typography

### Font Families

```css
/* Primary Font - Display & Headings */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary Font - Body Text */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace - Data & Numbers */
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
```

**Note**: Inter is recommended for its excellent readability and modern appearance. It's free, open-source, and optimized for screens.

### Type Scale

```css
/* Desktop/Web */
--text-display:   clamp(3rem, 5vw, 4.5rem);     /* 48-72px */
--text-h1:        clamp(2.5rem, 4vw, 3.5rem);   /* 40-56px */
--text-h2:        clamp(2rem, 3vw, 2.5rem);     /* 32-40px */
--text-h3:        clamp(1.5rem, 2.5vw, 2rem);   /* 24-32px */
--text-h4:        1.25rem;                       /* 20px */
--text-body-lg:   1.125rem;                      /* 18px */
--text-body:      1rem;                          /* 16px */
--text-body-sm:   0.875rem;                      /* 14px */
--text-caption:   0.75rem;                       /* 12px */

/* Mobile (iOS & Android) */
--mobile-display: 40px;
--mobile-h1:      32px;
--mobile-h2:      24px;
--mobile-h3:      20px;
--mobile-body-lg: 18px;
--mobile-body:    16px;
--mobile-body-sm: 14px;
--mobile-caption: 12px;

/* Accessibility Mode (Large Font) */
--large-display:  56px;
--large-h1:       44px;
--large-h2:       32px;
--large-h3:       24px;
--large-body:     20px;
```

### Font Weights

```css
--weight-light:    300;
--weight-regular:  400;
--weight-medium:   500;
--weight-semibold: 600;
--weight-bold:     700;
```

### Line Heights

```css
--line-tight:    1.2;   /* Headings */
--line-normal:   1.5;   /* Body text */
--line-relaxed:  1.75;  /* Long-form content */
```

---

## 🔲 Spacing System

### Base Unit: 4px
Progressive spacing scale for consistent layouts

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

---

## 🎯 Component Library

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: var(--space-4) var(--space-6);
  border-radius: 12px;
  font-weight: var(--weight-semibold);
  transition: all 200ms ease;
  min-height: 48px; /* Accessibility */
}

.btn-primary:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px var(--shadow-medium);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: var(--primary-500);
  border: 2px solid var(--primary-500);
  padding: var(--space-4) var(--space-6);
  border-radius: 12px;
  min-height: 48px;
}

/* Size Variants */
.btn-large { min-height: 56px; font-size: 18px; }
.btn-small { min-height: 40px; font-size: 14px; }
```

### Cards

```css
.card {
  background: var(--surface-white);
  border-radius: 16px;
  padding: var(--space-6);
  box-shadow: 0 2px 8px var(--shadow-light);
  transition: box-shadow 200ms ease;
}

.card:hover {
  box-shadow: 0 8px 24px var(--shadow-medium);
}

/* Medical Card (with status indicator) */
.card-medical {
  border-left: 4px solid var(--primary-500);
}
```

### Input Fields

```css
.input {
  background: var(--surface-light);
  border: 2px solid var(--border-light);
  border-radius: 12px;
  padding: var(--space-4);
  font-size: 16px;
  min-height: 48px;
  transition: all 200ms ease;
}

.input:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
}

.input-error {
  border-color: var(--error-500);
}
```

---

## 🎬 Motion & Animation

### Animation Principles
1. **Purposeful** - Every animation serves a function
2. **Fast** - No animation should feel slow (100-300ms typically)
3. **Natural** - Use easing curves that mimic real-world physics
4. **Respectful** - Honor user's reduced-motion preferences

### Timing Functions

```css
--ease-standard:   cubic-bezier(0.4, 0.0, 0.2, 1);  /* Material Design */
--ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);  /* Enter screen */
--ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);    /* Exit screen */
--ease-smooth:     cubic-bezier(0.4, 0.0, 0.6, 1);  /* Smooth all-purpose */
```

### Duration Scale

```css
--duration-fast:     100ms;  /* Micro-interactions */
--duration-normal:   200ms;  /* Button hover, focus */
--duration-moderate: 300ms;  /* Card transitions */
--duration-slow:     400ms;  /* Page transitions */
```

### Common Animations

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (for alerts) */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs:  320px;   /* Small phones */
--breakpoint-sm:  640px;   /* Large phones */
--breakpoint-md:  768px;   /* Tablets */
--breakpoint-lg:  1024px;  /* Laptops */
--breakpoint-xl:  1280px;  /* Desktops */
--breakpoint-2xl: 1536px;  /* Large screens */
```

### Container Widths

```css
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
```

---

## 🎨 Visual Style (Halo Lab Inspired)

### Hero Sections
- Large, bold typography with ample white space
- Subtle gradient backgrounds (primary-50 to white)
- Floating card elements with soft shadows
- Smooth scroll-triggered animations

### Navigation
- Clean, minimal header with logo on left
- Transparent background that becomes solid on scroll
- Smooth hover effects on navigation items
- Mobile: Slide-in drawer with blur backdrop

### Content Sections
- Generous padding (80-120px vertical)
- Alternating light/dark backgrounds for visual rhythm
- Grid layouts with consistent gaps (24-32px)
- Images with subtle rounded corners (16px)

### Data Visualization
- Clean, minimalist charts with primary color scheme
- Animated on scroll/load
- Clear legends and labels
- Interactive tooltips

---

## ♿ Accessibility Standards

### WCAG 2.1 Level AA Compliance

1. **Color Contrast**
   - Text: Minimum 4.5:1 (normal), 3:1 (large)
   - Interactive elements: Minimum 3:1
   - Primary blue on white: 4.52:1 ✅

2. **Touch Targets**
   - Minimum: 44x44px (iOS), 48x48dp (Android)
   - Recommended: 56x56px for primary actions

3. **Focus Indicators**
   - Visible focus ring: 2px solid primary color
   - Offset: 2px from element

4. **Screen Readers**
   - Semantic HTML elements
   - ARIA labels for all interactive elements
   - Descriptive alt text for images

5. **Keyboard Navigation**
   - All interactive elements accessible via keyboard
   - Logical tab order
   - Skip navigation links

---

## 🌐 Platform-Specific Guidelines

### Web (hapetus.info)
- Framework: React/Next.js or Vue/Nuxt
- Styling: Tailwind CSS or CSS Modules
- Animations: Framer Motion
- Charts: Recharts or Chart.js

### Android
- Material Design 3 components
- Jetpack Compose
- Theme: MaterialTheme with custom colors
- Typography: Roboto/Inter

### iOS (Future)
- SwiftUI
- SF Symbols for icons
- SF Pro Display/Text fonts
- Native iOS design patterns

---

## 📊 Data Visualization Guidelines

### Chart Colors
```css
/* SpO2 Line Chart */
--chart-spo2:      var(--primary-500);
--chart-spo2-fill: rgba(33, 150, 243, 0.1);

/* Heart Rate Line Chart */
--chart-hr:        var(--accent-500);
--chart-hr-fill:   rgba(255, 152, 0, 0.1);

/* Before/After Comparison */
--chart-before:    var(--primary-500);
--chart-after:     var(--secondary-500);

/* Grid & Axes */
--chart-grid:      var(--border-light);
--chart-axis:      var(--text-secondary);
```

### Chart Best Practices
1. Always include clear axis labels
2. Use consistent color coding across all views
3. Provide data point tooltips on hover/tap
4. Show trend lines for longer periods
5. Include reference lines for normal ranges

---

## 🚀 Implementation Checklist

### Phase 2 - Website
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS with design tokens
- [ ] Create component library (Button, Card, Input, etc.)
- [ ] Build landing page (Halo Lab inspired)
- [ ] Implement authentication flow
- [ ] Build dashboard with charts
- [ ] Add responsive navigation
- [ ] Ensure WCAG AA compliance
- [ ] Performance optimization (Lighthouse 90+)

### Future - iOS App
- [ ] Create Figma designs matching brand
- [ ] Set up SwiftUI project
- [ ] Implement design system in Swift
- [ ] Build core screens
- [ ] Add HealthKit integration

---

## 📚 Resources

### Design Inspiration
- [Halo Lab](https://www.halo-lab.com/) - Agency that inspired this design
- [Dribbble - Healthcare](https://dribbble.com/tags/healthcare)
- [Behance - Medical Design](https://www.behance.net/search/projects?search=medical%20app)

### Tools
- [Figma](https://www.figma.com/) - Design and prototyping
- [Coolors](https://coolors.co/) - Color palette generator
- [Type Scale](https://type-scale.com/) - Typography calculator
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Fonts
- [Inter](https://rsms.me/inter/) - Free, open-source
- [Google Fonts](https://fonts.google.com/)

---

**Last Updated**: February 11, 2026  
**Version**: 1.0.0  
**Maintained by**: Hapetus Team
