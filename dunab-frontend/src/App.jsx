import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DunabProvider } from './context/DunabContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DunabProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </DunabProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
