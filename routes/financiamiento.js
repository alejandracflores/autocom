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

function calcularFinanciamiento(
  precioVehiculo,
  enganche,
  duracionSeguro,
  numeroMensualidades
) {
  const incrementoSeguro =
    precioVehiculo * (0.05 * Math.floor(duracionSeguro / 12)); // 5% por cada 12 meses
  const costoIncrementado = precioVehiculo + incrementoSeguro;
  const montoFinanciar = costoIncrementado - enganche;
  const mensualidad = montoFinanciar / numeroMensualidades;

  return {
    costoTotal: costoIncrementado.toFixed(2),
    mensualidad: mensualidad.toFixed(2),
  };
}

// Endpoint para procesar y guardar financiamiento
router.post("/procesarFinanciamiento", (req, res) => {
  console.log("Datos recibidos:", req.body); // Imprimir los datos recibidos para depuración

  const {
    idVehiculo,
    idCliente,
    valorVehiculo,
    engancheVehiculo,
    Seguro,
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
    !idCliente ||
    !valorVehiculo ||
    !engancheVehiculo ||
    !Seguro ||
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

  const resultado = calcularFinanciamiento(
    parseFloat(valorVehiculo),
    parseFloat(engancheVehiculo),
    parseInt(Seguro),
    parseInt(mensualidades)
  );

  const sql = `INSERT INTO financiamiento (idVehiculo, idCliente, Enganche, Mensualidad, Nombre, ApellidoPaterno, ApellidoMaterno, FechaNacimiento, Telefono, Correo, Genero, EstadoNacimiento, Rcf, Curp, RegimenFiscal, FuenteIngresos, IngresoNeto, Seguro, valorVehiculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(
    sql,
    [
      idVehiculo,
      idCliente,
      engancheVehiculo,
      resultado.mensualidad,
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
      Seguro,
      valorVehiculo,
    ],
    (error, results) => {
      if (error) {
        console.error("Error en la consulta SQL:", error.message);
        return res.status(500).json({ error: error.message });
      }
      res
        .status(200)
        .json({
          message: "Financiamiento procesado y guardado con éxito",
          idFinanciamiento: results.insertId,
        });
    }
  );
});

module.exports = router;
