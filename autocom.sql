-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-05-2024 a las 07:48:59
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `autocom`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `idCliente` int(11) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `ApellidoPaterno` varchar(255) NOT NULL,
  `ApellidoMaterno` varchar(255) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Telefono` int(11) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Genero` varchar(255) NOT NULL,
  `Edad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE `empleados` (
  `idEmpleado` int(11) NOT NULL,
  `Admin` bit(1) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Foto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`idEmpleado`, `Admin`, `Nombre`, `Apellido`, `Username`, `Contraseña`, `Foto`) VALUES
(1, b'0', 'Alejandra', 'Cruz', 'ale', '123', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `financiamiento`
--

CREATE TABLE `financiamiento` (
  `idFinanciamiento` int(11) NOT NULL,
  `idVehiculo` int(11) NOT NULL,
  `idCliente` int(11) DEFAULT NULL,
  `Enganche` decimal(9,2) NOT NULL,
  `Mensualidad` varchar(255) NOT NULL,
  `Garantia` varchar(255) NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `ApellidoPaterno` varchar(255) NOT NULL,
  `ApellidoMaterno` varchar(255) NOT NULL,
  `FechaNacimiento` varchar(255) NOT NULL,
  `Telefono` int(11) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Genero` varchar(255) NOT NULL,
  `EstadoNacimiento` varchar(255) NOT NULL,
  `Rcf` varchar(255) NOT NULL,
  `Curp` varchar(255) NOT NULL,
  `RegimenFiscal` varchar(255) NOT NULL,
  `FuenteIngresos` varchar(255) NOT NULL,
  `IngresoNeto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `idVehiculo` int(11) NOT NULL,
  `Modelo` varchar(255) NOT NULL,
  `Marca` varchar(255) NOT NULL,
  `Año` int(11) NOT NULL,
  `Precio` decimal(9,2) NOT NULL,
  `TipoVehiculo` varchar(255) NOT NULL,
  `Color` varchar(255) NOT NULL,
  `Kilometraje` varchar(255) NOT NULL,
  `NumeroSerie` varchar(255) NOT NULL,
  `Estado` varchar(255) NOT NULL,
  `Otros` varchar(255) NOT NULL,
  `Stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `idEmpleado` int(11) NOT NULL,
  `idVehiculo` int(11) NOT NULL,
  `FechaVenta` datetime NOT NULL,
  `idFinanciamiento` int(11) DEFAULT NULL,
  `ReporteReserva` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`idCliente`);

--
-- Indices de la tabla `empleados`
--
ALTER TABLE `empleados`
  ADD PRIMARY KEY (`idEmpleado`);

--
-- Indices de la tabla `financiamiento`
--
ALTER TABLE `financiamiento`
  ADD PRIMARY KEY (`idFinanciamiento`),
  ADD KEY `idVehiculo` (`idVehiculo`),
  ADD KEY `idCliente` (`idCliente`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`idVehiculo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`),
  ADD KEY `idCliente` (`idCliente`),
  ADD KEY `idEmpleado` (`idEmpleado`),
  ADD KEY `idVehiculo` (`idVehiculo`),
  ADD KEY `idFinanciamiento` (`idFinanciamiento`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `financiamiento`
--
ALTER TABLE `financiamiento`
  ADD CONSTRAINT `financiamiento_ibfk_1` FOREIGN KEY (`idVehiculo`) REFERENCES `inventario` (`idVehiculo`),
  ADD CONSTRAINT `financiamiento_ibfk_2` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`idCliente`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`idCliente`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`idEmpleado`) REFERENCES `empleados` (`idEmpleado`),
  ADD CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`idVehiculo`) REFERENCES `inventario` (`idVehiculo`),
  ADD CONSTRAINT `ventas_ibfk_4` FOREIGN KEY (`idFinanciamiento`) REFERENCES `financiamiento` (`idFinanciamiento`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
