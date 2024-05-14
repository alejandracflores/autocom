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
                idEmpleado: rows[0].idEmpleado,
                Admin: rows[0].Admin,
                Nombre: rows[0].Nombre,
                Apellido: rows[0].Apellido,
                Username: rows[0].Username,
                Contraseña: rows[0].Contraseña,
                Foto: rows[0].Foto
            }, "debugkey");
            return res.status(200).json({code: 200, message: token, isAdmin: rows[0].Admin });
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
            return res.status(201).json({ code: 201, message: "Usuario registrado correctamente" });
        }
        return res.status(500).json({code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

// Actualizar empleados
user.put("/:id([0-9]+)", async (req, res, next) => {
    const { Nombre, Apellido, Username, Contraseña, Foto } = req.body;

    if(Nombre && Apellido && Username && Contraseña && Foto) {
        let query = `UPDATE empleados SET Nombre='${Nombre}', Apellido='${Apellido}', Username='${Username}',`;
        query += `Contraseña='${Contraseña}', Foto='${Foto}' WHERE idEmpleado=${req.params.id}`;
        const rows = await db.query(query);
        if(rows.affectedRows == 1) {
            return res.status(200).json({ code: 200, message: "Empleado actualizado correctamente" });
        }
        return res.status(500).json({ code: 500, message: "Ocurrió un error"});
    }
    return res.status(500).json({ code: 500, message: "Campos incompletos" });
});

// Get de todos los empleados
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM empleados";
    const rows = await db.query(query);

    return res.status(200).json({code: 200, message: rows});
});

module.exports = user;