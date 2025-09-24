import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import './index.css';
import { initAnalytics } from './utils/analytics';
import { ThemeProvider } from './providers/theme-provider';

const queryClient = new QueryClient();

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container missing');
}

if (import.meta.env.PROD) {
  initAnalytics();
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
