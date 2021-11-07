import React, { useContext } from 'react';

const AppContext = React.createContext();
export default AppContext;
export function useAppContext() {
  return useContext(AppContext);
}