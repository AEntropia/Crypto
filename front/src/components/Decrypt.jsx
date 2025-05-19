import React, { useState } from "react";
import axios from "axios";

const Decrypt = () => {
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [hash, setHash] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [verified, setVerified] = useState(null);

  const handleDecrypt = async () => {
    if (!encryptedMessage) {
      addToConsole("ERRO: Nenhuma mensagem para descriptografar.");
      return;
    }

    if (!hash) {
      addToConsole("ERRO: Hash de verificação é obrigatório para descriptografar.");
      return;
    }

    setLoading(true);
    setVerified(null);
    setDecryptedMessage("");
    addToConsole("Iniciando processo de descriptografia...");

    try {
      addToConsole("Enviando solicitação para o servidor...");
      
      // Chamada para a API backend
      const response = await axios.post('/api/decrypt', {
        encryptedMessage,
        hash
      });
      
      const { original } = response.data;
      setDecryptedMessage(original);
      setVerified(true);
      
      addToConsole("Mensagem descriptografada com sucesso!");
      addToConsole("Hash verificado com sucesso!");
    } catch (error) {
      setVerified(false);
      const errorMsg = error.response?.data?.error || error.message;
      addToConsole(`ERRO: ${errorMsg}`);
      
      if (errorMsg.includes("Hash inválido") || errorMsg.includes("já utilizado")) {
        addToConsole("ALERTA: O hash fornecido não é válido ou já foi utilizado.");
      }
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

  // Função para copiar o texto descriptografado
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
        <h2>Descriptografia - Cifra de César</h2>
      </div>

      <div className="form-group">
        <label htmlFor="encrypted-message">Mensagem Criptografada:</label>
        <textarea
          id="encrypted-message"
          rows="4"
          value={encryptedMessage}
          onChange={(e) => setEncryptedMessage(e.target.value)}
          placeholder="Cole aqui a mensagem criptografada..."
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="hash">Hash de Verificação:</label>
        <input
          type="text"
          id="hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          placeholder="Cole aqui o hash para verificar a integridade..."
        />
        <p style={{ fontSize: "0.8rem", color: "#88ff88", marginTop: "5px" }}>
          O hash é necessário para descriptografar a mensagem corretamente.
        </p>
      </div>

      <div className="card-footer">
        <button type="button" onClick={handleDecrypt} disabled={loading}>
          {loading ? "Descriptografando..." : "Descriptografar"}
        </button>
      </div>

      {/* Console de saída */}
      {consoleOutput.length > 0 && (
        <div
          className="result-box"
          style={{ marginTop: "20px", maxHeight: "200px", overflowY: "auto" }}
        >
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

      {/* Resultado da descriptografia */}
      {decryptedMessage && (
        <div className="card" style={{ marginTop: "20px" }}>
          <div className="card-header">
            <h3>Resultado da Descriptografia</h3>
            {verified !== null && (
              <div
                className={`status ${
                  verified ? "status-success" : "status-error"
                }`}
                style={{ marginBottom: "0" }}
              >
                {verified
                  ? "✓ Verificado com sucesso"
                  : "✗ Não verificado - o hash não corresponde ou já foi utilizado"}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Mensagem Descriptografada:</label>
            <div className="result-box" style={{ marginBottom: "10px" }}>
              {decryptedMessage}
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(decryptedMessage)}
            >
              Copiar Mensagem Original
            </button>
          </div>

          <div
            style={{
              fontSize: "0.9rem",
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "rgba(0, 20, 0, 0.5)",
              border: "1px dashed var(--hacker-green)",
            }}
          >
            <p>
              <span style={{ color: "#88ff88" }}>Nota:</span> Esta mensagem foi descriptografada 
              usando o servidor. Cada hash só pode ser utilizado uma única vez para descriptografia.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decrypt;