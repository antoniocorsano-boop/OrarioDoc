# OrarioDoc - Responsive Design Guide

**Version:** 1.0  
**Last Updated:** October 2025  
**Status:** ✅ Complete

---

## Overview

OrarioDoc implements a **mobile-first responsive design** following Material Design 3 guidelines. The application is optimized for all device sizes from small smartphones (320px) to large desktops (1280px+).

---

## Breakpoints

The application uses the following breakpoints aligned with Material Design standards:

| Breakpoint | Range | Target Devices | Grid Layout |
|------------|-------|----------------|-------------|
| **Mobile** | < 640px | Smartphones | 3 columns (3x3 grid) |
| **Tablet** | 640px - 1023px | Tablets, small laptops | 7 columns (full week) |
| **Desktop** | 1024px - 1279px | Laptops, desktops | 7 columns (enhanced spacing) |
| **Large Desktop** | ≥ 1280px | Large monitors | 7 columns (max-width container) |

---

## Mobile-First Approach

All base styles are optimized for mobile devices, with progressive enhancement for larger screens:

```css
/* Base styles: Mobile (< 640px) */
.schedule-grid {
  grid-template-columns: repeat(3, 1fr);
  gap: var(--md-sys-spacing-xs);
}

/* Tablet: >= 640px */
@media (min-width: 640px) {
  .schedule-grid {
    grid-template-columns: repeat(7, 1fr);
    gap: var(--md-sys-spacing-sm);
  }
}
```

---

## Touch Target Standards

All interactive elements meet **Material Design 3** touch target requirements:

### Minimum Sizes

- **Standard buttons:** 48x48px minimum
- **Icon buttons:** 48x48px minimum
- **Small icon buttons:** 40x40px minimum (use sparingly)
- **Grid cells:** 80px minimum height on mobile
- **Lesson items:** 48px minimum height
- **Form inputs:** 48px minimum height

### Implementation

```css
/* Buttons */
.btn {
  min-height: 48px; /* Material Design 3 standard */
}

/* Grid cells on mobile */
@media (max-width: 639px) {
  .cell {
    min-height: 80px; /* Extra large for touch */
  }
  
  .item {
    min-height: 48px;
  }
}
```

---

## Responsive Layout Changes

### Topbar

**Mobile (< 640px):**
- Stacked vertical layout
- Buttons expand to full width
- Reduced padding

**Tablet/Desktop (≥ 640px):**
- Horizontal layout
- Buttons sized naturally
- Standard padding

### Schedule Grid

**Mobile (< 640px):**
- 3x3 grid showing Mon-Wed, Thu-Sat, Sun
- Smaller gaps between cells
- Larger touch targets (80px height)

**Tablet/Desktop (≥ 640px):**
- Full 7-column layout (Mon-Sun)
- Standard gaps and cell sizes

### Form Panel

**Mobile (< 640px):**
- Full-width with small margins
- Positioned near top of screen
- Scrollable if content overflows
- Inputs sized at 48px height
- 16px font size (prevents zoom on iOS)

**Tablet (≥ 640px):**
- Fixed width (360px)
- Positioned on the right side
- Standard form styling

**Desktop (≥ 1024px):**
- Wider panel (400px)
- Enhanced spacing

---

## Typography

Font sizes automatically adjust for readability:

### Base Sizes (Mobile)

- **Body text:** 16px minimum (prevents iOS zoom)
- **Labels:** 16px (body-large)
- **Small text:** 12px minimum

### Desktop Enhancements (≥ 1024px)

- **Title:** Increases to headline-small (24px)
- Enhanced line height and spacing

---

## Spacing Scale

The application uses consistent spacing based on screen size:

```css
/* Mobile */
body {
  padding: var(--md-sys-spacing-sm); /* 8px */
}

/* Tablet */
@media (min-width: 640px) {
  body {
    padding: var(--md-sys-spacing-lg); /* 16px */
  }
}

/* Desktop */
@media (min-width: 1024px) {
  body {
    padding: var(--md-sys-spacing-2xl); /* 24px */
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  body {
    max-width: 1400px;
    margin: 0 auto;
  }
}
```

---

## Testing Guidelines

### Recommended Test Devices

1. **Small Phone:** iPhone SE (320px width)
2. **Standard Phone:** iPhone 12/13 (375px width)
3. **Large Phone:** iPhone 12 Pro Max (428px width)
4. **Tablet Portrait:** iPad (768px width)
5. **Tablet Landscape:** iPad (1024px width)
6. **Desktop:** 1280px+ width

