import React from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import './NavBar.css';

const NavBar = () => {
  const context = useAppContext();

  let navigate = useNavigate ();
  let handleLogout = (e) => {
    e.preventDefault();
    context.logout();
    navigate("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <span className="navbar-brand mb-0 h1">Timesheet App</span>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to="/summary">Summary</Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/timesheet">TimeSheet</Link>
          </li>
          <li className="nav-item active">
            <Link className="nav-link" to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
      <button className="nav-item btn btn-outline-secondary my-2 my-sm-0 rightstyle" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default NavBar;