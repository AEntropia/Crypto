import React, { useState } from "react";
import axios from "axios";
import Register from "./Register";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);

  const addToConsole = (text) => {
    setConsoleOutput((prev) => [...prev, text]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    setLoading(true);
    addToConsole(`Autenticando usuário: ${username}...`);
    addToConsole("Verificando credenciais...");

    try {
      // Chamada para a API de login
      const response = await axios.post('/api/user/login', {
        username,
        password
      });
      
      addToConsole("Autenticação bem-sucedida!");
      addToConsole("Carregando sistema de criptografia...");
      
      setTimeout(() => {
        onLogin(username);
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setError(errorMsg);
      addToConsole(`ERRO: ${errorMsg}`);
      addToConsole("Acesso negado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const handleRegisterSuccess = (user) => {
    setShowRegister(false);
    setUsername(user);
    setPassword("");
    addToConsole(`Usuário '${user}' registrado com sucesso!`);
    addToConsole("Por favor, faça login com suas novas credenciais.");
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Acesso ao Terminal</h2>
      </div>

      {error && <div className="status status-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu nome de usuário"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <div className="card-footer">
          <button type="button" onClick={toggleRegister}>
            Registrar
          </button>
          <button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Login"}
          </button>
        </div>
      </form>

      {/* Terminal decoration with console output */}
      <div style={{ marginTop: "20px", fontSize: "0.9rem", color: "#88ff88" }}>
        <div>Last login: {new Date().toLocaleString()}</div>
        <div>System: CryptoHacker v1.0.0</div>
        <div>-----------------------------------</div>
        <div>
          <span style={{ color: "#00ff00" }}>$</span> Iniciando sistema de
          criptografia...
        </div>
        {consoleOutput.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div className="blinking-cursor">_</div>
      </div>

      {showRegister && (
        <Register onClose={toggleRegister} onSuccess={handleRegisterSuccess} />
      )}
    </div>
  );
};

export default Login;