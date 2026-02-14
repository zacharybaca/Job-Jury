import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          {/* Replace this text with an <img> tag for a real logo later */}
          <h1>MERN Starter</h1>
        </Link>
      </div>
      <NavBar />
    </header>
  );
};

export default Header;
