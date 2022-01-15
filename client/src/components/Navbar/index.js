import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "utils/favicon.svg";
import Button from "components/Button";

import "./styles.scss";

const Navbar = () => {
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: "rgba(0, 0, 0, 0)",
    height: "140px",
  });

  const handleScroll = () => {
    if (window.scrollY === 0) {
      setNavbarStyle({
        backgroundColor: "rgba(0, 0, 0, 0)",
        height: "140px",
      });
    } else if (window.scrollY > 0 && window.scrollY <= 300) {
      setNavbarStyle({
        backgroundColor: "rgba(0, 0, 0, " + (window.scrollY / 300) * 0.3 + ")",
        height: 140 - (window.scrollY / 300) * 40 + "px",
      });
    } else {
      setNavbarStyle({
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        height: "100px",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav style={navbarStyle}>
      <Link
        to="/"
        className="nav-logo"
        style={{ textDecoration: "none", color: "white" }}
      >
        <Logo fill="#fff" width="100" className="logo" />
        <h1>Skincare Routine Builder</h1>
      </Link>
      <div className="nav-menu">
        <div className="link">
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            Login
          </Link>
        </div>
        <Button backgroundColor="#29434B" link="/register">
          Get Started
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
