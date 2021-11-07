import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login'
import Summary from './summary/Summary';
import TimeSheet from './timesheet/TimeSheet';
import Profile from './profile/Profile';
import PrivateRoute from './PrivateRoute';
import AppContextProvider from '../contexts/AppContextProvider';

const App = () => {
  return (
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PrivateRoute><Summary /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/summary" element={<PrivateRoute><Summary /></PrivateRoute>} />
            <Route path="/timesheet" element={<PrivateRoute><TimeSheet /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
  );
};

export default App; 