import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  const toggleNavbar = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
      <div className="container">
        <a className="navbar-brand me-2" href="https://mdbgo.com/">
          <img
            src="https://mdbcdn.b-cdn.net/img/logo/mdb-transaprent-noshadows.webp"
            height="16"
            alt="MDB Logo"
            loading="lazy"
            style={{ marginTop: "-1px" }}
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarButtonsExample"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          <i className="fas fa-bars"></i>
        </button>

        <div
          className={`collapse navbar-collapse ${isNavCollapsed ? "" : "show"}`}
          id="navbarButtonsExample"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => navigate("/app")}>
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => navigate("/app/user-list")}
              >
                Users
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={() => navigate("/app/profile")}
              >
                My Profile
              </a>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <button
              data-mdb-ripple-init
              type="button"
              className="btn btn-primary me-3"
              onClick={handleLogout}
            >
              Login Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
