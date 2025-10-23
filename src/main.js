// Main application entry point
import './styles/main.css';

// Initialize the app
console.log('OrarioDoc PWA initialized');

// Service Worker registration is handled by Vite PWA plugin
// Check if service worker is supported
if ('serviceWorker' in navigator) {
  console.log('Service Worker support detected');
}

// App state
const app = {
  name: 'OrarioDoc',
  version: '1.0.0'
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  console.log(`${app.name} v${app.version} loaded`);
  
  // Add interactive features to feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  
  featureCards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      console.log(`Feature clicked: ${title}`);
      // Future implementation: navigate to feature
    });
  });
  
  // Add install prompt for PWA
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA install prompt available');
    // Future implementation: show custom install button
  });
  
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });
});

// Export app for use in other modules
export default app;
