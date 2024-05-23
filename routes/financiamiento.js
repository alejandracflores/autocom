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
    queueLimit: 0
});

function calcularFinanciamiento(precioVehiculo, enganche, duracionGarantia, numeroMensualidades) {
    const incrementoGarantia = precioVehiculo * (0.05 * Math.floor(duracionGarantia / 12)); // 5% por cada 12 meses
    const costoIncrementado = precioVehiculo + incrementoGarantia;
    const montoFinanciar = costoIncrementado - enganche;
    const mensualidad = montoFinanciar / numeroMensualidades;

    return {
        costoTotal: costoIncrementado.toFixed(2),
        mensualidad: mensualidad.toFixed(2)
    };
}

// Endpoint para procesar y guardar financiamiento
router.post('/procesarFinanciamiento', (req, res) => {
    console.log("Datos recibidos:", req.body);  // Imprimir los datos recibidos para depuración

    const { idVehiculo, idCliente, valorVehiculo, engancheVehiculo, duracionGarantia, mensualidades, garantia } = req.body;
    const resultado = calcularFinanciamiento(parseFloat(valorVehiculo), parseFloat(engancheVehiculo), parseInt(duracionGarantia), parseInt(mensualidades));

    const sql = `INSERT INTO financiamiento (idVehiculo, idCliente, Enganche, Mensualidad, Seguro) VALUES (?, ?, ?, ?, ?)`;

    pool.query(sql, [idVehiculo, idCliente, engancheVehiculo, resultado.mensualidad, garantia], (error, results) => {
        if (error) {
            console.error("Error en la consulta SQL:", error.message);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ message: 'Financiamiento procesado y guardado con éxito', idFinanciamiento: results.insertId });
    });
});

module.exports = router;
