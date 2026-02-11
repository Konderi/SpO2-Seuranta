# Hapetus Design System - Premium UX for Elderly Users

## Design Philosophy
Professional, accessible, award-winning interface inspired by modern design leaders while optimized for elderly users with respiratory conditions.

## Core Principles
1. **Clarity Over Complexity** - Every element serves a purpose
2. **Accessibility First** - WCAG AAA compliance where possible
3. **Trust Through Design** - Medical-grade visual language
4. **Inclusive by Default** - Works for all ages and abilities
5. **Delight in Details** - Micro-interactions that reassure

## Typography Scale

### Headings (Elderly-Optimized)
- H1: 3.5rem (56px) / Bold / Line-height: 1.2
- H2: 2.5rem (40px) / Bold / Line-height: 1.3
- H3: 2rem (32px) / Semibold / Line-height: 1.4
- H4: 1.5rem (24px) / Semibold / Line-height: 1.4

### Body Text (Large Mode Default)
- Body Large: 1.25rem (20px) / Regular / Line-height: 1.6
- Body Regular: 1.125rem (18px) / Regular / Line-height: 1.6
- Body Small: 1rem (16px) / Regular / Line-height: 1.5
- Caption: 0.875rem (14px) / Medium / Line-height: 1.5

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Color System

### Primary Palette (Trust & Medical)
- Primary Blue: `hsl(210, 100%, 55%)` - #0088FF
- Primary Dark: `hsl(210, 100%, 45%)` - #0070CC
- Primary Light: `hsl(210, 100%, 95%)` - #E6F4FF

### Semantic Colors
- Success Green: `hsl(142, 76%, 45%)` - #1CB854
- Warning Orange: `hsl(38, 92%, 55%)` - #F59E0B
- Error Red: `hsl(0, 84%, 60%)` - #EF4444
- Info Blue: `hsl(210, 100%, 55%)` - #0088FF

### Neutral Palette (High Contrast)
- Background: `hsl(0, 0%, 100%)` - White
- Surface: `hsl(210, 20%, 98%)` - Off-white
- Border: `hsl(210, 20%, 90%)` - Light gray
- Text Primary: `hsl(210, 20%, 10%)` - Near black
- Text Secondary: `hsl(210, 15%, 40%)` - Medium gray
- Text Disabled: `hsl(210, 10%, 60%)` - Light gray

### Data Visualization
- SpO2 Healthy: `hsl(142, 76%, 45%)` - Green
- SpO2 Warning: `hsl(38, 92%, 55%)` - Orange
- SpO2 Critical: `hsl(0, 84%, 60%)` - Red
- Heart Rate: `hsl(0, 84%, 60%)` - Red
- Trend Positive: `hsl(142, 76%, 45%)` - Green
- Trend Negative: `hsl(0, 84%, 60%)` - Red

## Spacing Scale (8px base)
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)
- 2xl: 4rem (64px)
- 3xl: 6rem (96px)

## Touch Targets (Elderly-Optimized)
- Minimum: 48x48px (WCAG 2.1)
- Preferred: 56x56px (Easier for elderly)
- Large Buttons: 64x64px (Primary actions)
- Icon-only: 72x72px (To account for reduced motor control)

## Border Radius
- Small (inputs): 8px
- Medium (cards): 12px
- Large (modals): 16px
- Full (pills): 9999px

## Shadows (Depth System)
- Elevation 1: `0 1px 3px rgba(0,0,0,0.12)`
- Elevation 2: `0 4px 6px rgba(0,0,0,0.1)`
- Elevation 3: `0 10px 15px rgba(0,0,0,0.1)`
- Elevation 4: `0 20px 25px rgba(0,0,0,0.15)`

## Motion & Animation
- Fast: 150ms (micro-interactions)
- Normal: 250ms (standard transitions)
- Slow: 350ms (complex animations)
- Ease: cubic-bezier(0.4, 0, 0.2, 1)

