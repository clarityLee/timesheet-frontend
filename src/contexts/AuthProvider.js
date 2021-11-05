import React from 'react';
import AuthContext from './auth';
import axios from 'axios';

class AuthProvider extends React.Component {

  
  isAuthed = window.sessionStorage.getItem("username") != null;
  render() {
    return (
      <AuthContext.Provider
        value={{
          isAuthed: () => {
            return this.isAuthed;
          },
          login: (username, password, onSuccess, onFail) => {
            let data = {'username': username, 'password': password};
            axios.post(`http://localhost:9000/auth/login`, data, {withCredentials:true})
            .then(
              (resp) => {
                this.isAuthed = true;
                window.sessionStorage.setItem("username", username);
                console.log("login success");
                onSuccess();
              }, 
              (error) => {
                console.log("login failes");
                onFail();
              }
            )
          },
          logout: () => {
            window.sessionStorage.removeItem("username");
            this.isAuthed = false;
            
          }
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;