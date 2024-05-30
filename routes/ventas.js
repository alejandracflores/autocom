const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

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

router.get('/ventas', (req, res) => {
  pool.query(`
    SELECT r.idReserva, r.FechaVenta, c.Nombre, c.Direccion, c.Telefono, c.Correo, c.Genero, c.Edad, 
           v.Marca, v.Modelo, v.Año, v.Precio, v.Kilometraje, v.TipoVehiculo, v.ImagenVehiculo
    FROM reservas r
    JOIN clientes c ON r.idCliente = c.idCliente
    JOIN inventario v ON r.idVehiculo = v.idVehiculo
  `, (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }
    res.render('ventas', { reservas: results });
  });
});

module.exports = router;
