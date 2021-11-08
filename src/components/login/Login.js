import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Login = (prop) => {
  const auth = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  let handleLogin = e => {
    e.preventDefault();
    auth.login(username, password,
      () => navigate("/summary"),
      err => {
        console.log('login failed');
        console.log(err);
      }
    );
  };

  let handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  let handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
      <form className="container" style={{width: "358px"}}>
        <br />
        <h4>Login</h4>
        <hr />
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input type="text" className="form-control" id="username" name="username" onChange={ handleNameChange } placeholder="Enter username" value={username}/>
        </div>
        <br />
        <div className="form-group">
          <label htmlFor="password">Password: </label>
          <input type="password" className="form-control" id="password" name="password" onChange={ handlePasswordChange } placeholder="Enter password" value={password}/>
        </div>
        <hr />
        <div className="text-center">
          <button type="submit" className="btn btn-primary ui button" onClick={handleLogin}>Login</button>
        </div>
      </form>
  );
};

export default Login;