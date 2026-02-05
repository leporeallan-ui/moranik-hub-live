
import React from 'react';
import ReactDOM from 'react-dom/client';
import MinimalApp from './App.minimal';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Starting minimal React app...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MinimalApp />
  </React.StrictMode>
);

// Add error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Add error handling for global errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

console.log('Minimal React app rendered');
