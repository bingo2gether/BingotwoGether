import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import { notificationService } from './services/notificationService';

const root = ReactDOM.createRoot(rootElement);

// Register Service Worker
notificationService.registerSw();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
