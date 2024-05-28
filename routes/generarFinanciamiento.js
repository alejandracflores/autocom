const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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

// Ruta para generar y ver el financiamiento
router.get('/verFinanciamiento', (req, res) => {
  const idFinanciamiento = req.query.idFinanciamiento;

  if (!idFinanciamiento) {
    return res.status(400).send('ID de financiamiento no proporcionado');
  }

  pool.query('SELECT * FROM financiamiento WHERE idFinanciamiento = ?', [idFinanciamiento], (error, results) => {
    if (error) {
      return res.status(500).send('Error en la consulta a la base de datos');
    }

    if (results.length === 0) {
      return res.status(404).send('Financiamiento no encontrado');
    }

    const financiamiento = results[0];

    // Calcular el precio final
    const precioVehiculo = parseFloat(financiamiento.valorVehiculo);
    const duracionSeguro = parseInt(financiamiento.Seguro, 10);
    const seguroCosto = (0.05 * precioVehiculo) * (duracionSeguro / 12);
    const precioFinal = precioVehiculo + seguroCosto;

    // Calcular la mensualidad
    const enganche = parseFloat(financiamiento.Enganche);
    const montoFinanciar = precioFinal - enganche;
    const mensualidades = parseInt(financiamiento.Mensualidad, 10);
    const mensualidad = montoFinanciar / mensualidades;

    // Crear el documento PDF
    const doc = new PDFDocument();
    const filePath = `./pdfs/financiamiento_${idFinanciamiento}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(25).text('Plan de Financiamiento', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`ID Financiamiento: ${financiamiento.idFinanciamiento}`);
    doc.text(`ID Vehículo: ${financiamiento.idVehiculo}`);
    doc.text(`Enganche: ${financiamiento.Enganche}`);
    doc.text(`Mensualidad: ${financiamiento.Mensualidad}`);
    doc.text(`Nombre: ${financiamiento.Nombre}`);
    doc.text(`Apellido Paterno: ${financiamiento.ApellidoPaterno}`);
    doc.text(`Apellido Materno: ${financiamiento.ApellidoMaterno}`);
    doc.text(`Fecha de Nacimiento: ${financiamiento.FechaNacimiento}`);
    doc.text(`Teléfono: ${financiamiento.Telefono}`);
    doc.text(`Correo: ${financiamiento.Correo}`);
    doc.text(`Género: ${financiamiento.Genero}`);
    doc.text(`Estado de Nacimiento: ${financiamiento.EstadoNacimiento}`);
    doc.text(`RFC: ${financiamiento.Rcf}`);
    doc.text(`CURP: ${financiamiento.Curp}`);
    doc.text(`Régimen Fiscal: ${financiamiento.RegimenFiscal}`);
    doc.text(`Fuente de Ingresos: ${financiamiento.FuenteIngresos}`);
    doc.text(`Ingreso Neto: ${financiamiento.IngresoNeto}`);
    doc.text(`Seguro: ${financiamiento.Seguro}`);
    doc.text(`Valor del Vehículo: ${financiamiento.valorVehiculo}`);
    doc.moveDown();
    doc.fontSize(18).text(`Precio Final: ${precioFinal.toFixed(2)}`);
    doc.text(`Monto a Financiar: ${montoFinanciar.toFixed(2)}`);
    doc.text(`Mensualidad: ${mensualidad.toFixed(2)}`);

    doc.end();

    doc.on('finish', () => {
      res.download(filePath, `financiamiento_${idFinanciamiento}.pdf`, (err) => {
        if (err) {
          console.error('Error al descargar el PDF:', err);
          res.status(500).send('Error al descargar el PDF');
        } else {
          fs.unlinkSync(filePath); // Eliminar el archivo después de la descarga
          res.status(200).send('<script>alert("Archivo descargado exitosamente"); window.close();</script>');
        }
      });
    });
  });
});

module.exports = router;
