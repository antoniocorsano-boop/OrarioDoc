# Style Guide

Guida di stile per lo sviluppo di OrarioDoc. Seguire queste linee guida per mantenere consistenza e qualità del codice.

## 📋 Sommario

- [JavaScript/TypeScript](#javascripttypescript)
- [React](#react)
- [CSS/Styling](#cssstyling)
- [File e cartelle](#file-e-cartelle)
- [Naming Conventions](#naming-conventions)
- [Commenti e documentazione](#commenti-e-documentazione)
- [Accessibilità](#accessibilità)
- [Testing](#testing)
- [Git](#git)

## JavaScript/TypeScript

### Generale

- Usa **ES6+** features moderne
- Preferisci `const` a `let`, evita `var`
- Usa arrow functions quando appropriato
- Destrutturazione quando migliora la leggibilità
- Template literals per concatenazione stringhe

```javascript
// ✅ Good
const userName = 'Mario';
const greeting = `Ciao, ${userName}!`;
const [first, ...rest] = items;

// ❌ Bad
var userName = 'Mario';
var greeting = 'Ciao, ' + userName + '!';
```

### Functions

```javascript
// ✅ Good - Arrow function per funzioni brevi
const double = (x) => x * 2;

// ✅ Good - Named function per funzioni complesse
function calculateScheduleConflicts(schedule) {
  // complex logic
  return conflicts;
}

// ❌ Bad - Arrow function per funzioni complesse
const calculateScheduleConflicts = (schedule) => {
  // complex logic spanning many lines
};
```

### Async/Await

Preferisci `async/await` a `.then()` chains

```javascript
// ✅ Good
async function fetchUserData(userId) {
  try {
    const user = await api.getUser(userId);
    const schedule = await api.getSchedule(user.id);
    return { user, schedule };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// ❌ Bad
function fetchUserData(userId) {
  return api.getUser(userId)
    .then(user => api.getSchedule(user.id))
    .then(schedule => ({ user, schedule }))
    .catch(error => console.error(error));
}
```

### Error Handling

```javascript
// ✅ Good - Specific error handling
try {
  await saveSchedule(schedule);
} catch (error) {
  if (error instanceof ValidationError) {
    showValidationError(error.message);
  } else if (error instanceof NetworkError) {
    showNetworkError();
  } else {
    showGenericError();
  }
}
```

## React

### Component Structure

```jsx
// ✅ Good - Consistent structure
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './MyComponent.module.css';

// Constants
const DEFAULT_VALUE = 10;

// Component
function MyComponent({ title, onSave }) {
  // Hooks
  const [value, setValue] = useState(DEFAULT_VALUE);
  
  // Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // Event handlers
  const handleClick = () => {
    setValue(value + 1);
    onSave(value);
  };
  
  // Render helpers
  const renderContent = () => {
    return <div>{value}</div>;
  };
  
  // Main render
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {renderContent()}
      <button onClick={handleClick}>Increment</button>
    </div>
  );
}

// PropTypes
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

// Default props
MyComponent.defaultProps = {
  title: 'Default Title',
};

export default MyComponent;
```

### Hooks

```jsx
// ✅ Good - Custom hooks
function useSchedule(userId) {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchSchedule() {
      try {
        const data = await api.getSchedule(userId);
        if (!cancelled) {
          setSchedule(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    fetchSchedule();
    
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  return { schedule, loading, error };
}
```

### Conditional Rendering

```jsx
// ✅ Good - Clear conditions
function UserProfile({ user }) {
  if (!user) {
    return <LoadingSpinner />;
  }
  
  if (user.error) {
    return <ErrorMessage error={user.error} />;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      {user.isPremium && <PremiumBadge />}
    </div>
  );
}

// ❌ Bad - Nested ternaries
function UserProfile({ user }) {
  return !user ? <LoadingSpinner /> : 
    user.error ? <ErrorMessage /> : 
    <div>{user.isPremium ? <PremiumBadge /> : null}</div>;
}
```

### Lists and Keys

```jsx
// ✅ Good - Stable, unique keys
function LessonList({ lessons }) {
  return (
    <ul>
      {lessons.map((lesson) => (
        <li key={lesson.id}>
          <LessonItem lesson={lesson} />
        </li>
      ))}
    </ul>
  );
}

// ❌ Bad - Index as key (if list can change)
function LessonList({ lessons }) {
  return (
    <ul>
      {lessons.map((lesson, index) => (
        <li key={index}>
          <LessonItem lesson={lesson} />
        </li>
      ))}
    </ul>
  );
}
```

### Props

```jsx
// ✅ Good - Props destructuring
function Button({ onClick, children, variant = 'primary', disabled = false }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

// ❌ Bad - Props drilling
function Button(props) {
  return (
    <button 
      onClick={props.onClick} 
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
```

## CSS/Styling

### Naming (BEM-inspired)

```css
/* ✅ Good - Clear, semantic names */
.schedule-card {
  /* Block */
}

.schedule-card__header {
  /* Element */
}

.schedule-card__header--highlighted {
  /* Modifier */
}

.schedule-card--compact {
  /* Block modifier */
}

/* ❌ Bad */
.sc {
  /* Too short */
}

.scheduleCardHeaderHighlighted {
  /* camelCase in CSS */
}
```

### Organization

```css
/* Component: ScheduleCard.module.css */

/* 1. Layout */
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 2. Visual */
.container {
  background-color: var(--color-bg-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* 3. Typography */
.title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* 4. States */
.container:hover {
  box-shadow: var(--shadow-md);
}

.container--loading {
  opacity: 0.6;
  pointer-events: none;
}
```

### CSS Variables

```css
/* ✅ Good - Use CSS variables for theming */
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Typography */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  
  /* Breakpoints (for reference) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Responsive Design

```css
/* ✅ Good - Mobile-first */
.container {
  padding: var(--space-sm);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-md);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-lg);
  }
}
```

## File e cartelle

### Naming

```
✅ Good:
components/
  ScheduleCard/
    ScheduleCard.jsx
    ScheduleCard.module.css
    ScheduleCard.test.jsx
    index.js
  common/
    Button/
    Input/

❌ Bad:
components/
  scheduleCard.jsx
  schedule_card.jsx
  SCHEDULE-CARD.jsx
```

### Structure

```
src/
├── components/
│   ├── common/           # Riutilizzabili
│   │   ├── Button/
│   │   └── Input/
│   ├── layout/           # Layout components
│   │   ├── Header/
│   │   └── Sidebar/
│   └── features/         # Feature-specific
│       └── ScheduleCard/
├── screens/              # Page components
├── hooks/                # Custom hooks
├── utils/                # Utilities
└── constants/            # Constants
```

## Naming Conventions

### Variables

```javascript
// ✅ Good
const userName = 'Mario';
const MAX_RETRY_COUNT = 3;
const isLoading = true;
const hasError = false;

// ❌ Bad
const user_name = 'Mario';
const maxretrycount = 3;
const loading = true;  // prefer boolean prefix
```

### Functions

```javascript
// ✅ Good - Verb prefixes
function getUser(id) { }
function fetchSchedule() { }
function calculateTotal() { }
function validateInput() { }
function handleClick() { }
function isValid() { }
function hasPermission() { }

// ❌ Bad
function user(id) { }
function schedule() { }
function total() { }
```

### Components

```javascript
// ✅ Good - PascalCase, descriptive
function ScheduleCard() { }
function UserProfile() { }
function LessonList() { }

// ❌ Bad
function schedulecard() { }
function Card() { }  // Too generic
function sc() { }    // Too short
```

### Constants

```javascript
// ✅ Good - UPPER_SNAKE_CASE for true constants
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const DEFAULT_LANGUAGE = 'it';

// ✅ Good - camelCase for configuration objects
const apiConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
};
```

## Commenti e documentazione

### JSDoc

```javascript
/**
 * Calcola i conflitti nell'orario
 * @param {Array<Lesson>} lessons - Array di lezioni
 * @param {Object} options - Opzioni di configurazione
 * @param {boolean} options.strictMode - Modalità strict
 * @returns {Array<Conflict>} Array di conflitti trovati
 * @throws {ValidationError} Se lessons non è valido
 */
function calculateConflicts(lessons, options = {}) {
  // implementation
}
```

### Inline Comments

```javascript
// ✅ Good - Spiega il "perché", non il "cosa"
// Workaround for Safari bug with date parsing
const date = new Date(dateString.replace(/-/g, '/'));

// Prevent memory leak by cleaning up listeners
return () => {
  window.removeEventListener('resize', handleResize);
};

// ❌ Bad - Commenta l'ovvio
// Set user to null
const user = null;

// Loop through array
for (let i = 0; i < arr.length; i++) {
  // ...
}
```

### TODO Comments

```javascript
// TODO: Add validation for email format
// FIXME: This breaks on mobile Safari
// HACK: Temporary solution until API is fixed
// NOTE: This must be called before initialization
```

## Accessibilità

### Semantic HTML

```jsx
// ✅ Good
<nav>
  <ul>
    <li><a href="/home">Home</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// ❌ Bad
<div className="nav">
  <div className="link">Home</div>
</div>

<div className="main">
  <div className="article">
    <div className="title">Title</div>
    <div>Content</div>
  </div>
</div>
```

### ARIA Labels

```jsx
// ✅ Good
<button 
  aria-label="Chiudi modal"
  onClick={onClose}
>
  <CloseIcon aria-hidden="true" />
</button>

<input
  type="text"
  aria-describedby="email-help"
  aria-required="true"
/>
<span id="email-help">
  Inserisci il tuo indirizzo email
</span>

// ❌ Bad
<div onClick={onClose}>×</div>
<input type="text" placeholder="Email" />
```

### Focus Management

```jsx
// ✅ Good - Visible focus indicator
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

// Trap focus in modal
import { useFocusTrap } from '@/hooks/useFocusTrap';

function Modal({ children }) {
  const modalRef = useFocusTrap();
  
  return <div ref={modalRef}>{children}</div>;
}
```

## Testing

### Test Structure

```javascript
// ✅ Good - AAA pattern (Arrange, Act, Assert)
describe('ScheduleCard', () => {
  it('should display lesson title', () => {
    // Arrange
    const lesson = { id: 1, title: 'Math' };
    
    // Act
    render(<ScheduleCard lesson={lesson} />);
    
    // Assert
    expect(screen.getByText('Math')).toBeInTheDocument();
  });
  
  it('should call onDelete when delete button is clicked', () => {
    // Arrange
    const handleDelete = jest.fn();
    const lesson = { id: 1, title: 'Math' };
    render(<ScheduleCard lesson={lesson} onDelete={handleDelete} />);
    
    // Act
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    // Assert
    expect(handleDelete).toHaveBeenCalledWith(lesson.id);
  });
});
```

### Test Naming

```javascript
// ✅ Good - Descriptive test names
it('should show error message when email is invalid')
it('should disable submit button while loading')
it('should clear form after successful submission')

// ❌ Bad
it('works')
it('test 1')
it('error')
```

## Git

### Commit Messages

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```
feat(schedule): add drag and drop for lessons
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
style(button): improve focus state styling
refactor(api): simplify error handling
test(schedule): add tests for conflict detection
chore(deps): update React to v18.2.0
```

### Branch Naming

```
✅ Good:
feature/ai-suggestions
fix/schedule-overlap-bug
refactor/state-management
docs/update-contributing

❌ Bad:
new-feature
bugfix
update
```

## Code Review Checklist

- [ ] Codice segue le convenzioni di stile
- [ ] Nomi variabili/funzioni sono descrittivi
- [ ] Commenti spiegano il "perché", non il "cosa"
- [ ] Niente codice commentato (usa git)
- [ ] Test aggiunti/aggiornati
- [ ] Accessibilità verificata
- [ ] Performance considerate
- [ ] Error handling appropriato
- [ ] Documentazione aggiornata

## Tools

### ESLint Config

```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "plugin:jsx-a11y/recommended"
  ],
  "plugins": ["jsx-a11y"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "react/prop-types": "warn"
  }
}
```

### Prettier Config

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

---

**Ricorda**: Queste sono linee guida, non regole rigide. Usa il buon senso e privilegia la leggibilità e la manutenibilità del codice.
