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

      // Obtener datos del vehículo usando idVehiculo
      pool.query(
        "SELECT * FROM inventario WHERE idVehiculo = ?",
        [financiamiento.idVehiculo],
        (errorVehiculo, resultsVehiculo) => {
          if (errorVehiculo) {
            return res
              .status(500)
              .send("Error en la consulta a la base de datos del vehículo");
          }
          if (resultsVehiculo.length === 0) {
            return res.status(404).send("Vehículo no encontrado");
          }

          const vehiculo = resultsVehiculo[0];
          const filePath = path.join(
            os.homedir(),
            "Downloads",
            `financiamiento_${idFinanciamiento}.pdf`
          );
          const doc = new PDFDocument({ margin: 50 });

          const stream = fs.createWriteStream(filePath);
          doc.pipe(stream);

          // Detalle del financiamiento
          // Logo
          doc.image("./Autocom/img/logoAutocom.png", 50, 50, { width: 150 });

          // Título y folio
          doc.fontSize(20).text("Financiamiento Automotriz", 50, 160);
          doc
            .fontSize(12)
            .text(`Folio: ${financiamiento.idFinanciamiento}`, 50, 190);

          // Fecha actual en la esquina superior derecha
          const fechaActual = new Date().toLocaleDateString();
          doc.fontSize(12).text(`Fecha: ${fechaActual}`, 450, 50);

          // Datos del cliente
          doc.fontSize(16).text("Datos del cliente", 50, 230);
          doc.fontSize(12);

          // Tabla de datos del cliente
          const clientData = [
            [
              "Nombre",
              `${financiamiento.Nombre} ${financiamiento.ApellidoPaterno} ${financiamiento.ApellidoMaterno}`,
            ],
            ["Teléfono", financiamiento.Telefono],
            ["Correo electrónico", financiamiento.Correo],
            ["Estado de Nacimiento", financiamiento.EstadoNacimiento],
            ["Régimen Fiscal", financiamiento.RegimenFiscal],
            ["Fuente de Ingresos", financiamiento.FuenteIngresos],
            ["Ingreso Neto", financiamiento.IngresoNeto],
          ];

          // Dibujar tabla de datos del cliente
          let startY = 260;
          clientData.forEach(([key, value], index) => {
            if (index % 2 === 0) {
              doc
                .rect(50, startY - 5, 500, 20)
                .fill("#f0f0f0")
                .stroke();
            }
            doc.fillColor("black").text(key, 50, startY);
            doc.text(value, 200, startY);
            startY += 20;
          });

          // Datos del vehículo
          doc.fontSize(16).text("Datos del vehículo:", 50, startY + 20);
          doc.fontSize(12);

          // Tabla de datos del vehículo
          const vehicleData = [
            ["Modelo", vehiculo.Modelo],
            ["Color", vehiculo.Color],
            ["Marca", vehiculo.Marca],
            ["Precio del vehículo", vehiculo.Precio],
            ["Kilometraje", vehiculo.Kilometraje],
            ["Número de serie", vehiculo.NumeroSerie],
            ["Año", vehiculo.Año],
          ];

          // Dibujar tabla de datos del vehículo
          startY += 40;
          vehicleData.forEach(([key, value], index) => {
            if (index % 2 === 0) {
              doc
                .rect(50, startY - 5, 500, 20)
                .fill("#f0f0f0")
                .stroke();
            }
            doc.fillColor("black").text(key, 50, startY);
            doc.text(value, 200, startY);
            startY += 20;
          });

          // Plan financiero
          doc.fontSize(16).text("Plan Financiero:", 50, startY + 20);
          doc.fontSize(12);

          const precioTotal = (
            parseFloat(financiamiento.valorVehiculo) +
            (parseFloat(financiamiento.Seguro) / 12) *
              0.05 *
              parseFloat(financiamiento.valorVehiculo)
          ).toFixed(2);

          const aFinanciar = (
            precioTotal - parseFloat(financiamiento.Enganche)
          ).toFixed(2);
          const mensualidad = (
            aFinanciar / parseFloat(financiamiento.Mensualidad)
          ).toFixed(2);

          // Tabla de plan financiero
          const financialPlanData = [
            ["Enganche", financiamiento.Enganche],
            ["Mensualidades", financiamiento.Mensualidad],
            ["Seguro", financiamiento.Seguro],
            ["Precio Total", precioTotal],
            ["Precio a financiar", aFinanciar],
            ["Mensualidad", mensualidad],
          ];

          // Dibujar tabla de plan financiero
          startY += 40;
          financialPlanData.forEach(([key, value], index) => {
            if (index % 2 === 0) {
              doc
                .rect(50, startY - 5, 500, 20)
                .fill("#f0f0f0")
                .stroke();
            }
            doc.fillColor("black").text(key, 50, startY);
            doc.text(value, 200, startY);
            startY += 20;
          });

          // Finalizar el documento
          doc.end();

          stream.on("finish", () => {
            res.download(
              filePath,
              `financiamiento_${idFinanciamiento}.pdf`,
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
    }
  );
});

module.exports = router;
