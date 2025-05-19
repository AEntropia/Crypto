import React from "react";

const Navbar = ({ username, onNavigate, onLogout, currentPage }) => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <span role="img" aria-label="hacker">
            🔒
          </span>{" "}
          CryptoHacker
        </div>
        <div>
          <span style={{ marginRight: "15px" }}>
            <span style={{ color: "#88ff88" }}>root@</span>
            {username}:<span style={{ color: "#88ff88" }}>~#</span>
          </span>
        </div>
        <div className="navbar-links">
          <a
            href="#encrypt"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("encrypt");
            }}
            style={{
              textDecoration: currentPage === "encrypt" ? "underline" : "none",
            }}
          >
            Criptografar
          </a>
          <a
            href="#decrypt"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("decrypt");
            }}
            style={{
              textDecoration: currentPage === "decrypt" ? "underline" : "none",
            }}
          >
            Descriptografar
          </a>
          <a
            href="#logout"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
          >
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
