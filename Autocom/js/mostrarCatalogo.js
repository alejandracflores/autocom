const pool = require('../../config/database');

// Función para obtener el inventario
async function obtenerCatalogo() {
    const query = 'SELECT * FROM inventario';
    const [rows] = await pool.query(query);
    console.log('Datos obtenidos de la base de datos:', rows);
    return rows;
}

module.exports = { obtenerCatalogo };