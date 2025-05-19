const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String, // será armazenada com bcrypt
});

module.exports = mongoose.model('User', userSchema);
