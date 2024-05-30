const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Función para obtener todas las reservas y sus respectivos vehículos
router.get("/reservas", async (req, res) => {
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
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    res.status(500).json({ error: "Error al obtener las reservas" });
  }
});

module.exports = router;
