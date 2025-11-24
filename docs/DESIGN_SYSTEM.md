# Tem_vaga Design System

## Overview

This design system provides a consistent, accessible, and modern visual language for the Tem_vaga platform. It prioritizes clarity, usability, and professional aesthetics.

## Design Principles

1. **Clarity First** - Every element should have a clear purpose
2. **Accessibility** - WCAG AA compliant contrast ratios and interactive states
3. **Consistency** - Reusable patterns across all pages
4. **Simplicity** - Clean, uncluttered interfaces
5. **Responsiveness** - Mobile-first, works on all devices

---

## Color Palette

### Primary Colors

```css
Primary Blue:
- 50:  #EBF5FF (lightest)
- 100: #D6EBFF
- 200: #AED7FF
- 300: #85C3FF
- 400: #5CAFFF
- 500: #58A6FF (base)
- 600: #3D8AE6
- 700: #2D6BB3
- 800: #1E4D80
- 900: #0F2E4D (darkest)

Usage:
- Primary actions (buttons, links)
- Brand elements
- Active states
- Focus indicators
```

### Accent Colors

```css
Accent Mint:
- 50:  #E5FFF5
- 100: #CCFFEB
- 200: #99FFD7
- 300: #7CFAC2 (base)
- 400: #5EE6AA
- 500: #40D392
- 600: #33B378
- 700: #26935E
- 800: #1A7344
- 900: #0D532A

Usage:
- Success states
- Highlights
- Secondary CTAs
- Confirmations
```

### Neutral Colors

```css
Neutral Gray:
- 50:  #F9FAFB (backgrounds)
- 100: #F3F4F6
- 200: #E5E7EB (borders)
- 300: #D1D5DB
- 400: #9CA3AF
- 500: #6B7280 (text secondary)
- 600: #4B5563
- 700: #374151
- 800: #212121 (text primary)
- 900: #111827

Usage:
- Text (800, 600, 500)
- Backgrounds (50, 100)
- Borders (200, 300)
- Disabled states (400)
```

### Semantic Colors

```css
Success: Green-500 (#10B981)
Warning: Orange-500 (#F59E0B)
Error: Red-500 (#EF4444)
Info: Blue-500 (#3B82F6)
```

---

## Typography

### Font Family

```css
Primary: System font stack
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Font Sizes

```css
text-xs:   12px / 16px (labels, captions)
text-sm:   14px / 20px (secondary text, form labels)
text-base: 16px / 24px (body text)
text-lg:   18px / 28px (large body, subheadings)
text-xl:   20px / 28px (card titles)
text-2xl:  24px / 32px (section headings)
text-3xl:  30px / 36px (page titles)
text-4xl:  36px / 40px (hero text)
text-5xl:  48px / 1 (large hero)
text-6xl:  60px / 1 (extra large hero)
```

### Font Weights

```css
font-normal:   400 (body text)
font-medium:   500 (labels, secondary headings)
font-semibold: 600 (form labels, important text)
font-bold:     700 (headings, CTAs)
font-extrabold: 800 (hero text)
```

### Usage Guidelines

- **Headings**: Bold or Extrabold
- **Body**: Normal (400)
- **Labels**: Semibold (600)
- **Buttons**: Bold (700)
- **Captions**: Medium (500)

---

## Spacing Scale

```css
xs:  4px  (tight spacing)
sm:  8px  (compact elements)
md:  16px (default spacing)
lg:  24px (section spacing)
xl:  32px (large gaps)
2xl: 48px (major sections)
3xl: 64px (page sections)
```

### Common Patterns

```css
Card padding: p-6 (24px)
Button padding: px-6 py-3 (24px horizontal, 12px vertical)
Input padding: px-4 py-3 (16px horizontal, 12px vertical)
Section gaps: space-y-6 (24px vertical)
Grid gaps: gap-4 or gap-6 (16px or 24px)
```

---

## Border Radius

```css
rounded-lg:   8px  (small elements)
rounded-xl:   12px (buttons, inputs, badges)
rounded-2xl:  16px (cards, containers)
rounded-full: 9999px (pills, avatars)
```

---

## Shadows

```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
  Usage: Subtle elevation (cards at rest)

shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
  Usage: Moderate elevation (hover states)

shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
  Usage: High elevation (modals, popovers)

shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1)
  Usage: Maximum elevation (dropdowns)
```

---

## Components

### Buttons

#### Primary Button
```tsx
<button className="
  px-6 py-3
  bg-primary-600 text-white
  font-bold text-base
  rounded-xl
  hover:bg-primary-700
  active:bg-primary-800
  disabled:opacity-50
  shadow-lg hover:shadow-xl
  transition-colors
">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3
  bg-white text-neutral-700
  font-semibold text-base
  rounded-xl
  border-2 border-neutral-300
  hover:bg-neutral-50 hover:border-neutral-400
  transition-all
">
  Secondary Action
</button>
```

#### Ghost Button
```tsx
<button className="
  px-6 py-3
  bg-transparent text-neutral-700
  font-medium text-base
  rounded-xl
  hover:bg-neutral-100
  transition-colors
">
  Ghost Action
</button>
```

### Inputs

```tsx
<input className="
  w-full px-4 py-3
  bg-white text-neutral-900
  border-2 border-neutral-300
  rounded-xl
  focus:border-primary-500
  focus:ring-2 focus:ring-primary-200
  focus:outline-none
  transition-all
" />
```

### Cards

```tsx
<div className="
  bg-white
  p-6
  rounded-2xl
  border-2 border-neutral-200
  hover:border-primary-300
  hover:shadow-md
  transition-all
">
  Card Content
</div>
```

### Badges

```tsx
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-lg
  text-xs font-semibold
  bg-green-100 text-green-700
  border border-green-200
">
  Status
</span>
```

---

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-neutral-50 py-12 px-4">
  <div className="max-w-7xl mx-auto space-y-6">
    {/* Page content */}
  </div>
</div>
```

### Card Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

### Form Layout
```tsx
<form className="space-y-5">
  <div>
    <label className="block text-sm font-semibold text-neutral-700 mb-2">
      Label
    </label>
    <input className="..." />
  </div>
</form>
```

---

## Accessibility

### Focus States
All interactive elements must have visible focus states:
```css
focus:outline-none
focus:ring-2 focus:ring-primary-200
focus:border-primary-500
```

### Color Contrast
- Text on white: Minimum neutral-700 (4.5:1 ratio)
- Text on primary: White only
- Borders: Minimum neutral-300

### Touch Targets
- Minimum size: 44x44px
- Buttons: py-3 (12px) minimum
- Clickable areas: Adequate padding

### ARIA Labels
Use semantic HTML and ARIA labels where needed:
```tsx
<button aria-label="Close dialog">
  <X size={20} />
</button>
```

---

## Animation

### Transitions
```css
transition-colors (200ms) - Color changes
transition-all (200ms) - Multiple properties
transition-transform (300ms) - Movement
```

### Hover Effects
```css
hover:translate-y-[-2px] - Lift effect
hover:scale-105 - Slight grow
hover:shadow-lg - Elevation increase
```

---

## Responsive Design

### Breakpoints
```css
sm: 640px  (mobile landscape)
md: 768px  (tablet)
lg: 1024px (desktop)
xl: 1280px (large desktop)
```

### Mobile-First Approach
```tsx
<div className="
  grid grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  gap-4 md:gap-6
">
```

---

## Do's and Don'ts

### ✅ Do's
- Use consistent spacing (4, 6, 8, 12, 16, 24)
- Maintain clear visual hierarchy
- Use semantic color meanings
- Provide hover and focus states
- Test on mobile devices
- Use proper heading levels (h1, h2, h3)

### ❌ Don'ts
- Don't use arbitrary spacing values
- Don't mix different button styles on same page
- Don't use low-contrast text
- Don't forget disabled states
- Don't use color alone to convey meaning
- Don't skip heading levels

---

## Code Examples

### Complete Page Example
```tsx
export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
          <h1 className="text-3xl font-bold text-neutral-900">
            Page Title
          </h1>
          <p className="text-neutral-600 mt-1">
            Page description
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">
            Section Title
          </h2>
          <p className="text-neutral-600">
            Content goes here
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Version History

- **v1.0.0** (2024-11-24) - Initial design system
  - Clean, accessible design
  - Consistent component library
  - Mobile-first responsive layouts
  - WCAG AA compliant

---

## Maintainers

For questions or suggestions, contact the development team.
