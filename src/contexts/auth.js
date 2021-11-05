import React, { useContext } from 'react';

const AuthContext = React.createContext();
export default AuthContext;
export function useAuth() {
  return useContext(AuthContext);
}