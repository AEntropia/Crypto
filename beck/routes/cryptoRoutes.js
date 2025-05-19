//routes/cryptoRoutes.js
const express = require('express');
const crypto = require('crypto');
const Message = require('../models/Message');

const router = express.Router();

// Função de Cifra de César
function caesarCipher(str, shift) {
  return str
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90)
        return String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
      if (code >= 97 && code <= 122)
        return String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
      return char;
    })
    .join('');
}

// POST /encrypt
router.post('/encrypt', async (req, res) => {
  const { message, shift } = req.body;

  const encrypted = caesarCipher(message, shift);
  const hash = crypto.randomBytes(16).toString('hex');

  const saved = await Message.create({ encryptedMessage: encrypted, shift, hash });

  res.json({ encrypted, hash });
});

// POST /decrypt
router.post('/decrypt', async (req, res) => {
  const { encryptedMessage, hash } = req.body;

  const record = await Message.findOne({ hash });

  if (!record || record.used || record.encryptedMessage !== encryptedMessage)
    return res.status(400).json({ error: 'Hash inválido ou já utilizado.' });

  const original = caesarCipher(encryptedMessage, -record.shift);
  record.used = true;
  await record.save();

  res.json({ original });
});

module.exports = router;
