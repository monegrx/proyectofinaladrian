const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');
const Cita = require('../models/Cita');
const bcrypt = require('bcrypt');

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.rol === 'admin') return next();
  res.redirect('/');
}

// Página principal
router.get('/', (req, res) => res.render('index', { user: req.session.user }));

// Login
router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Cliente.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.render('login', { error: 'Credenciales inválidas' });
  }
  req.session.user = { id: user._id, nombre: user.nombre, rol: user.rol };
  res.redirect(user.rol === 'admin' ? '/admin' : '/');
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// Registro
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

router.post('/register', async (req, res) => {
  const { nombre, email, telefono, password, confirmar } = req.body;

  if (!nombre || !email || !telefono || !password || !confirmar) {
    return res.render('register', { error: 'Todos los campos son obligatorios.', success: null });
  }

  if (password !== confirmar) {
    return res.render('register', { error: 'Las contraseñas no coinciden.', success: null });
  }

  const yaExiste = await Cliente.findOne({ email });
  if (yaExiste) {
    return res.render('register', { error: 'Este correo ya está registrado.', success: null });
  }

  const hash = await bcrypt.hash(password, 10);
  const nuevoCliente = new Cliente({ nombre, email, telefono, password: hash });
  await nuevoCliente.save();

  return res.render('register', { success: '✅ Registro exitoso. Ahora puedes iniciar sesión.', error: null });
});

// Reservas
router.get('/booking', isAuthenticated, (req, res) => {
  res.render('booking', { user: req.session.user });
});

router.post('/reservar', isAuthenticated, async (req, res) => {
  const cita = new Cita({ ...req.body, clienteId: req.session.user.id });
  await cita.save();
  res.render('confirmacion', { cita });
});

// Citas del cliente
router.get('/mis-citas', isAuthenticated, async (req, res) => {
  const citas = await Cita.find({ clienteId: req.session.user.id });
  res.render('mis-citas', { citas });
});

// Panel admin
router.get('/admin', isAdmin, async (req, res) => {
  const citas = await Cita.find().populate('clienteId').sort({ fecha: -1 });
  const totalCitas = await Cita.countDocuments();
  const totalClientes = await Cliente.countDocuments({ rol: 'cliente' });
  res.render('admin', { citas, totalCitas, totalClientes });
});

// ✅ Nueva ruta para ver clientes registrados (solo admin)
router.get('/admin/clientes', isAdmin, async (req, res) => {
  const clientes = await Cliente.find({ rol: 'cliente' });
  res.render('clientes', { clientes });
});

module.exports = router;


