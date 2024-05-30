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
      // Logo
      doc.image("./Autocom/img/logoAutocom.png", 50, 50, { width: 150 });

      // Título y fecha
      doc.fontSize(20).text("Detalle de Reserva", 50, 160);
      const fechaActual = new Date().toLocaleDateString();
      doc.fontSize(12).text(`Fecha: ${fechaActual}`, 450, 50);

      // Información de la sucursal
      doc.fontSize(16).text("Sucursal:", 50, 200);
      doc.fontSize(12).text("Bernardo Quintana Queretaro, Queretaro", 50, 220);

      // Datos del cliente
      doc.fontSize(16).text("Datos del Cliente:", 50, 260);
      doc.fontSize(12);

      // Tabla de datos del cliente
      const clientData = [
        ["Nombre", reserva.Nombre],
        ["Dirección", reserva.Direccion],
        ["Teléfono", reserva.Telefono],
        ["Correo", reserva.Correo],
        ["Género", reserva.Genero],
        ["Edad", reserva.Edad],
      ];

      // Dibujar tabla de datos del cliente
      let startY = 280;
      clientData.forEach(([key, value], index) => {
        if (index % 2 === 0) {
          doc.rect(50, startY - 5, 500, 20).fill("#f0f0f0").stroke();
        }
        doc.fillColor("black").text(key, 50, startY);
        doc.text(value, 200, startY);
        startY += 20;
      });

      // Datos del vehículo
      doc.fontSize(16).text("Detalles del Vehículo:", 50, startY + 20);
      doc.fontSize(12);

      // Tabla de datos del vehículo
      const vehicleData = [
        ["Marca", reserva.Marca],
        ["Modelo", reserva.Modelo],
        ["Año", reserva.Año],
        ["Precio", `$${reserva.Precio}`],
        ["Kilometraje", `${reserva.Kilometraje} km`],
        ["Tipo", reserva.TipoVehiculo],
      ];

      // Dibujar tabla de datos del vehículo
      startY += 40;
      vehicleData.forEach(([key, value], index) => {
        if (index % 2 === 0) {
          doc.rect(50, startY - 5, 500, 20).fill("#f0f0f0").stroke();
        }
        doc.fillColor("black").text(key, 50, startY);
        doc.text(value, 200, startY);
        startY += 20;
      });

      // Código QR simulado y hash de certificación
      doc.rect(50, startY + 50, 100, 100).stroke(); // Dibujar un cuadro para simular el QR
      doc.text(
        "ABC1234567890DEF1234567890GHI1234567890JKL1234567890MNO1234567890PQR1234567890STU1234567890VWX1234567890YZ!@#4567890$%^1234567890&*()_+1234567890-=[]1234567890{}|;':1234567890,.<>?1234567890/~`1234567890ABC1234567890DEF1234567890GHI1234567890JKL1234567890MNO1234567890PQR1234567890STU1234567890VWX1234567890YZ!@#4567890$%^1234567890&*()_+1234567890-=[]1234567890{}|;':1234567890,.<>?1234567890/~`1234567890",
        160,
        startY + 50, 100, 100
      );

      // Finalizar el documento
      doc.end();

      stream.on("finish", () => {
        res.download(
          filePath,
          `reserva_${idReserva}.pdf`,
          (err) => {
            if (err) {
              console.error("Error al descargar el PDF:", err);
              return res.status(500).send("Error al descargar el PDF");
            }
            fs.unlinkSync(filePath); // Eliminar el archivo después de la descarga
          }
        );
      });
    }
  );
});

module.exports = router;
