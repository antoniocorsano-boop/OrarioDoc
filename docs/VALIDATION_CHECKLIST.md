# Validation Checklist - Data Persistence & Interactive Logic

This document provides a comprehensive manual testing checklist for verifying the data persistence and interactive logic functionality of the Schedule Grid component.

## Prerequisites

1. Start the local server:
   ```bash
   python3 -m http.server 8080
   ```

2. Open browser: http://localhost:8080

3. Open DevTools (F12):
   - Console tab (for logs)
   - Application tab (for storage inspection)
   - Network tab (optional, for debugging)

## Test Categories

### 1. Data Persistence - Basic Operations

#### Test 1.1: Add Single Lesson and Persist
- [ ] Click "Aggiungi" button
- [ ] Fill form:
  - Nome: "Matematica"
  - Classe: "3A"
  - Giorno: 1 (Lunedì)
  - Ora: 08:00
  - Durata: 60
- [ ] Click "Salva"
- [ ] Verify lesson appears in grid
- [ ] Reload page (F5)
- [ ] **Expected**: Lesson still appears after reload

#### Test 1.2: Add Multiple Lessons
- [ ] Add 3 different lessons with different days
- [ ] Verify all appear in grid
- [ ] Reload page
- [ ] **Expected**: All 3 lessons persist

#### Test 1.3: Edit Existing Lesson
- [ ] Click on an existing lesson
- [ ] Verify modal shows "Modifica lezione"
- [ ] Change lesson name to "Matematica Avanzata"
- [ ] Click "Salva"
- [ ] Reload page
- [ ] **Expected**: Updated name persists

#### Test 1.4: Delete Lesson
- [ ] Click on a lesson
- [ ] Click "Elimina" button
- [ ] Confirm deletion in dialog
- [ ] Verify lesson disappears
- [ ] Reload page
- [ ] **Expected**: Lesson remains deleted

### 2. Data Persistence - Storage Layers

#### Test 2.1: IndexedDB Functionality
- [ ] Open DevTools → Application → IndexedDB
- [ ] Verify database "OrarioDocDB" exists
- [ ] Expand database → Object Store "appData"
- [ ] Verify keys exist:
  - `orariodoc:v1` (contains lessons and settings)
  - `migrated_from_localStorage` (migration flag)
- [ ] Add a lesson
- [ ] Refresh IndexedDB view in DevTools
- [ ] **Expected**: New lesson appears in IndexedDB data

#### Test 2.2: localStorage Fallback
- [ ] Open Console
- [ ] Run: `localStorage.setItem('test', 'works')`
- [ ] Run: `console.log(localStorage.getItem('test'))`
- [ ] **Expected**: "works" is logged
- [ ] Run: `localStorage.getItem('orariodoc:v1')`
- [ ] **Expected**: Shows data object (for fallback scenarios)

#### Test 2.3: Migration from localStorage
- [ ] Open Console
- [ ] Run: `indexedDB.deleteDatabase('OrarioDocDB')`
- [ ] Run: 
   ```javascript
   localStorage.setItem('orariodoc:v1', JSON.stringify({
     lessons: [{id:'test1', name:'Storia', day:1, start:'10:00', duration:60}],
     settings: {}
   }))
   ```
- [ ] Reload page (F5)
- [ ] **Expected**: "Storia" lesson appears in grid
- [ ] Check IndexedDB in DevTools
- [ ] **Expected**: Data has been migrated to IndexedDB

### 3. Modal Management

#### Test 3.1: Open Modal - Add Button
- [ ] Click "Aggiungi" button in top bar
- [ ] **Expected**: Modal slides in and becomes visible
- [ ] Verify:
  - [ ] Modal title says "Nuova lezione"
  - [ ] aria-hidden="false" on #panel
  - [ ] Delete button is hidden
  - [ ] First input (Nome) receives focus

#### Test 3.2: Open Modal - Grid Cell Click
- [ ] Click on any day cell in the grid
- [ ] **Expected**: Modal opens
- [ ] Verify:
  - [ ] Day input is pre-filled with clicked day
  - [ ] Modal title says "Nuova lezione"

#### Test 3.3: Close Modal - Cancel Button
- [ ] Open modal (any method)
- [ ] Click "Annulla" button
- [ ] **Expected**: Modal closes
- [ ] Verify:
  - [ ] aria-hidden="true" on #panel
  - [ ] Focus returns to previously focused element

#### Test 3.4: Close Modal - Escape Key
- [ ] Open modal
- [ ] Press Escape key
- [ ] **Expected**: Modal closes
- [ ] Verify focus returns

#### Test 3.5: Focus Trap
- [ ] Open modal
- [ ] Press Tab repeatedly
- [ ] **Expected**: Focus cycles through:
  1. inputName
  2. inputClass
  3. inputDay
  4. inputTime
  5. inputDuration
  6. saveBtn
  7. cancelBtn
  8. Back to inputName (cycles)
- [ ] Try clicking outside modal
- [ ] **Expected**: Focus stays within modal

