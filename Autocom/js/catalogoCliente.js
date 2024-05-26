const pool = require('../../config/database');

// Función para obtener el inventario
async function obtenerC() {
    try {
        const query = 'SELECT * FROM inventario';
        const rows = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        throw error;
    }
}

module.exports = { obtenerC };  