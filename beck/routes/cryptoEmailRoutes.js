// routes/cryptoEmailRoutes.js
const express = require('express');
const { sendEncryptedMessage } = require('../services/emailCryptoService');
const Message = require('../models/Message');
const router = express.Router();

// Rota para obter dados de um usuário (para o formato da mensagem)
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  
  try {
    // Validação básica
    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Nome de usuário inválido' });
    }
    
    // Retorna apenas o nome do usuário para ser usado na mensagem
    // Não estamos expondo outros dados do usuário
    res.json({ username });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao processar requisição' });
  }
});

// Rota para obter uma mensagem criptografada pelo hash
router.get('/message/:hash', async (req, res) => {
  const { hash } = req.params;
  
  try {
    const message = await Message.findOne({ hash });
    
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    
    // Retorna apenas a mensagem criptografada e o hash
    // Não retorna o shift para manter a segurança
    res.json({ 
      encryptedMessage: message.encryptedMessage,
      hash: message.hash
    });
  } catch (error) {
    console.error('Erro ao buscar mensagem:', error);
    res.status(500).json({ error: 'Erro ao processar requisição' });
  }
});

// Rota para enviar email com mensagem criptografada
router.post('/send-email', async (req, res) => {
  const { recipientEmail, username, encryptedMessage, hash, baseUrl } = req.body;
  
  try {
    // Validações
    if (!recipientEmail || !encryptedMessage || !hash || !username || !baseUrl) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    // Validar se a mensagem com este hash existe
    const messageExists = await Message.findOne({ hash });
    if (!messageExists) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }
    
    // Envia o email
    await sendEncryptedMessage(recipientEmail, username, encryptedMessage, hash, baseUrl);
    
    res.json({ success: true, message: 'Email enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

module.exports = router;