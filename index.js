const morgan = require('morgan');
const express = require('express');
const app = express();
require('dotenv').config();
const path = require("path");

// Routers
const user = require('./routes/user');

// Middlewares
//const auth = require('./middleware/auth');
//const notFound = require('./middleware/notFound');
const index = require('./middleware/index');
const cors = require('./middleware/cors');

// App
app.use(morgan('dev'));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', index);
app.use('/user', user);
//app.use(auth);
//app.use(notFound);

// Archivos estáticos
app.use(express.static('autocom'));

// Rutas de los archivos Admin-Vendedor
const path_av = '/autocom/Admin-Vendedor/';
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'login.html'));
});
app.get('/agregarVendedor', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'agregarVendedor.html'));
});
app.get('/editarVendedor', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'editarvendedor.html'));
});
app.get('/financiamiento1', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte1.html'));
});
app.get('/financiamiento2', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte2.html'));
});
app.get('/financiamiento3', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte3.html'));
});
app.get('/reserva1', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'reserva1.html'));
});
app.get('/tablaVendedores', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'tablavendedores.html'));
});
app.get('/userAccount', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'useraccount.html'));
});

// Rutas de los archivos Cliente
const path_c = '/autocom/Cliente/';
app.get('/financiamiento1', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte1.html'));
});
app.get('/financiamiento2', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte2.html'));
});
app.get('/financiamiento3', (req, res) => {
  res.sendFile(path.join(__dirname, path_av + 'financiamientoparte3.html'));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor en funcionamiento...');
  });