const express = require('express');
const router = express.Router();
const { obtenerC } = require('../Autocom/js/catalogoCliente');

// Ruta para mostrar el catálogo de vehículos
router.get('/', async (req, res) => {
    try {
        const catalogo = await obtenerC();
        res.render('catalogoCliente', { catalogo });
    } catch (error) {
        console.error('Error al renderizar el catálogo:', error);
        res.status(500).send('Error al obtener el catálogo de vehículos.');
    }
});

// Ruta para buscar vehículos
router.get('/buscar', async (req, res) => {
    const { query } = req.query;
    try {
        const catalogo = await obtenerC();
        const resultados = catalogo.filter(vehiculo =>
            vehiculo.Marca.toLowerCase().includes(query.toLowerCase()) ||
            vehiculo.Modelo.toLowerCase().includes(query.toLowerCase())
        );

        res.render('encontradoCliente', { catalogo: resultados });
    } catch (error) {
        console.error('Error al buscar en el catálogo:', error);
        res.status(500).send('Error al buscar vehículos.');
    }
});

// Ruta para obtener detalles de un vehículo
router.get('/detalles/:idVehiculo', async (req, res) => {
    const { idVehiculo } = req.params;
    try {
        const catalogo = await obtenerC();
        const vehiculo = catalogo.find(v => v.idVehiculo == idVehiculo);
        if (vehiculo) {
            res.render('detallesCliente', { vehiculo });
        } else {
            res.status(404).send('Vehículo no encontrado.');
        }
    } catch (error) {
        console.error('Error al obtener detalles del vehículo:', error);
        res.status(500).send('Error al obtener detalles del vehículo.');
    }
});

module.exports = router;
