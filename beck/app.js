const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cryptoRoutes = require('./routes/cryptoRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cesar', {
}).then(() => console.log('MongoDB conectado'));

app.use('/', cryptoRoutes);
app.use('/user', userRoutes); // <-- rotas de autenticação

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