### Manual Testing Checklist

- [ ] All buttons are easily tappable (no mis-taps)
- [ ] No horizontal scrolling on any screen size
- [ ] Text is readable without zooming
- [ ] Forms are usable with on-screen keyboard
- [ ] Grid cells are clearly distinguishable
- [ ] Navigation is intuitive on all devices
- [ ] Modal/panel doesn't cover critical content
- [ ] Touch targets have adequate spacing

### Browser DevTools Testing

```javascript
// Test common viewports in Chrome DevTools
const viewports = [
  { width: 320, height: 568 },  // iPhone SE
  { width: 375, height: 667 },  // iPhone 8
  { width: 414, height: 896 },  // iPhone 11
  { width: 768, height: 1024 }, // iPad
  { width: 1024, height: 768 }, // iPad Landscape
  { width: 1280, height: 800 }, // Desktop
  { width: 1920, height: 1080 } // Full HD
];
```

---

## Accessibility Features

All responsive implementations maintain WCAG 2.1 AA compliance:

- ✅ **Touch targets:** Minimum 48x48px (exceeds 44x44px requirement)
- ✅ **Text size:** Minimum 16px for body text
- ✅ **Color contrast:** Maintains 4.5:1 ratio on all screen sizes
- ✅ **Keyboard navigation:** Functional across all breakpoints
- ✅ **Screen reader support:** Semantic HTML maintained
- ✅ **Focus indicators:** Visible 3px outlines with good contrast

---

## Performance Considerations

### Mobile Optimization

- **CSS:** Mobile-first reduces parsing on small devices
- **Images:** Use appropriate sizes for viewport
- **Fonts:** Roboto Flex variable font reduces requests
- **Layout:** Avoid complex grid calculations on mobile

### Best Practices

```css
/* ✅ Good: Simple mobile layout */
@media (max-width: 639px) {
  .schedule-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ❌ Avoid: Complex calculations on mobile */
@media (max-width: 639px) {
  .schedule-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
}
```

---

## Common Issues and Solutions

### Issue: Text too small on mobile

**Solution:** Ensure body text is at least 16px:

```css
@media (max-width: 639px) {
  input[type="text"],
  input[type="number"],
  input[type="time"] {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

### Issue: Buttons too small to tap

**Solution:** Use Material Design minimum sizes:

```css
.btn {
  min-height: 48px; /* Material Design standard */
}
```

### Issue: Modal covers content on mobile

**Solution:** Add scrolling and proper positioning:

```css
@media (max-width: 639px) {
  aside.panel {
    max-height: calc(100vh - var(--md-sys-spacing-2xl));
    overflow-y: auto;
  }
}
```

### Issue: Horizontal scrolling on mobile

**Solution:** Ensure all containers respect viewport width:

```css
aside.panel {
  width: calc(100% - var(--md-sys-spacing-lg));
}
```

---

## Developer Guidelines

### Adding New Components

When creating new components, follow this pattern:

1. **Design mobile-first**
   ```css
   .new-component {
     /* Mobile styles here */
   }
   ```

2. **Add tablet enhancements**
   ```css
   @media (min-width: 640px) {
     .new-component {
       /* Tablet improvements */
     }
   }
   ```

3. **Add desktop enhancements**
   ```css
   @media (min-width: 1024px) {
     .new-component {
       /* Desktop improvements */
     }
   }
   ```

### Touch Target Checklist

Before committing, verify:

- [ ] Interactive elements are ≥ 48x48px
- [ ] Adequate spacing between touch targets (≥ 8px)
- [ ] Hover states work on desktop
- [ ] Active/pressed states provide feedback
- [ ] Focus states are clearly visible

---

## Resources

- [Material Design 3 - Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [Material Design 3 - Accessibility](https://m3.material.io/foundations/accessible-design/overview)
- [WCAG 2.1 - Touch Target Size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/layout)

---

## Changelog

### Version 1.0 (October 2025)
- ✅ Initial responsive implementation
- ✅ Material Design 3 breakpoints (640px, 1024px, 1280px)
- ✅ Touch targets upgraded to 48x48px minimum
- ✅ Mobile-first CSS architecture
- ✅ Comprehensive testing on multiple devices
- ✅ Documentation complete

---

**Maintainer:** OrarioDoc Team  
**Last Review:** October 2025
