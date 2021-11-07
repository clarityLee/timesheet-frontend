import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

function PrivateRoute ({children}) {
  const auth = useAppContext();
  return auth.isAuthed() ? children : <Navigate to="/login" />
}

export default PrivateRoute;