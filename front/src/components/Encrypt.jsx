import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css"; // Assuma que temos um arquivo CSS para estilização

const Encrypt = () => {
  const [message, setMessage] = useState("");
  const [shift, setShift] = useState(3);
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  
  // Estados para o modal de email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [username, setUsername] = useState("Usuário"); // Nome padrão
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Buscar nome de usuário se estiver logado (exemplo)
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        // Imagine que temos uma API para verificar se o usuário está logado
        const response = await axios.get('/api/user/current');
        if (response.data && response.data.username) {
          setUsername(response.data.username);
        }
      } catch (error) {
        // Se não estiver logado, mantém o valor padrão
        console.log("Usuário não está logado ou erro ao buscar informações");
      }
    };
    
    fetchUsername();
  }, []);

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
      
      // Pergunta se deseja enviar por email
      setShowEmailPrompt(true);
    } catch (error) {
      addToConsole(`ERRO: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      addToConsole("ERRO: Endereço de email do destinatário é obrigatório.");
      return;
    }

    setSendingEmail(true);
    addToConsole("Enviando mensagem criptografada por email...");

    try {
      // Obtém a URL base do site atual
      const baseUrl = window.location.origin;
      
      const response = await axios.post('/api/crypto/send-email', {
        recipientEmail,
        username,
        encryptedMessage,
        hash,
        baseUrl
      });
      
      addToConsole("Email enviado com sucesso!");
      setEmailSent(true);
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSent(false);
      }, 2000);
    } catch (error) {
      addToConsole(`ERRO ao enviar email: ${error.response?.data?.error || error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleEmailPromptResponse = (willSend) => {
    setShowEmailPrompt(false);
    if (willSend) {
      setShowEmailModal(true);
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

  // Função para copiar a mensagem formatada para o email
  const copyFormattedMessage = () => {
    const formattedMessage = `${username} te mandou uma mensagem criptografada ${encryptedMessage} ${hash} acesse o site ${window.location.origin}/decrypt/${hash} para descriptografar!`;
    
    navigator.clipboard
      .writeText(formattedMessage)
      .then(() => {
        addToConsole("Mensagem formatada copiada para a área de transferência.");
      })
      .catch((err) => {
        addToConsole("Erro ao copiar mensagem formatada: " + err);
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

          <div className="form-group">
            <label>Mensagem Formatada para Compartilhar:</label>
            <div className="result-box" style={{ marginBottom: "10px", fontSize: "0.9rem" }}>
              {`${username} te mandou uma mensagem criptografada ${encryptedMessage} ${hash} acesse o site ${window.location.origin}/decrypt/${hash} para descriptografar!`}
            </div>
            <button
              type="button"
              onClick={copyFormattedMessage}
              style={{ marginRight: "10px" }}
            >
              Copiar Mensagem Formatada
            </button>
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              style={{ backgroundColor: "#28a745" }}
            >
              Enviar por E-mail
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmação para enviar email */}
      {showEmailPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Deseja enviar esta mensagem por email?</h3>
            <div className="modal-buttons">
              <button onClick={() => handleEmailPromptResponse(true)}>Sim</button>
              <button onClick={() => handleEmailPromptResponse(false)}>Não</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para enviar email */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Enviar Mensagem Criptografada</h3>
            
            {emailSent ? (
              <div className="success-message">
                Email enviado com sucesso!
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="recipient-email">Email do Destinatário:</label>
                  <input
                    type="email"
                    id="recipient-email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="sender-name">Seu Nome (exibido no email):</label>
                  <input
                    type="text"
                    id="sender-name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="modal-buttons">
                  <button 
                    onClick={handleSendEmail} 
                    disabled={sendingEmail}
                    style={{ backgroundColor: "#28a745" }}
                  >
                    {sendingEmail ? "Enviando..." : "Enviar Email"}
                  </button>
                  <button onClick={() => setShowEmailModal(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Encrypt;