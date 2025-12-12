const mongoose = require('mongoose');
const clienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  rol: { type: String, default: 'cliente' }
});
module.exports = mongoose.model('Cliente', clienteSchema);
