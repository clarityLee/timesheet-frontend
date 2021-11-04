import React, { useState } from "react";
import {Link} from "react-router-dom";
import { useNavigate  } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {

  const[ isAutheticated, setisAutheticated ] = useState(false);

  let navigate = useNavigate ();
  let handleLogout = e => {
    e.preventDefault();
    setisAutheticated(false);
    window.sessionStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <div>
      <Link to="/summary" className="navItem">Summary</Link>
      <Link to="/timesheet" className="navItem">TimeSheet</Link>
      <Link to="/profile" className="navItem">Profile</Link>
      <button className="navItem" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default NavBar;