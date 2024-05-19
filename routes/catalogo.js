const express = require('express');
const router = express.Router();
const mostrarCatalogo = require('../Autocom/js/mostrarCatalogo');

// Ruta para obtener los datos del catálogo
router.get('/', async (req, res) => {
    try {
        const catalogo = await mostrarCatalogo.obtenerCatalogo();
        console.log('Datos del catálogo:', catalogo); 
        res.render('catalogo', { catalogo: Array.isArray(catalogo) ? catalogo : [] });
    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        res.status(500).send('Error al obtener el catálogo');
    }
});

module.exports = router;