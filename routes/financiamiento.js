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

// Endpoint para procesar y guardar financiamiento
router.post("/procesarFinanciamiento", (req, res) => {
  const {
    idVehiculo,
    valorVehiculo,
    engancheVehiculo,
    seguro,
    mensualidades,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    telefono,
    correo,
    genero,
    estadoNacimiento,
    rfc,
    curp,
    regimenFiscal,
    fuenteIngresos,
    ingresoNeto,
  } = req.body;

  if (
    !idVehiculo ||
    !valorVehiculo ||
    !engancheVehiculo ||
    !mensualidades ||
    !nombre ||
    !apellidoPaterno ||
    !apellidoMaterno ||
    !fechaNacimiento ||
    !telefono ||
    !correo ||
    !genero ||
    !estadoNacimiento ||
    !rfc ||
    !curp ||
    !regimenFiscal ||
    !fuenteIngresos ||
    !ingresoNeto
  ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `INSERT INTO financiamiento (
        idVehiculo, Enganche, Mensualidad, Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento,
        Telefono, Correo, Genero, EstadoNacimiento, Rcf, Curp, RegimenFiscal, FuenteIngresos, IngresoNeto, Seguro, valorVehiculo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    idVehiculo,
    engancheVehiculo,
    mensualidades,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    telefono,
    correo,
    genero,
    estadoNacimiento,
    rfc,
    curp,
    regimenFiscal,
    fuenteIngresos,
    ingresoNeto,
    seguro,
    valorVehiculo,
  ];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error("Error en la consulta SQL:", error.message);
      return res.status(500).json({ error: error.message });
    }

    // Verificar si el ID de financiamiento se ha insertado correctamente
    if (results && results.insertId) {
      const idFinanciamiento = results.insertId;
      return res.status(200).json({ idFinanciamiento });
    } else {
      console.error("No se pudo obtener el ID del financiamiento");
      return res
        .status(500)
        .json({ error: "No se pudo obtener el ID del financiamiento" });
    }
  });
});

module.exports = router;
