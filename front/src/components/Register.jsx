import React, { useState } from "react";
import axios from "axios";

const Register = ({ onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);

  const addToConsole = (text) => {
    setConsoleOutput((prev) => [...prev, text]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!username || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    addToConsole(`Registrando usuário: ${username}...`);

    try {
      // Chamada para a API de registro
      const response = await axios.post('/api/user/register', {
        username,
        password
      });
      
      addToConsole("Registro concluído com sucesso!");
      addToConsole("Redirecionando para login...");
      
      setTimeout(() => {
        onSuccess(username);
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      setError(errorMsg);
      addToConsole(`ERRO: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="card-header">
          <h3>Registro de Novo Usuário</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="status status-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Nome de Usuário:</label>
            <input
              type="text"
              id="reg-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escolha um nome de usuário"
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Senha:</label>
            <input
              type="password"
              id="reg-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Escolha uma senha segura"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm-password">Confirme a Senha:</label>
            <input
              type="password"
              id="reg-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
            />
          </div>

          <div className="card-footer">
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>

        {/* Console de saída para o registro */}
        {consoleOutput.length > 0 && (
          <div className="result-box" style={{ marginTop: "20px" }}>
            {consoleOutput.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
            <div className="blinking-cursor">_</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;