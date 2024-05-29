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

// Ruta para generar el ticket de reserva
router.get("/generarTicket", (req, res) => {
  const idCliente = req.query.idCliente;

  if (!idCliente) {
    return res.status(400).send("ID de cliente no proporcionado");
  }

  pool.query(
    "SELECT * FROM clientes WHERE idCliente = ?",
    [idCliente],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error en la consulta a la base de datos");
      }
      if (results.length === 0) {
        return res.status(404).send("Cliente no encontrado");
      }

      const cliente = results[0];
      const filePath = path.join(
        os.homedir(),
        "Downloads",
        `reserva_${idCliente}.pdf`
      );
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Detalle de la reserva
      doc.fontSize(20).text("Detalle de Reserva", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Nombre: ${cliente.Nombre}`);
      doc.text(`Dirección: ${cliente.Direccion}`);
      doc.text(`Teléfono: ${cliente.Telefono}`);
      doc.text(`Correo: ${cliente.Correo}`);
      doc.text(`Género: ${cliente.Genero}`);
      doc.text(`Edad: ${cliente.Edad}`);

      doc.end(); // Finalizar la escritura al PDF

      stream.on("finish", () => {
        res.download(filePath, `reserva_${idCliente}.pdf`, (err) => {
          if (err) {
            console.error("Error al descargar el PDF:", err);
            return res.status(500).send("Error al descargar el PDF");
          }
          fs.unlinkSync(filePath); // Eliminar el archivo después de la descarga
        });
      });
    }
  );
});

module.exports = router;
