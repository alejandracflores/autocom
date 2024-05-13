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
            }, "debugkey");
            return res.status(200).json({code: 200, message: token });
        }
        else {
            return res.status(200).json({code: 401, message: "Usuario y/o contraseña incorrectos"});
        }
    }
    return res.status(500).json({code: 500, message: "Campos incompletos"});
});

// Get de todos los empleados
user.get("/", async (req, res, next) => {
    const query = "SELECT * FROM empleados";
    const rows = await db.query(query);

    return res.status(200).json({code: 200, message: rows});
});

module.exports = user;