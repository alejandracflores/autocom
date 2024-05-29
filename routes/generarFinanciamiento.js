const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const os = require("os");
const path = require("path");

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

router.get("/verFinanciamiento", (req, res) => {
  const idFinanciamiento = req.query.idFinanciamiento;

  if (!idFinanciamiento) {
    return res.status(400).send("ID de financiamiento no proporcionado");
  }

  pool.query(
    "SELECT * FROM financiamiento WHERE idFinanciamiento = ?",
    [idFinanciamiento],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error en la consulta a la base de datos");
      }
      if (results.length === 0) {
        return res.status(404).send("Financiamiento no encontrado");
      }

      const financiamiento = results[0];
      const filePath = path.join(os.homedir(), "Downloads", `financiamiento_${idFinanciamiento}.pdf`);
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Detalle del financiamiento
      doc.fontSize(20).text("Detalle de Financiamiento", { align: "center" });
      doc.moveDown();
      doc.fontSize(12)
        .text(`Nombre: ${financiamiento.Nombre} ${financiamiento.ApellidoPaterno} ${financiamiento.ApellidoMaterno}`);
      doc.text(`Teléfono: ${financiamiento.Telefono}`);
      doc.text(`Correo Electrónico: ${financiamiento.Correo}`);
      doc.text(`Enganche: ${financiamiento.Enganche}`);
      doc.text(`Mensualidad: ${financiamiento.Mensualidad}`);
      doc.text(`Género: ${financiamiento.Genero}`);
      doc.text(`Estado de Nacimiento: ${financiamiento.EstadoNacimiento}`);
      doc.text(`Régimen Fiscal: ${financiamiento.RegimenFiscal}`);
      doc.text(`Fuente de Ingresos: ${financiamiento.FuenteIngresos}`);
      doc.text(`CURP: ${financiamiento.Curp}`);
      doc.text(`RFC: ${financiamiento.Rcf}`);
      doc.text(`Ingreso Neto: ${financiamiento.IngresoNeto}`);
      doc.text(`Seguro: ${financiamiento.Seguro}`);
      doc.text(`Valor del Vehículo: ${financiamiento.valorVehiculo}`);

      doc.end();  // Finalizar la escritura al PDF

      stream.on("finish", () => {
        res.download(filePath, `financiamiento_${idFinanciamiento}.pdf`, (err) => {
          if (err) {
            console.error("Error al descargar el PDF:", err);
            return res.status(500).send("Error al descargar el PDF");
          }
          fs.unlinkSync(filePath);  // Eliminar el archivo después de la descarga
        });
      });
    }
  );
});

module.exports = router;
