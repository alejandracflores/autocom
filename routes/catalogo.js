const express = require('express');
const jwt = require('jsonwebtoken');
const catalogo = express.Router();
const db = require('../config/database');

// Ruta para obtener los datos del catálogo
catalogo.get('/', async (req, res, next) => {
    const vehiculos = await db.query("SELECT * FROM inventario");
    return res.status(200).json({ code: 200, message: vehiculos });
});

module.exports = catalogo;