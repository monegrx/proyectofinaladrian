require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Verifica que MONGO_URI esté definida
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI no está definido en las variables de entorno");
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('🟢 Conectado a MongoDB');

  // Crear admin y cliente si no existen
  const crearAdminYCliente = require('./crearAdmin');
  await crearAdminYCliente();

  // Middlewares
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Sesiones
  app.use(session({
    secret: process.env.SESSION_SECRET || 'bellaimagenkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      maxAge: 1000 * 60 * 30 // 30 minutos
    }
  }));

  // Rutas
  app.use('/', require('./routes/main'));

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});

