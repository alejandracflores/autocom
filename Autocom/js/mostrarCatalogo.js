const pool = require('../../config/database');

// Función para obtener el inventario
async function obtenerCatalogo() {
    try {
        const query = 'SELECT * FROM inventario';
        const rows = await pool.query(query);
        console.log(rows);
        console.log(typeof rows);
        for (let i = 1; i < rows.length; i++) {
            console.log(rows[i]);
        }
        return rows;
    } catch (error) {
        console.error('Error al obtener el catálogo:', error);
        throw error;
    }
}

module.exports = { obtenerCatalogo };