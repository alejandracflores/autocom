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

// Ruta para registrar una nueva reserva
router.post("/registrarReserva", (req, res) => {
  const { idCliente, idEmpleado } = req.body;
  const idFinanciamiento = req.query.idFinanciamiento; // Obtener idFinanciamiento desde la URL

  // Verificar que los datos requeridos están presentes
  if (!idCliente || !idEmpleado || !idFinanciamiento) {
    console.error("Datos faltantes:", {
      idCliente,
      idEmpleado,
      idFinanciamiento,
    });
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  console.log("Datos recibidos:", { idCliente, idEmpleado, idFinanciamiento });

  // Obtener idVehiculo usando idFinanciamiento
  const sqlFinanciamiento =
    "SELECT idVehiculo FROM financiamiento WHERE idFinanciamiento = ?";
  pool.query(
    sqlFinanciamiento,
    [idFinanciamiento],
    (err, resultsFinanciamiento) => {
      if (err) {
        console.error("Error al consultar financiamiento:", err);
        return res.status(500).json({ error: "Error al obtener idVehiculo" });
      }

      if (resultsFinanciamiento.length === 0) {
        return res.status(404).json({ error: "Financiamiento no encontrado" });
      }

      const idVehiculo = resultsFinanciamiento[0].idVehiculo;

      // Luego insertamos la reserva
      const sqlReserva =
        "INSERT INTO reservas (idCliente, idEmpleado, idVehiculo, idFinanciamiento, FechaVenta) VALUES (?, ?, ?, ?, NOW())";
      const valuesReserva = [
        idCliente,
        idEmpleado,
        idVehiculo,
        idFinanciamiento,
      ];

      pool.query(sqlReserva, valuesReserva, (errorReserva, resultsReserva) => {
        if (errorReserva) {
          console.error(
            "Error al insertar la reserva en la base de datos:",
            errorReserva
          );
          return res
            .status(500)
            .json({ error: "Error al registrar la reserva" });
        }
        res.json({
          success: true,
          idReserva: resultsReserva.insertId,
          idCliente: idCliente,
        }); // Asegúrate de devolver el idCliente
      });
    }
  );
});

module.exports = router;
