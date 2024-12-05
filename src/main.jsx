import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import global styles
import '@shared/styles/global.css';
import '@shared/styles/theme.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
