import React, { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const Login = (prop) => {
  const auth = useAppContext();
  const [username, setUsername] = useState('john');
  const [password, setPassword] = useState('123');

  const navigate = useNavigate();

  let handleLogin = () => {
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
      <div className="ui form">
        <div>
          <label htmlFor="username">username:</label>
          <input type="text" id="username" name="username" onChange={ handleNameChange } value={username}/>
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input type="password" id="password" name="password" onChange={ handlePasswordChange } value={password}/>
        </div>
        <button onClick={handleLogin} className="ui button primary">submit</button>
      </div>
  );
};

export default Login;