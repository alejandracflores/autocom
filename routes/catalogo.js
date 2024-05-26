const express = require('express');
const router = express.Router();
const mostrarCatalogo = require('../Autocom/js/mostrarCatalogo');

// Ruta para obtener los datos del catálogo
router.get('/', async (req, res) => {
    try {
        const catalogo = await mostrarCatalogo.obtenerCatalogo();
        console.log('Datos del catálogo:', catalogo); 
        res.render('catalogo', { catalogo: catalogo });
    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        res.status(500).send('Error al obtener el catálogo');
    }
});
// Ruta para obtener los detalles del vehículo
router.get('/detalles/:idVehiculo', async (req, res) => {
    try {
        const idVehiculo = parseInt(req.params.idVehiculo);
        const catalogo = await mostrarCatalogo.obtenerCatalogo();
        const vehiculo = catalogo.find(v => v.idVehiculo === idVehiculo);

        if (!vehiculo) {
            return res.status(404).send('Vehículo no encontrado');
        }
        res.render('detallesCarro', { vehiculo: vehiculo, layout: false });
    } catch (error) {
        console.error('Error al obtener los detalles del vehículo:', error);
        res.status(500).send('Error al obtener los detalles del vehículo');
    }
});

router.get('/buscar', async (req, res) => {
    try {
        const { query } = req.query; // Obtener el parámetro de búsqueda de la query string
        const catalogo = await mostrarCatalogo.obtenerCatalogo();

        // Filtrar el catálogo basado en la búsqueda
        const resultados = catalogo.filter(vehiculo => 
            vehiculo.Marca.toLowerCase().includes(query.toLowerCase()) ||
            vehiculo.Modelo.toLowerCase().includes(query.toLowerCase())
        );

        res.render('encontrado', { catalogo: resultados });
    } catch (error) {
        console.error('Error al buscar vehículos:', error);
        res.status(500).send('Error al buscar vehículos');
    }
});

module.exports = router;
