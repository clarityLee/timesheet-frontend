import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login'
import Summary from './summary/Summary';
import TimeSheet from './timesheet/TimeSheet';
import Profile from './profile/Profile';

const App = () => {
  const [isAuthenticated, setisAutheticated] = useState(false);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/timesheet" element={<TimeSheet />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App; 