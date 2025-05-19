import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios

const Encrypt = () => {
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(3);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);

  const handleEncrypt = async () => {
    if (!message) {
      addToConsole("ERRO: Nenhuma mensagem para criptografar.");
      return;
    }

    setLoading(true);
    addToConsole("Iniciando processo de criptografia...");

    try {
      addToConsole(`Aplicando Cifra de César com deslocamento de ${shift} posições...`);
      addToConsole("Enviando solicitação para o servidor...");
      
      // Chamada para a API backend
      const response = await axios.post('/api/encrypt', {
        message,
        shift: parseInt(shift, 10)
      });
      
      // Atualiza com os dados recebidos do servidor
      const { encrypted, hash } = response.data;
      setEncryptedMessage(encrypted);
      setHash(hash);

      addToConsole("Criptografia concluída com sucesso.");
      addToConsole(`Hash de verificação gerado: ${hash}`);
    } catch (error) {
      addToConsole(`ERRO: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addToConsole = (text) => {
    setConsoleOutput((prev) => [...prev, text]);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  // Função para copiar o texto criptografado
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToConsole("Texto copiado para a área de transferência.");
      })
      .catch((err) => {
        addToConsole("Erro ao copiar texto: " + err);
      });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Criptografia - Cifra de César</h2>
      </div>

      <div className="form-group">
        <label htmlFor="message">Mensagem a ser criptografada:</label>
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite a mensagem a ser criptografada..."
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="shift">Deslocamento (número de casas):</label>
        <input
          type="number"
          id="shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          min="1"
          max="25"
        />
      </div>

      <div className="card-footer">
        <button type="button" onClick={handleEncrypt} disabled={loading}>
          {loading ? "Criptografando..." : "Criptografar"}
        </button>
      </div>

      {/* Console de saída */}
      {consoleOutput.length > 0 && (
        <div className="result-box" style={{ marginTop: "20px" }}>
          {consoleOutput.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div>
            <button
              type="button"
              onClick={clearConsole}
              style={{
                marginTop: "10px",
                fontSize: "0.8rem",
                padding: "5px 10px",
              }}
            >
              Limpar Console
            </button>
          </div>
        </div>
      )}

      {/* Resultado da criptografia */}
      {encryptedMessage && (
        <div className="card" style={{ marginTop: "20px" }}>
          <div className="card-header">
            <h3>Resultado da Criptografia</h3>
          </div>
          <div className="form-group">
            <label>Mensagem Criptografada:</label>
            <div className="result-box" style={{ marginBottom: "10px" }}>
              {encryptedMessage}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(encryptedMessage)}
              style={{ marginRight: "10px" }}
            >
              Copiar Mensagem
            </button>
          </div>

          <div className="form-group">
            <label>Hash de Verificação:</label>
            <div
              className="result-box"
              style={{ marginBottom: "10px", color: "#88ff88" }}
            >
              {hash}
            </div>
            <button type="button" onClick={() => copyToClipboard(hash)}>
              Copiar Hash
            </button>
            <p
              style={{
                fontSize: "0.9rem",
                marginTop: "10px",
                color: "#88ff88",
              }}
            >
              * Guarde este hash para verificar a integridade da mensagem ao
              descriptografar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Encrypt;