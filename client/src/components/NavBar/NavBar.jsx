import { Link, NavLink } from "react-router-dom";
import "./nav-bar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Register
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
