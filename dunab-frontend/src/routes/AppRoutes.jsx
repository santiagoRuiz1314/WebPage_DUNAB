import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// TODO: Importar páginas cuando se implementen
// import Dashboard from '../pages/Dashboard';
// import Login from '../pages/Login';
// etc...

const AppRoutes = () => {
  // TODO: Implementar rutas de la aplicación

  return (
    <Router>
      <Routes>
        {/* TODO: Agregar rutas */}
        {/* <Route path="/" element={<Dashboard />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/transactions" element={<Transactions />} /> */}
        {/* <Route path="/events" element={<Events />} /> */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
