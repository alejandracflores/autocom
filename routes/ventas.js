const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Ruta para mostrar las tarjetas de las reservas en la vista de ventas
router.get("/ventas", async (req, res) => {
  try {
    const query = `
            SELECT 
                r.idReserva,
                v.idVehiculo,
                v.Marca,
                v.Modelo,
                v.Año,
                v.Precio,
                v.Kilometraje,
                v.TipoVehiculo,
                v.ImagenVehiculo,
                r.FechaVenta
            FROM 
                reservas r
            JOIN 
                inventario v ON r.idVehiculo = v.idVehiculo
        `;
    const [rows] = await pool.query(query);
    const reservas = Array.isArray(rows) ? rows : [rows];
    console.log("Datos de las reservas:", reservas); // Log para verificar los datos
    res.render("ventas", { reservas });
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

module.exports = router;
