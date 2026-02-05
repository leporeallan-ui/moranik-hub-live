
import React from 'react';
import ReactDOM from 'react-dom/client';
import TestApp1 from './App.test1';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Starting TestApp1 with Layout component...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <TestApp1 />
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

console.log('TestApp1 rendered');