#### Test 3.6: Edit Mode - Delete Button
- [ ] Add a lesson first
- [ ] Click on the lesson
- [ ] **Expected**: Modal opens in edit mode
- [ ] Verify:
  - [ ] Title says "Modifica lezione"
  - [ ] All fields are pre-filled
  - [ ] Delete button is visible

### 4. Form Validation

#### Test 4.1: Empty Name Validation
- [ ] Open modal
- [ ] Leave "Nome" empty
- [ ] Try to save
- [ ] **Expected**: Error toast appears
- [ ] **Expected**: Modal stays open
- [ ] **Expected**: Focus moves to name input

#### Test 4.2: Invalid Time Format
- [ ] Open modal in Console
- [ ] Run: `document.getElementById('inputTime').value = '25:00'`
- [ ] Fill name field with "Test"
- [ ] Try to save
- [ ] **Expected**: Error toast appears
- [ ] **Expected**: Modal stays open

#### Test 4.3: Time Conflict Detection
- [ ] Add first lesson:
  - Nome: "Matematica"
  - Giorno: 1 (Lunedì)
  - Ora: 08:00
  - Durata: 60
- [ ] Try to add second lesson with overlap:
  - Nome: "Fisica"  
  - Giorno: 1 (Lunedì)
  - Ora: 08:30 (overlaps!)
  - Durata: 60
- [ ] Try to save
- [ ] **Expected**: Warning toast shows "Conflitto orario con: Matematica"
- [ ] **Expected**: Modal stays open
- [ ] **Expected**: Second lesson not added

#### Test 4.4: Valid Lesson (No Errors)
- [ ] Fill all fields correctly
- [ ] Save
- [ ] **Expected**: Success toast appears
- [ ] **Expected**: Modal closes
- [ ] **Expected**: Lesson appears in grid

### 5. Keyboard Navigation

#### Test 5.1: Navigate Grid Cells with Arrow Keys
- [ ] Click on first day cell to focus it
- [ ] Press Right Arrow
- [ ] **Expected**: Focus moves to next cell (right)
- [ ] Press Left Arrow
- [ ] **Expected**: Focus moves back
- [ ] Press Down Arrow
- [ ] **Expected**: Focus moves down (skips ~3 cells)
- [ ] Press Up Arrow
- [ ] **Expected**: Focus moves up

#### Test 5.2: Activate Cell with Enter
- [ ] Focus on a grid cell (click or Tab)
- [ ] Press Enter
- [ ] **Expected**: Modal opens for that day

#### Test 5.3: Activate Cell with Space
- [ ] Focus on a grid cell
- [ ] Press Space
- [ ] **Expected**: Modal opens for that day

#### Test 5.4: Activate Lesson with Enter
- [ ] Add a lesson first
- [ ] Tab to focus on the lesson item
- [ ] Press Enter
- [ ] **Expected**: Edit modal opens for that lesson

#### Test 5.5: Activate Lesson with Space
- [ ] Focus on a lesson item
- [ ] Press Space
- [ ] **Expected**: Edit modal opens

#### Test 5.6: Tab Navigation
- [ ] Start from top of page
- [ ] Press Tab repeatedly
- [ ] **Expected**: Focus moves through:
  - Skip link
  - Impostazioni button
  - Aggiungi button
  - Grid cells (each one)
  - Lesson items (if any)
  - Footer links

### 6. Accessibility

#### Test 6.1: ARIA Attributes - Grid
- [ ] Inspect #scheduleGrid in DevTools
- [ ] Verify attributes:
  - [ ] `role="grid"`
  - [ ] `aria-label="Griglia orario settimanale"`

#### Test 6.2: ARIA Attributes - Cells
- [ ] Inspect any .cell element
- [ ] Verify attributes:
  - [ ] `role="gridcell"`
  - [ ] `tabindex="0"`
  - [ ] `aria-label` contains day name and action hint

#### Test 6.3: ARIA Attributes - Modal
- [ ] Open modal
- [ ] Inspect #panel
- [ ] Verify attributes:
  - [ ] `role="dialog"`
  - [ ] `aria-modal="true"`
  - [ ] `aria-labelledby="panelTitle"`
  - [ ] `aria-hidden="false"` when open

#### Test 6.4: ARIA Attributes - Lesson Items
- [ ] Add a lesson
- [ ] Inspect .item element
- [ ] Verify attributes:
  - [ ] `role="button"`
  - [ ] `tabindex="0"`
  - [ ] `aria-label` with full lesson details

#### Test 6.5: Live Region Announcements
- [ ] Open Console
- [ ] Add a lesson successfully
- [ ] Check #announcements element
- [ ] **Expected**: Contains success message
- [ ] Wait 3 seconds
- [ ] **Expected**: Announcement clears

#### Test 6.6: Form Labels
- [ ] Open modal
- [ ] Inspect each input field
- [ ] Verify each input has:
  - [ ] Associated `<label>` element
  - [ ] or is wrapped in `<label>`

