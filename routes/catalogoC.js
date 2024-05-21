const express = require('express');
const router = express.Router();
const catalogoCliente = require('../Autocom/js/catalogoCliente');

// Ruta para obtener los datos del catálogo y renderizar la vista catalogoCliente
router.get('/', async (req, res) => {
    try {
        const catalogo = await catalogoCliente.obtenerC();
        res.render('catalogoCliente', { catalogo: catalogo });
    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        res.status(500).send('Error al obtener el catálogo');
    }
});

module.exports = router;

