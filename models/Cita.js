const mongoose = require('mongoose');
const citaSchema = new mongoose.Schema({
  clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
  servicio: String,
  estilista: String,
  fecha: String,
  hora: String,
  estado: { type: String, default: 'Confirmada' }
});
module.exports = mongoose.model('Cita', citaSchema);