### Animation Principles
- **Purposeful**: Every animation has a clear purpose
- **Subtle**: Never distracting or overwhelming
- **Optional**: Respect prefers-reduced-motion
- **Feedback**: Confirm user actions
- **Guide**: Direct attention naturally

## Component Specifications

### Buttons
```
Primary Button:
- Height: 56px (large), 48px (medium)
- Padding: 16px 32px
- Font-size: 18px
- Font-weight: 600
- Border-radius: 12px
- Min-width: 120px

Secondary Button:
- Same dimensions
- Border: 2px solid
- Background: transparent

Icon Button:
- Size: 56x56px
- Icon: 24px
- Padding: 16px
```

### Input Fields
```
Text Input:
- Height: 56px
- Padding: 16px
- Font-size: 18px
- Border: 2px solid
- Border-radius: 12px
- Label: 16px, 600 weight, above input

Focus State:
- Border: 3px solid primary
- Outline: 2px solid primary-light
- Total visible border: 5px (highly visible)
```

### Cards
```
Standard Card:
- Padding: 24px
- Border-radius: 16px
- Shadow: elevation-2
- Background: white
- Border: 1px solid border-color

Interactive Card:
- Add hover: elevation-3
- Add active: elevation-1
- Transition: 250ms
```

### Navigation
```
Top Bar:
- Height: 80px
- Padding: 0 24px
- Background: white
- Shadow: elevation-1
- Sticky: top

Menu Items:
- Min-height: 56px
- Font-size: 18px
- Padding: 16px 24px
- Active indicator: 4px left border
```

## Accessibility Requirements

### Contrast Ratios
- Body Text: 7:1 (AAA)
- Large Text: 4.5:1 (AAA)
- UI Components: 3:1 (AA)
- Active Elements: 3:1 (AA)

### Focus Indicators
- Visible: Always
- Style: 3px solid outline
- Color: Primary blue
- Offset: 2px from element
- Never remove: :focus-visible only

### Screen Reader Support
- Semantic HTML: Always
- ARIA labels: When needed
- Live regions: For dynamic content
- Skip links: For navigation
- Keyboard shortcuts: Documented

### Internationalization
- Language: Finnish primary
- Text expansion: Allow 30% more space
- RTL support: Not required (Finnish is LTR)
- Date format: DD.MM.YYYY
- Number format: European (comma decimal)

## Responsive Breakpoints
- Mobile: 0-640px (single column)
- Tablet: 641px-1024px (flexible columns)
- Desktop: 1025px-1440px (multi-column)
- Wide: 1441px+ (max-width container)

### Mobile-First Strategy
1. Design for mobile first
2. Enhance for larger screens
3. Never hide critical features on mobile
4. Touch-optimized by default

## Error Handling & Feedback

### Success States
- Color: Success green
- Icon: Checkmark
- Duration: 5 seconds
- Position: Top-right toast
- Sound: Optional gentle chime

### Error States
- Color: Error red
- Icon: Alert circle
- Duration: Until dismissed
- Position: Inline + top toast
- Message: Clear, actionable

### Loading States
- Skeleton screens: For content
- Spinners: For actions
- Progress bars: For multi-step
- Optimistic UI: When safe

## Content Guidelines

### Finnish Language
- Tone: Respectful, caring, professional
- Vocabulary: Simple, medical terms explained
- Sentences: Short, clear, one idea per sentence
- Instructions: Step-by-step, numbered
- Feedback: Always positive and encouraging

### Measurement Display
- SpO2: "96%" (large, bold, colored)
- Heart Rate: "72 bpm" (clear units)
- Trend: Arrow icon + percentage
- Time: "10 min sitten" (relative)
- Date: "11.2.2026" (European)

## Implementation Notes

### Performance
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: 90+
- Bundle size: <200KB initial
- Images: WebP with fallbacks

### Browser Support
- Modern evergreen browsers
- Last 2 versions
- No IE11 support
- Progressive enhancement

### Testing Requirements
- Manual testing with elderly users
- Keyboard navigation: Complete
- Screen reader: NVDA/JAWS
- Color blindness: Sim tools
- Mobile devices: Real devices
