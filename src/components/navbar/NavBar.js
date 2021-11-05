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
    // <div>
    //   <Link to="/summary" classNameName="navItem">Summary</Link>
    //   <Link to="/timesheet" classNameName="navItem">TimeSheet</Link>
    //   <Link to="/profile" classNameName="navItem">Profile</Link>
    //   <button classNameName="navItem" onClick={handleLogout}>Logout</button>
    // </div>

    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
    
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <span className="navbar-brand mb-0 h1">Timesheet App</span>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <a className="nav-link" href="/summary">Summary</a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/timesheet">TimeSheet</a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="/profile">Profile</a>
          </li>
        </ul>
      </div>
      <button className="nav-item btn btn-outline-secondary my-2 my-sm-0 rightstyle" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default NavBar;