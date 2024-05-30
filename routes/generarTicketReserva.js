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
router.get("/generarTicketReserva", (req, res) => {
  const idReserva = req.query.idReserva;

  if (!idReserva) {
    return res.status(400).send("ID de reserva no proporcionado");
  }

  pool.query(
    `SELECT r.idReserva, r.FechaVenta, c.Nombre, c.Direccion, c.Telefono, c.Correo, c.Genero, c.Edad, 
            v.Marca, v.Modelo, v.Año, v.Precio, v.Kilometraje, v.TipoVehiculo, v.ImagenVehiculo
     FROM reservas r
     JOIN clientes c ON r.idCliente = c.idCliente
     JOIN inventario v ON r.idVehiculo = v.idVehiculo
     WHERE r.idReserva = ?`,
    [idReserva],
    (error, results) => {
      if (error) {
        return res.status(500).send("Error en la consulta a la base de datos");
      }
      if (results.length === 0) {
        return res.status(404).send("Reserva no encontrada");
      }

      const reserva = results[0];
      const filePath = path.join(
        os.homedir(),
        "Downloads",
        `reserva_${idReserva}.pdf`
      );
      const doc = new PDFDocument({ margin: 50 });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Detalle de la reserva
      doc.fontSize(20).text("Detalle de Reserva", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Nombre: ${reserva.Nombre}`);
      doc.text(`Dirección: ${reserva.Direccion}`);
      doc.text(`Teléfono: ${reserva.Telefono}`);
      doc.text(`Correo: ${reserva.Correo}`);
      doc.text(`Género: ${reserva.Genero}`);
      doc.text(`Edad: ${reserva.Edad}`);
      doc.text(`Fecha de Venta: ${new Date(reserva.FechaVenta).toLocaleDateString()}`);
      doc.moveDown();
      doc.fontSize(16).text("Detalles del Vehículo", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Marca: ${reserva.Marca}`);
      doc.text(`Modelo: ${reserva.Modelo}`);
      doc.text(`Año: ${reserva.Año}`);
      doc.text(`Precio: $${reserva.Precio}`);
      doc.text(`Kilometraje: ${reserva.Kilometraje} km`);
      doc.text(`Tipo: ${reserva.TipoVehiculo}`);

      doc.end(); // Finalizar la escritura al PDF

      stream.on("finish", () => {
        res.download(filePath, `reserva_${idReserva}.pdf`, (err) => {
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
