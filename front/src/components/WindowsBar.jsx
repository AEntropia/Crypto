import React, { useState, useEffect } from 'react';

const WindowsBar = ({ title, isMinimized, onMinimize, onMaximize, onClose, children }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-control-button')) return;
    // Desativa o arrasto quando a janela está maximizada
    // pois não faz sentido arrastar quando ocupa a tela toda
    setIsDragging(false);
  };
  
  return (
    <div className="window-container crt-effect">
      <div className="title-bar" onMouseDown={handleMouseDown}>
        <div className="title-bar-text">
          <span className="window-icon">
            <span className="glitch-icon" data-icon="🔒"></span>
          </span>
          {title || "CryptoHacker v1.0"}
        </div>
        <div className="title-bar-controls">
          <button className="window-control-button minimize-button" onClick={onMinimize} aria-label="Minimize">
            <span>_</span>
          </button>
          <button className="window-control-button maximize-button" onClick={onMaximize} aria-label="Maximize">
            <span>□</span>
          </button>
          <button className="window-control-button close-button" onClick={onClose} aria-label="Close">
            <span>×</span>
          </button>
        </div>
      </div>
      
      {/* Conteúdo da janela - não oculta mais com isMinimized para manter o layout */}
      <div className={`window-content ${isMinimized ? 'minimized' : ''}`}>
        {children}
      </div>
      
      <div className="windows-taskbar">
        <div className="start-button">
          <span className="start-icon">CH</span>
          Chrome
        </div>
        <div className="taskbar-programs">
          <div className="taskbar-program active">
            <span className="program-icon">🔒</span>
            CryptoHacker
          </div>
        </div>
        <div className="taskbar-tray">
          <div className="tray-icon">
            <span className="volume-icon">🔊</span>
          </div>
          <div className="tray-time">{formattedTime}</div>
        </div>
      </div>
    </div>
  );
};

export default WindowsBar;