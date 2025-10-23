# Components

This directory contains reusable UI components for the OrarioDoc application.

## Structure

Components should follow a modular structure:

```javascript
// Example component structure
export class ComponentName {
  constructor(container) {
    this.container = container;
    this.render();
  }
  
  render() {
    // Render component
  }
  
  destroy() {
    // Cleanup
  }
}
```

## Planned Components

- Schedule viewer
- Class list
- Lesson card
- AI assistant interface
- Settings panel
