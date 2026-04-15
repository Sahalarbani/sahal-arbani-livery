/**
 * @version 1.0.0
 * @changelog
 * - [15-04-2026] Pembuatan entry point React DOM (createRoot).
 * - [15-04-2026] Injeksi global CSS dan root component App.tsx.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// StrictMode membantu mendeteksi bug pada fase development
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
