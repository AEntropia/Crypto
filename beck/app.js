// app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Adicionar esta linha para carregar as variáveis de ambiente
const cryptoRoutes = require('./routes/cryptoRoutes');
const cryptoEmailRoutes = require('./routes/cryptoEmailRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/', cryptoRoutes);
app.use('/crypto', cryptoEmailRoutes);
app.use('/user', userRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Variáveis de ambiente carregadas: EMAIL_USER=${process.env.EMAIL_USER ? '******' : 'não definido'}`);
});

module.exports = app;