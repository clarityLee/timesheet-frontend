import * as React from "react";
console.log('useAuth')
const authContext = React.createContext();

function useAuth() {
  console.log("useAuth called");
  const [authed, setAuthed] = React.useState(false);

  return {
    authed,
    login() {
      return new Promise((res) => {
        setAuthed(true);
        res();
      });
    },
    logout() {
      return new Promise((res) => {
        setAuthed(false);
        res();
      });
    }
  };
}

export function AuthProvider({ children }) {
  console.log("AuthProvider called");
  const auth = useAuth();
  console.log(auth);
  console.log('---');

  return (
    <authContext.Provider value={auth}>
      {children}
    </authContext.Provider>
  );
}

export default function AuthConsumer() {
  return React.useContext(authContext);
}