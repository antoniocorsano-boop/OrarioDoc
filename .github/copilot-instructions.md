# Copilot Instructions for OrarioDoc

## Project Overview

OrarioDoc is a Progressive Web App (PWA) designed to help teachers manage schedules, lessons, and educational activities. The application integrates AI functionality to simplify planning and improve user experience.

**Key Principles:**
- Privacy-first: Data stays on the user's device
- Accessibility: WCAG 2.1 Level AA minimum standard
- Progressive Enhancement: Offline-first approach
- Open Source: Community contributions welcome

## Technology Stack

- **Frontend**: React 18+
- **State Management**: Redux Toolkit or Zustand (prefer simpler solution for MVP, upgrade if needed)
- **Styling**: CSS Modules or Styled Components (prefer CSS Modules for consistency)
- **PWA**: Workbox for service worker
- **AI Integration**: Custom AI utilities
- **Build Tool**: Vite or Create React App (Vite preferred for better performance and modern tooling)
- **Testing**: Jest, React Testing Library
- **Language**: JavaScript (ES6+) - TypeScript may be added later based on team preference

## Project Structure

```
OrarioDoc/
├── .github/              # GitHub templates and workflows
├── docs/                 # Documentation
│   ├── ARCHITECTURE.md   # System architecture and design
│   ├── QUICKSTART.md     # Detailed installation guide
│   ├── STYLE_GUIDE.md    # Development style guidelines
│   └── OPEN_SOURCE_COMPONENTS.md
├── public/               # Static assets and PWA manifest
├── src/
│   ├── components/       # React reusable components
│   │   ├── common/       # Common components (Button, Input, etc.)
│   │   ├── layout/       # Layout components (Header, Footer, Sidebar)
│   │   └── features/     # Feature-specific components
│   ├── screens/          # Application pages/screens
│   ├── store/            # State management
│   ├── routes/           # Routing configuration
│   ├── utils/            # Utility functions
│   ├── ai/               # AI modules
│   │   ├── suggestions/  # Suggestion system
│   │   ├── scheduling/   # Scheduling algorithms
│   │   └── analysis/     # Analysis and insights
│   ├── assets/           # Images, fonts, styles
│   └── hooks/            # Custom React hooks
├── CONTRIBUTING.md       # Contribution guidelines
└── README.md             # Project readme
```

## Build and Development Commands

**Note**: The project is in early development. Standard React commands will apply:

- `npm install` - Install dependencies
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm run lint` - Run linter
- `npm run serve` - Test production build locally

## Code Style Guidelines

Follow the conventions defined in [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md). Key highlights:

### JavaScript/React
- Use ES6+ modern features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions appropriately
- PascalCase for components, camelCase for functions/variables
- UPPER_SNAKE_CASE for constants

### Component Structure
```jsx
// Imports
// Constants
// Component with hooks, effects, handlers
// PropTypes
// Default props
// Export
```

### Naming Conventions
- Components: `ScheduleCard`, `UserProfile` (PascalCase, descriptive)
- Functions: `getUser`, `handleClick`, `isValid` (camelCase with verb prefixes)
- Hooks: `useSchedule`, `useAuth` (camelCase starting with 'use')
- Files: Match component name (e.g., `ScheduleCard.jsx`, `ScheduleCard.module.css`)

### CSS
- Use BEM-inspired naming for CSS classes
- Use CSS variables for theming
- Mobile-first responsive design
- CSS Modules preferred for component styles

## Accessibility Requirements

**Critical**: All code must meet WCAG 2.1 Level AA standards minimum.

### Implementation Guidelines
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, etc.)
- Provide ARIA labels for interactive elements
- Ensure keyboard navigation support
- Maintain adequate color contrast
- Provide alternative text for images
- Test with screen readers when possible
- Use `aria-label`, `aria-labelledby`, `aria-describedby` appropriately
- Manage focus properly (visible focus indicators, focus trapping in modals)

### Example
```jsx
<button 
  aria-label="Close modal"
  onClick={onClose}
>
  <CloseIcon aria-hidden="true" />
</button>
```

## Testing Strategy

### Test Pyramid
- **Unit Tests** (80%): Jest + React Testing Library
- **Integration Tests** (15%): Testing Library
- **E2E Tests** (5%): Cypress or Playwright
- **Accessibility Tests**: jest-axe

### Test Structure
Follow AAA pattern (Arrange, Act, Assert):
```javascript
describe('ComponentName', () => {
  it('should do something specific', () => {
    // Arrange
    const props = { ... };
    
    // Act
    render(<Component {...props} />);
    
    // Assert
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

## Commit Message Format

Use Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting (no logic changes)
- `refactor`: Code restructuring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

**Examples:**
```
feat(schedule): add drag and drop for lessons
fix(auth): resolve token expiration issue
docs(readme): update installation instructions
test(schedule): add conflict detection tests
```

## AI Integration

The app includes AI features for:
- **Smart Scheduling**: Automatic suggestions for time slots, conflict detection
- **Pattern Analysis**: Usage pattern identification, personalized suggestions
- **Intelligent Assistance**: Smart autocomplete, contextual suggestions

AI modules are located in `src/ai/` and should be modular and testable.

## PWA Requirements

- Service Worker for offline functionality
- Cache-first strategy for static assets
- Network-first for API calls
- IndexedDB for local storage
- Background sync when online
- Responsive design for all devices

## Privacy and Security

- All user data stored locally
- No external tracking or invasive analytics
- Encrypt sensitive data
- Validate and sanitize all inputs
- Follow Content Security Policy (CSP)
- No plain text passwords

## Important Guidelines for Code Changes

1. **Small, focused changes**: Prefer small PRs over large ones
2. **One thing at a time**: Don't mix refactoring with new features
3. **Test coverage**: Maintain >80% test coverage
4. **Accessibility first**: Every feature must be accessible
5. **Documentation**: Update docs if behavior changes
6. **Performance**: Consider lazy loading and code splitting
7. **Mobile support**: Test on mobile devices/viewports
8. **Italian language**: Primary language for UI is Italian

## Best Practices

- **DRY** (Don't Repeat Yourself): Avoid code duplication
- **KISS** (Keep It Simple, Stupid): Prefer simple solutions
- **YAGNI** (You Aren't Gonna Need It): Don't add unnecessary features
- Use existing libraries when appropriate
- Write self-documenting code with descriptive names
- Add comments only to explain "why", not "what"

## References

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Full contribution guidelines
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture details
- [docs/STYLE_GUIDE.md](./docs/STYLE_GUIDE.md) - Complete style guide
- [React Documentation](https://react.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## When Working on Issues

1. Read the issue description carefully
2. Check related files and existing patterns
3. Follow the established code style
4. Write tests for new functionality
5. Verify accessibility compliance
6. Update documentation if needed
7. Test in different browsers/devices
8. Use small, focused commits with clear messages

## Questions or Clarifications

For questions or clarifications, refer to:
- Existing documentation in `docs/`
- Open an issue with type "question"
- Check CONTRIBUTING.md for guidelines
