import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

import { notificationService } from './services/notificationService';

const root = ReactDOM.createRoot(rootElement);
const googleClientId = (import.meta as any).env.VITE_GOOGLE_CLIENT_ID || "mock_client_id";

// Register Service Worker
notificationService.registerSw();

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
