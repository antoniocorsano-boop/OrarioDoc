# Schedule Table (Tabella Orario) - Component Documentation

**Component Name:** Schedule Table (Tabella Orario)  
**Location:** `src/schedule-grid.js`, `src/main.js`  
**Version:** 1.0  
**Last Updated:** October 2025

---

## Overview

The Schedule Table is the core component of OrarioDoc, providing an interactive weekly schedule grid where teachers can add, edit, and manage their lessons. The component combines visual presentation, keyboard navigation, data persistence, and accessibility features.

## Table of Contents

1. [Architecture](#architecture)
2. [Features](#features)
3. [Data Structure](#data-structure)
4. [Persistence Logic](#persistence-logic)
5. [Interactive Features](#interactive-features)
6. [Keyboard Navigation](#keyboard-navigation)
7. [Accessibility](#accessibility)
8. [API Reference](#api-reference)
9. [Events](#events)
10. [Testing](#testing)
11. [Examples](#examples)

---

## Architecture

### Component Structure

```
Schedule Table Component
├── Schedule Grid (schedule-grid.js)
│   ├── Grid Creation
│   ├── Lesson Rendering
│   └── Event Handling
└── Main Controller (main.js)
    ├── Data Management
    ├── Modal Panel
    ├── Validation
    └── Persistence
```

### File Organization

- **`src/schedule-grid.js`**: Handles grid rendering and UI interactions
- **`src/main.js`**: Manages application state, modal, and persistence
- **`src/storage.js`**: Provides storage abstraction layer
- **`src/storage/indexeddb.js`**: IndexedDB implementation with localStorage fallback

---

## Features

### Core Features

✅ **7-Day Weekly Grid**
- Visual representation of the week (Sunday - Saturday)
- Responsive layout adapting to screen size
- Clear day headers with aria-labels

✅ **Lesson Management**
- Add new lessons via modal form
- Edit existing lessons
- Delete lessons with confirmation
- Duplicate prevention with conflict detection

✅ **Data Persistence**
- Automatic save to IndexedDB
- localStorage fallback for compatibility
- Data migration from localStorage to IndexedDB
- Restore state on page reload

✅ **Interactive Features**
- Click cells to add lessons for that day
- Click lessons to edit details
- Keyboard navigation throughout the grid
- Focus management and trapping in modals

✅ **Validation**
- Required field checking
- Time format validation (HH:MM)
- Duration bounds (1-480 minutes)
- Day range validation (0-6)
- Conflict detection for overlapping lessons

✅ **Accessibility**
- WCAG 2.1 Level AA compliant
- Full keyboard navigation
- Screen reader announcements
- Proper ARIA roles and labels
- Focus indicators

---

## Data Structure

### Lesson Object

```javascript
{
  id: string,           // Unique identifier (generated)
  name: string,         // Lesson name (required)
  class: string,        // Class identifier (optional)
  day: number,          // Day of week: 0=Sunday, 6=Saturday
  start: string,        // Start time in HH:MM format
  duration: number      // Duration in minutes (1-480)
}
```

### Storage Structure

```javascript
{
  lessons: [           // Array of lesson objects
    { id: 'id-abc123', name: 'Mathematics', ... }
  ],
  settings: {          // Application settings
    theme: 'dark',
    // ... other settings
  }
}
```

---

## Persistence Logic

### Storage Flow

```
User Action → Validation → Update State → Save to Storage → Render UI
                    ↓
              If Invalid → Show Error → Keep UI State
```

### IndexedDB Implementation

The application uses IndexedDB as the primary storage mechanism with automatic fallback to localStorage:

1. **First Load**: Attempts to use IndexedDB
2. **Migration**: Automatically migrates existing localStorage data
3. **Fallback**: Falls back to localStorage if IndexedDB fails
4. **Sync**: Changes propagate across browser tabs

### Storage API

```javascript
// Read data from storage
const data = await Storage.read();
// Returns: { lessons: [], settings: {} }

// Write data to storage
await Storage.write(data);
// Saves to IndexedDB (or localStorage fallback)
```

### Data Operations

**Add Lesson**
```javascript
const newLesson = {
  id: uid(),
  name: 'Mathematics',
  class: '3A',
  day: 1,
  start: '08:00',
  duration: 60
};
data.lessons.push(newLesson);
await save(data);
```

**Edit Lesson**
```javascript
const index = data.lessons.findIndex(l => l.id === lessonId);
if (index !== -1) {
  data.lessons[index] = { ...data.lessons[index], ...updates };
  await save(data);
}
```

**Delete Lesson**
```javascript
data.lessons = data.lessons.filter(l => l.id !== lessonId);
await save(data);
```

---

## Interactive Features

### Modal Panel

The modal panel (`#panel`) manages lesson addition and editing:

**States:**
- **New Lesson Mode**: Empty form, "Nuova lezione" title, no delete button
- **Edit Mode**: Pre-filled form, "Modifica lezione" title, delete button visible

**Form Fields:**
- Name (required)
- Class (optional)
- Day (number, 0-6)
- Time (HH:MM format)
- Duration (minutes, 1-480)

**Actions:**
- **Save**: Validates and saves lesson
- **Cancel**: Closes modal without saving
- **Delete**: Removes lesson (edit mode only)
- **Escape**: Closes modal

### Focus Management

**Opening Modal:**
1. Store reference to currently focused element
2. Open modal and set `aria-hidden="false"`
3. Focus first input field
4. Enable focus trap

**Closing Modal:**
1. Hide modal and set `aria-hidden="true"`
2. Restore focus to previous element
3. Remove focus trap

**Focus Trap:**
```javascript
// Traps keyboard focus within modal
// Tab cycles through focusable elements
// Shift+Tab cycles backward
// Prevents focus leaving modal
```

### Validation Logic

**Field Validation:**
```javascript
function validateLesson(name, day, start, duration) {
  const errors = [];
  
  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push('Il nome della lezione è obbligatorio');
  }
  
  // Day validation (0-6)
  if (isNaN(day) || day < 0 || day > 6) {
    errors.push('Il giorno deve essere tra 0 (Domenica) e 6 (Sabato)');
  }
  
  // Time validation (HH:MM format)
  if (!/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(start)) {
    errors.push('L\'ora deve essere nel formato HH:MM');
  }
  
  // Duration validation (1-480 minutes)
  if (isNaN(duration) || duration < 1 || duration > 480) {
    errors.push('La durata deve essere tra 1 e 480 minuti');
  }
  
  return errors;
}
```

**Conflict Detection:**
```javascript
function checkConflicts(lessons, newLesson, excludeId = null) {
  const conflicts = [];
  const newStart = timeToMinutes(newLesson.start);
  const newEnd = newStart + newLesson.duration;
  
  lessons.forEach(lesson => {
    if (lesson.id === excludeId) return;  // Skip current lesson
    if (lesson.day !== newLesson.day) return;  // Only same day
    
    const existingStart = timeToMinutes(lesson.start);
    const existingEnd = existingStart + lesson.duration;
    
    // Check for overlap: newStart < existingEnd AND newEnd > existingStart
    if (newStart < existingEnd && newEnd > existingStart) {
      conflicts.push(lesson);
    }
  });
  
  return conflicts;
}
```

---

## Keyboard Navigation

### Grid Navigation

| Key | Action |
|-----|--------|
| **Tab** | Move focus to next focusable element |
| **Shift+Tab** | Move focus to previous element |
| **Arrow Right** | Move to next cell (right) |
| **Arrow Left** | Move to previous cell (left) |
| **Arrow Down** | Move down 3 cells (for grid layout) |
| **Arrow Up** | Move up 3 cells |
| **Enter** | Activate cell (add lesson) |
| **Space** | Activate cell (add lesson) |

### Lesson Item Navigation

| Key | Action |
|-----|--------|
| **Tab** | Focus on lesson item |
| **Enter** | Edit lesson |
| **Space** | Edit lesson |
| **Escape** | Close modal (if open) |

### Modal Navigation

| Key | Action |
|-----|--------|
| **Tab** | Cycle through form fields |
| **Shift+Tab** | Cycle backward |
| **Escape** | Close modal |
| **Enter** | Submit form (on buttons) |

---

## Accessibility

### WCAG 2.1 Level AA Compliance

✅ **Perceivable**
- Semantic HTML structure
- Proper heading hierarchy
- Sufficient color contrast (4.5:1 for text)
- Visible focus indicators

✅ **Operable**
- Full keyboard navigation
- No keyboard traps (except intentional modal trap)
- Sufficient time for interactions
- Clear focus order

✅ **Understandable**
- Clear labels and instructions
- Consistent navigation
- Error messages in plain language
- Predictable behavior

✅ **Robust**
- Valid HTML
- Proper ARIA usage
- Compatible with assistive technologies

### ARIA Implementation

**Grid Container:**
```html
<div id="scheduleGrid" 
     class="schedule-grid" 
     role="grid" 
     aria-label="Griglia orario settimanale">
```

**Grid Cells:**
```html
<div class="cell" 
     data-day="1" 
     role="gridcell" 
     tabindex="0" 
     aria-label="Lunedì, clicca per aggiungere lezione">
```

**Lesson Items:**
```html
<div class="item" 
     data-id="lesson-1" 
     role="button" 
     tabindex="0" 
     aria-label="Lezione: Matematica alle 08:00, durata 60 minuti">
```

**Modal Panel:**
```html
<aside id="panel" 
       class="panel" 
       role="dialog" 
       aria-modal="true" 
       aria-labelledby="panelTitle" 
       aria-hidden="true">
```

**Live Region for Announcements:**
```html
<div id="announcements" 
     class="visually-hidden" 
     role="status" 
     aria-live="polite" 
     aria-atomic="true">
</div>
```

### Screen Reader Support

Tested with:
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)  
- ✅ VoiceOver (macOS)

---

## API Reference

### ScheduleGrid.createGrid()

Creates the weekly schedule grid structure.

**Syntax:**
```javascript
ScheduleGrid.createGrid(container)
```

**Parameters:**
- `container` (HTMLElement): The container element for the grid

**Returns:** void

**Example:**
```javascript
const gridEl = document.getElementById('scheduleGrid');
ScheduleGrid.createGrid(gridEl);
```

### ScheduleGrid.renderLessons()

Renders lesson items in the schedule grid.

**Syntax:**
```javascript
ScheduleGrid.renderLessons(container, lessons)
```

**Parameters:**
- `container` (HTMLElement): The grid container element
- `lessons` (Array\<Lesson\>): Array of lesson objects

**Returns:** void

**Example:**
```javascript
const lessons = [
  { id: '1', name: 'Math', day: 1, start: '08:00', duration: 60 }
];
ScheduleGrid.renderLessons(gridEl, lessons);
```

---

## Events

### Custom Events

**schedule-cell-click**

Dispatched when a grid cell is clicked or activated.

```javascript
window.addEventListener('schedule-cell-click', (event) => {
  const { day } = event.detail;
  console.log(`Cell clicked: Day ${day}`);
});
```

**Event Detail:**
```javascript
{
  day: number  // Day index (0=Sunday, 6=Saturday)
}
```

**lesson-click**

Dispatched when a lesson item is clicked or activated.

```javascript
window.addEventListener('lesson-click', (event) => {
  const { id } = event.detail;
  console.log(`Lesson clicked: ${id}`);
});
```

**Event Detail:**
```javascript
{
  id: string  // Lesson ID
}
```

---

## Testing

### Test Coverage

The Schedule Table component has comprehensive test coverage:

**Unit Tests** (`tests/unit-tests.js`)
- ✅ Storage operations
- ✅ Validation logic
- ✅ Conflict detection
- ✅ Time conversion
- ✅ UID generation

**Modal & Persistence Tests** (`tests/modal-persistence-tests.js`)
- ✅ Modal opening/closing
- ✅ Focus management
- ✅ Field validation
- ✅ Data persistence
- ✅ Error handling
- ✅ Accessibility

**Keyboard Navigation Tests** (`tests/keyboard-navigation-tests.js`)
- ✅ Grid navigation
- ✅ Arrow key movement
- ✅ Lesson interaction
- ✅ Event dispatching
- ✅ Focus management

**Integration Tests** (`tests/integration-tests.js`)
- ✅ Complete workflows
- ✅ Add/edit/delete lessons
- ✅ Conflict scenarios
- ✅ Theme switching
- ✅ Storage persistence

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run with headed browser (for debugging)
npm run test:headed
```

### Test Results

Tests are designed to run in a browser environment using Playwright. Results are saved to:
- `test-results/` - Screenshots and logs
- `test-results.json` - Test summary

---

## Examples

### Example 1: Initialize Schedule Grid

```javascript
// Initialize grid
const gridEl = document.getElementById('scheduleGrid');
ScheduleGrid.createGrid(gridEl);

// Load and render lessons
async function init() {
  const data = await Storage.read();
  ScheduleGrid.renderLessons(gridEl, data.lessons);
}
```

### Example 2: Add New Lesson

```javascript
async function addLesson(lessonData) {
  // Validate
  const errors = validateLesson(
    lessonData.name,
    lessonData.day,
    lessonData.start,
    lessonData.duration
  );
  
  if (errors.length > 0) {
    alert(errors[0]);
    return;
  }
  
  // Check conflicts
  const data = await Storage.read();
  const conflicts = checkConflicts(data.lessons, lessonData);
  
  if (conflicts.length > 0) {
    alert('Conflitto orario!');
    return;
  }
  
  // Save
  lessonData.id = uid();
  data.lessons.push(lessonData);
  await Storage.write(data);
  
  // Re-render
  ScheduleGrid.renderLessons(gridEl, data.lessons);
}
```

### Example 3: Handle Cell Click

```javascript
window.addEventListener('schedule-cell-click', async (event) => {
  const { day } = event.detail;
  
  // Open modal for new lesson
  document.getElementById('panelTitle').textContent = 'Nuova lezione';
  document.getElementById('inputDay').value = String(day);
  document.getElementById('panel').classList.remove('hidden');
  
  // Focus first input
  document.getElementById('inputName').focus();
});
```

### Example 4: Custom Validation

```javascript
function validateCustom(lesson) {
  const errors = validateLesson(
    lesson.name,
    lesson.day,
    lesson.start,
    lesson.duration
  );
  
  // Add custom validation
  if (lesson.class && lesson.class.length < 2) {
    errors.push('La classe deve avere almeno 2 caratteri');
  }
  
  return errors;
}
```

---

## Performance Considerations

### Optimizations

1. **DocumentFragment for Rendering**
   - Batches DOM insertions to minimize reflows
   - Significantly faster for multiple lessons

2. **Event Delegation**
   - Single event listener on container
   - Handles clicks on all cells and lessons

3. **Efficient Storage**
   - IndexedDB for large datasets
   - Async operations don't block UI

4. **Minimal Re-renders**
   - Only re-render when data changes
   - Preserve focus during updates

### Best Practices

- ✅ Use `Storage.read()` and `Storage.write()` for data operations
- ✅ Validate data before saving
- ✅ Check for conflicts to prevent overlaps
- ✅ Use `announce()` for screen reader feedback
- ✅ Maintain focus during operations
- ✅ Handle errors gracefully

---

## Troubleshooting

### Common Issues

**Problem:** Lessons not saving
- **Solution:** Check browser console for storage errors. Verify IndexedDB is enabled.

**Problem:** Focus lost after modal closes
- **Solution:** Ensure `previousFocusElement` is properly stored and restored.

**Problem:** Keyboard navigation not working
- **Solution:** Verify `tabindex="0"` on interactive elements. Check event listeners.

**Problem:** Conflicts not detected
- **Solution:** Verify time format is HH:MM. Check `checkConflicts()` logic.

**Problem:** Accessibility issues
- **Solution:** Use browser accessibility tools. Test with screen reader.

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Required APIs:**
- IndexedDB or localStorage
- ES6 (async/await, arrow functions)
- CustomEvent
- Promises

---

## Future Enhancements

Planned improvements:

- [ ] Drag-and-drop lesson reordering
- [ ] Recurring lessons (weekly patterns)
- [ ] Color coding by subject
- [ ] Export to PDF/iCal
- [ ] Undo/redo functionality
- [ ] Bulk operations (select multiple lessons)
- [ ] Teacher availability checking
- [ ] Room/resource management

---

## Contributing

When modifying the Schedule Table component:

1. ✅ Run all tests before committing
2. ✅ Update documentation for API changes
3. ✅ Maintain accessibility standards
4. ✅ Add tests for new features
5. ✅ Follow existing code style
6. ✅ Test with keyboard and screen reader

---

## References

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Material Design 3](https://m3.material.io/)

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintained by:** OrarioDoc Team
