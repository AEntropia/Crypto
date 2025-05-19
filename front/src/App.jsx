import React, { useState, useEffect } from "react";
import "./styles.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Encrypt from "./components/Encrypt";
import Decrypt from "./components/Decrypt";
import WindowsBar from "./components/WindowsBar";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showWindow, setShowWindow] = useState(true);

  useEffect(() => {
    // Adiciona a classe ao body quando o componente montar
    document.body.classList.add('hacker-theme');
    // Remove a classe do body quando o componente desmontar
    return () => {
      document.body.classList.remove('hacker-theme');
    };
  }, []);

  const handleMinimize = () => setIsMinimized(!isMinimized);
  const handleMaximize = () => setIsMaximized(!isMaximized);
  const handleClose = () => {
    setShowWindow(false);
    // Adiciona o efeito de desligamento
    document.body.classList.add('turn-off');
    // Opcional: Após alguns segundos, mostrar novamente
    setTimeout(() => {
      setShowWindow(true);
      document.body.classList.remove('turn-off');
    }, 3000);
  };

  // Função para lidar com o login
  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUsername(user);
    setCurrentPage("encrypt");
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setCurrentPage("login");
  };

  // Renderiza o conteúdo principal
  const renderMainContent = () => {
    if (isAuthenticated) {
      switch (currentPage) {
        case "encrypt":
          return <Encrypt />;
        case "decrypt":
          return <Decrypt />;
        default:
          return <Encrypt />;
      }
    }
    return null; // Não renderiza nada no conteúdo principal quando não autenticado
  };

  if (!showWindow) {
    return (
      <div className="turn-off">
        <div className="screen-off-message">System shutdown...</div>
      </div>
    );
  }

  return (
    <div className={`app-wrapper ${isMaximized ? 'maximized' : ''} ${showWindow ? 'turn-on' : 'turn-off'}`}>
      <WindowsBar 
        title={`CryptoHacker v1.0 ${isAuthenticated ? `- ${username}` : ''}`}
        isMinimized={isMinimized}
        onMinimize={handleMinimize}
        onMaximize={handleMaximize}
        onClose={handleClose}
      >
        {!isAuthenticated ? (
          <div className="login-container full-size">
            <Login onLogin={handleLogin} />
          </div>
        ) : (
          <div className="window-content full-size">
            <div className="terminal-scan">
              <Navbar
                username={username}
                onNavigate={setCurrentPage}
                onLogout={handleLogout}
                currentPage={currentPage}
              />
              <div className="container">
                <h1 className="app-title">
                  CryptoHacker <span className="blinking-cursor">_</span>
                </h1>
                {renderMainContent()}
              </div>
            </div>
          </div>
        )}
      </WindowsBar>
    </div>
  );
}

export default App;