#### Test 6.7: Skip Link
- [ ] Reload page
- [ ] Press Tab once
- [ ] **Expected**: "Salta al contenuto principale" link appears
- [ ] Press Enter
- [ ] **Expected**: Focus jumps to #main-content

### 7. Browser Compatibility (if possible)

#### Test in Chrome/Chromium
- [ ] All persistence tests pass
- [ ] All keyboard navigation works
- [ ] Modal animations smooth

#### Test in Firefox (if available)
- [ ] All persistence tests pass
- [ ] All keyboard navigation works
- [ ] Check IndexedDB in Storage Inspector

#### Test in Safari (if available)
- [ ] All persistence tests pass
- [ ] All keyboard navigation works

#### Test in Mobile Browser (if possible)
- [ ] Touch interactions work on grid
- [ ] Modal opens/closes on mobile
- [ ] Form inputs work with mobile keyboard

### 8. Performance Checks

#### Test 8.1: Initial Load Performance
- [ ] Open DevTools → Network tab
- [ ] Reload page with cache disabled (Ctrl+Shift+R)
- [ ] Check:
  - [ ] Total page load time < 2 seconds
  - [ ] No 404 errors
  - [ ] All JS files load successfully

#### Test 8.2: Rendering Performance with Many Lessons
- [ ] Add 20+ lessons programmatically in Console:
   ```javascript
   async function addManyLessons() {
     const data = await Storage.read();
     for(let i = 0; i < 20; i++) {
       data.lessons.push({
         id: 'test-' + i,
         name: 'Lesson ' + i,
         day: (i % 5) + 1,  // Days 1-5 (Mon-Fri)
         start: '08:00',
         duration: 60
       });
     }
     await Storage.write(data);
     location.reload();
   }
   addManyLessons();
   ```
- [ ] **Expected**: Page loads smoothly
- [ ] **Expected**: All lessons render quickly
- [ ] Check DevTools Performance tab for any bottlenecks

#### Test 8.3: Storage Quota
- [ ] Open Console
- [ ] Run:
   ```javascript
   navigator.storage.estimate().then(est => {
     console.log('Used:', est.usage, 'bytes');
     console.log('Quota:', est.quota, 'bytes');
     console.log('Percentage:', (est.usage / est.quota * 100).toFixed(2) + '%');
   });
   ```
- [ ] **Expected**: Usage is minimal (< 1% typically)

### 9. Edge Cases & Error Handling

#### Test 9.1: Private/Incognito Mode
- [ ] Open in private/incognito window
- [ ] Add lessons
- [ ] **Expected**: Data persists within session
- [ ] Close and reopen private window
- [ ] **Expected**: Data is cleared (expected behavior)

#### Test 9.2: Storage Full (Difficult to Test)
- [ ] This requires filling up storage quota
- [ ] **Expected Behavior**: App shows error toast
- [ ] **Expected**: Graceful degradation, no crash

#### Test 9.3: Corrupted localStorage Data
- [ ] Open Console
- [ ] Run: `localStorage.setItem('orariodoc:v1', 'invalid-json')`
- [ ] Reload page
- [ ] **Expected**: App loads with empty data (no crash)
- [ ] **Expected**: Error logged in console

#### Test 9.4: Network Offline (PWA)
- [ ] Open page normally
- [ ] Open DevTools → Network
- [ ] Set to "Offline"
- [ ] Reload page
- [ ] **Expected**: Page still loads (service worker)
- [ ] **Expected**: All functionality works offline

### 10. Security Checks

#### Test 10.1: XSS Prevention in Lesson Names
- [ ] Add lesson with name: `<script>alert('XSS')</script>`
- [ ] **Expected**: Script tag rendered as text, not executed
- [ ] **Expected**: No alert popup

#### Test 10.2: XSS Prevention in Class Field
- [ ] Add lesson with class: `<img src=x onerror=alert('XSS')>`
- [ ] **Expected**: HTML rendered as text
- [ ] **Expected**: No alert popup

#### Test 10.3: No Credentials in Storage
- [ ] Check localStorage and IndexedDB
- [ ] **Expected**: No passwords or sensitive tokens stored

## Test Results Summary

After completing all tests, fill out this summary:

### Pass/Fail Summary
- [ ] Data Persistence: ___ / ___ tests passed
- [ ] Modal Management: ___ / ___ tests passed
- [ ] Form Validation: ___ / ___ tests passed
- [ ] Keyboard Navigation: ___ / ___ tests passed
- [ ] Accessibility: ___ / ___ tests passed
- [ ] Browser Compatibility: ___ / ___ tests passed
- [ ] Performance: ___ / ___ tests passed
- [ ] Edge Cases: ___ / ___ tests passed
- [ ] Security: ___ / ___ tests passed

### Issues Found
(List any issues discovered during testing)

1. 
2. 
3. 

### Notes
(Any additional observations)

---

**Tester Name**: _______________
**Date**: _______________
**Browser**: _______________
**OS**: _______________
