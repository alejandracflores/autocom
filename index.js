const morgan = require('morgan');
const express = require('express');
const app = express();
require('dotenv').config();
const path = require("path");

// Routers
const user = require('./routes/user');
const catalogoRouter = require('./routes/catalogo'); 

// Middlewares
// const auth = require('./middleware/auth');
// const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors = require('./middleware/cors');

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'Autocom/Admin-Vendedor'));
app.set('view engine', 'ejs');

// Middlewares
app.use(morgan('dev'));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', index);
app.use('/user', user);
app.use('/catalogo', catalogoRouter);
// app.use(auth);
// app.use(notFound);

// Archivos estáticos
app.use(express.static('autocom'));

// Ruta Index
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/autocom/autocom.html'));
});

// Rutas de los archivos Admin-Vendedor
const path_av = '/autocom/Admin-Vendedor/';
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'login.html'));
});
app.get('/agregarvendedor', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'agregarVendedor.html'));
});
app.get('/editarvendedor', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'editarVendedor.html'));
});
app.get('/financiamiento1', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoParte1.html'));
});
app.get('/financiamiento2', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoParte2.html'));
});
app.get('/financiamiento3', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoParte3.html'));
});
app.get('/reserva1', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'reservaP1.html'));
});
app.get('/tablavendedores', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'tablaVendedores.html'));
});
app.get('/useraccount', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'userAccount.html'));
});

// Rutas de los archivos Cliente
const path_c = '/autocom/Cliente/';
app.get('/financiamiento1', (req, res) => {
  res.sendFile(path.join(__dirname, path_c + 'financiamientoParte1.html'));
});
app.get('/financiamiento2', (req, res) => {
  res.sendFile(path.join(__dirname, path_c + 'financiamientoParte2.html'));
});
app.get('/financiamiento3', (req, res) => {
  res.sendFile(path.join(__dirname, path_c + 'financiamientoParte3.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor en funcionamiento...');
});
