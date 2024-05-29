// routes/reserva.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta para confirmar la reserva
router.post("/confirmarReserva", (req, res) => {
  const { nombre, telefono, email, direccion, genero, edad } = req.body;

  const sql = "INSERT INTO clientes (Nombre, Direccion, Telefono, Correo, Genero, Edad) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [nombre, direccion, telefono, email, genero, edad];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error("Error al insertar en la base de datos:", err);
      return res.status(500).send("Error al confirmar la reserva");
    }
    res.send("Reserva confirmada");
  });
});

module.exports = router;
