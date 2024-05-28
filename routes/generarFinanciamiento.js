const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const PDFDocument = require("pdfkit");

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

// Ruta para generar el financiamiento y crear el PDF
router.get("/verFinanciamiento", (req, res) => {
  const idFinanciamiento = req.query.idFinanciamiento;

  pool.query(
    "SELECT * FROM financiamiento WHERE idFinanciamiento = ?",
    [idFinanciamiento],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(404).json({ error: "Financiamiento no encontrado" });
      }

      const financiamiento = results[0];

      // Crear el documento PDF
      const doc = new PDFDocument();
      res.setHeader("Content-type", "application/pdf");

      // Generar el PDF
      doc.fontSize(25).text(`Financiamiento ID: ${idFinanciamiento}`, 100, 100);
      doc.fontSize(18).text(`Nombre: ${financiamiento.Nombre}`, 100, 150);
      doc.text(`Apellido Paterno: ${financiamiento.ApellidoPaterno}`, 100, 200);
      doc.text(`Apellido Materno: ${financiamiento.ApellidoMaterno}`, 100, 250);
      doc.text(`Monto de Enganche: ${financiamiento.Enganche}`, 100, 300);
      doc.text(`Mensualidad: ${financiamiento.Mensualidad}`, 100, 350);
      // Agregar más campos según sea necesario

      doc.pipe(res);
      doc.end();
    }
  );
});

module.exports = router;
