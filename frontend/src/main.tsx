import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfig';

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// ✅ First initialize the instance
msalInstance.initialize().then(() => {
  // ✅ Then handle redirect
  return msalInstance.handleRedirectPromise();
}).then(() => {
  // ✅ Then finally render your app
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
}).catch((error) => {
  console.error("MSAL init or redirect error:", error);
});
