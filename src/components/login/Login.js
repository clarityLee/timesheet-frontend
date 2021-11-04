import React, { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import axios from "axios";
import useAuth from '../useAuth'

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  // const { login } = useAuth();
  // console.log(login);

  let handleLogin = () => {
    console.log(username);
    console.log(password);
    const data = {
      username: "john",
      password: "123"
    };
    console.log(data);
    // axios.post(`http://localhost:9000/auth/login`, {withCredentials: true}, data).then(function(response) {
    //   console.log(response);
    //   navigate("/summary");
    // });
    navigate("/summary");
  };

  let handleNameChange = (e) => {
    setUsername(e.target.value);
  };

  let handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  return (
    <div>
      <div>
        <label htmlFor="username">username:</label>
        <input type="text" id="username" name="username" onChange={ handleNameChange }/>
      </div>
      <div>
        <label htmlFor="password">password:</label>
        <input type="password" id="password" name="password" onChange={ handlePasswordChange }/>
      </div>
      <button onClick={handleLogin}>submit</button>
    </div>
  );
};

export default Login;