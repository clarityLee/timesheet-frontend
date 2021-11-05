import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth';

function PrivateRoute ({children}) {
  const auth = useAuth();
  return auth.isAuthed() ? children : <Navigate to="/login" />
};

export default PrivateRoute;