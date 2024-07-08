import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <header
    style={{ backgroundColor: "#6a1b9a", color: "#ffffff", padding: "10px" }}
  >
    <h1>Kasemrad Sriburin Hospital Coordination</h1>
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
      <Link to="/contact">Contact</Link>
    </nav>
  </header>
);

export default Header;
