import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { DunabProvider } from './context/DunabContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

function App() {
  // TODO: Integrar todos los providers y rutas

  return (
    <AuthProvider>
      <DunabProvider>
        <ThemeProvider>
          <NotificationProvider>
            <div className="App">
              <h1>DUNAB - Sistema de Gestión de Dinero UNAB</h1>
              <p>Estructura del proyecto creada exitosamente</p>
              {/* TODO: Descomentar cuando se implementen las rutas */}
              {/* <AppRoutes /> */}
            </div>
          </NotificationProvider>
        </ThemeProvider>
      </DunabProvider>
    </AuthProvider>
  );
}

export default App;
