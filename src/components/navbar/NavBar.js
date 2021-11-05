import React, { useState } from "react";
import {Link} from "react-router-dom";
import { useNavigate  } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import './NavBar.css';

const NavBar = () => {
  const auth = useAuth();

  let navigate = useNavigate ();
  let handleLogout = (e) => {
    e.preventDefault();
    auth.logout();
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