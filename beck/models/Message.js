const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  encryptedMessage: String,
  shift: Number,
  hash: String,
  used: { type: Boolean, default: false },
});

module.exports = mongoose.model('Message', messageSchema);
