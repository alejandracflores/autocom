const morgan = require("morgan");
const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Routers
const user = require("./routes/user");
const catalogoRouter = require("./routes/catalogo");
const catalogoCliente = require("./routes/catalogoC");
const financiamientoRoutes = require("./routes/financiamiento");
const generarFinanciamiento = require("./routes/generarFinanciamiento");

// Middlewares
// const auth = require('./middleware/auth');
// const notFound = require('./middleware/notFound');
const index = require("./middleware/index");
const cors = require("./middleware/cors");

// Configuración del motor de vistas
app.set("views", [
  path.join(__dirname, "Autocom/Admin-Vendedor"),
  path.join(__dirname, "Autocom/Cliente"),
]);
app.set("view engine", "ejs");

// Middlewares
app.use(morgan("dev"));
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/home"); // Añade esta línea para redirigir de "/" a "/home"
});
app.use("/user", user);
app.use("/catalogo", catalogoRouter);
app.use("/catalogoCliente", catalogoCliente);
app.use("/", financiamientoRoutes);
app.use("/", generarFinanciamiento); // Aquí se define la ruta para generarFinanciamiento
// app.use(auth);
// app.use(notFound);

// Archivos estáticos
app.use(express.static("autocom"));
app.use(express.static(path.join(__dirname, "Autocom")));

// Ruta Index
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/autocom/autocom.html"));
});

// Rutas de los archivos Admin-Vendedor
const path_av = "/autocom/Admin-Vendedor/";
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "login.html"));
});
app.get("/agregarvendedor", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "agregarVendedor.html"));
});
app.get("/editarvendedor", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "editarVendedor.html"));
});
app.get("/financiamiento2", (req, res) => {
  const idFinanciamiento = req.query.idFinanciamiento;
  res.render("financiamientoParte2", { idFinanciamiento: idFinanciamiento });
});
app.get("/financiamiento3", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "financiamientoParte3.html"));
});
app.get("/reserva1", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "reservaP1.html"));
});
app.get("/tablavendedores", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "tablaVendedores.html"));
});
app.get("/useraccount", (req, res) => {
  res.sendFile(path.join(__dirname, path_av + "userAccount.html"));
});

// Rutas de los archivos Cliente
const path_c = "/autocom/Cliente/";
app.get("/financiamiento1", (req, res) => {
  const idVehiculo = req.query.idVehiculo;
  pool.query(
    "SELECT Precio FROM inventario WHERE idVehiculo = ?",
    [idVehiculo],
    (error, results) => {
      if (error || results.length === 0) {
        return res.status(404).json({ error: "Vehículo no encontrado" });
      }
      res.render("financiamientoParte1", { precio: results[0].Precio });
    }
  );
});
app.get("/financiamiento2", (req, res) => {
  const idFinanciamiento = req.query.idFinanciamiento;
  res.render("financiamientoParte2", { idFinanciamiento: idFinanciamiento });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor en funcionamiento...");
});
