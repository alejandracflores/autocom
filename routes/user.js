const express = require('express');
const jwt = require('jsonwebtoken');
const user = express.Router();
const db = require('../config/database');

//Login del empleado
user.post("/login", async (req, res, next) => {
    const { Username, Contraseña } = req.body;
    const query = `SELECT * FROM empleados WHERE Username = '${Username}' AND Contraseña = '${Contraseña}';`;
    const rows = await db.query(query);
    console.log(rows);

    if (Username && Contraseña) {
        if(rows.length == 1) {
            const token = jwt.sign({
                Admin: rows[0].Admin,
                idEmpleado: rows[0].idEmpleado,
                Foto: rows[0].Foto
            }, "debugkey");
            return res.status(200).json({code: 200, message: token, id: rows[0].idEmpleado, isAdmin: rows[0].Admin, fotoPerfil: rows[0].Foto});
        }
        else {
            return res.status(200).json({code: 401, message: "Usuario y/o contraseña incorrectos"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

// Agregar empleados
user.post("/nuevoempleado", async (req, res, next) => {
    const { idEmpleado, Nombre, Apellido, Username, Contraseña, Foto } = req.body;

    if (idEmpleado && Nombre && Apellido && Username && Contraseña && Foto) {
        let query = "INSERT INTO empleados (idEmpleado, Admin, Nombre, Apellido, Username, Contraseña, Foto) ";
        query += `VALUES ('${idEmpleado}', 0, '${Nombre}', '${Apellido}', '${Username}', '${Contraseña}', '${Foto}');`;
        const rows = await db.query(query);
    
        if(rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Vendedor registrado correctamente" });
        }
        return res.status(500).json({code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

// Actualizar empleados
user.put("/:id([0-9]+)", async (req, res, next) => {
    const { idEmpleado, Nombre, Apellido, Username, Contraseña, Foto } = req.body;

    if(idEmpleado && Nombre && Apellido && Username && Contraseña && Foto) {
        let query = `UPDATE empleados SET idEmpleado='${idEmpleado}', Nombre='${Nombre}', Apellido='${Apellido}', Username='${Username}',`;
        query += `Contraseña='${Contraseña}', Foto='${Foto}' WHERE idEmpleado=${req.params.id}`;
        const rows = await db.query(query);
        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Vendedor actualizado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Eliminar un empleado
user.delete("/:id", async (req, res, next) => {
    const query = `DELETE FROM empleados WHERE idEmpleado=${req.params.id}`;
    const rows = await db.query(query);

    if(rows.affectedRows == 1) {
        return res.status(200).json({ code: 200, message: "Vendedor borrado correctamente" });
    }
    return res.status(400).json({ code: 400, message: "Vendedor no encontrado" });
})

// Obtener todos los empleados
user.get("/byname", async (req, res, next) => {
    const emps = await db.query("SELECT * FROM empleados");
    return res.status(200).json({ code: 200, message: emps });
});

// Obtener empleado por ID
user.get('/:id([0-9]+)', async (req, res, next) => {
    const id = req.params.id;
    const emp = await db.query("SELECT * FROM empleados WHERE idEmpleado = " + id + ";");
    
    if (emp.length > 0) {
        return res.status(200).json({ code: 200, message: emp });
    }
    return res.status(404).json({ code: 404, message: "Vendedor no encontrado" });
});

// Obtener empleado por Nombre
user.get('/:name', async (req, res, next) => {
    const name = req.params.name;
    const emp = await db.query("SELECT * FROM empleados WHERE CONCAT(Nombre, ' ', Apellido) LIKE '%" + name + "%';");

    if (emp.length > 0) {
        return res.status(200).json({ code: 200, message: emp });
    }
    return res.status(404).json({ code: 404, message: "Empleado no encontrado" });
});

// Get de todos los empleados
// user.get("/", async (req, res, next) => {
//     const query = "SELECT * FROM empleados";
//     const rows = await db.query(query);

//     return res.status(200).json({code: 200, message: rows});
// });

module.exports = user;