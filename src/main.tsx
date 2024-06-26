import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';

const container = document.getElementById('root');
const root = createRoot(container!);

import './main.css';

root.render(
  <React.StrictMode>
    <AppProvider >
      <App />
    </AppProvider>
  </React.StrictMode>
);