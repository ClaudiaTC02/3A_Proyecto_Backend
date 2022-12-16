-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-12-2022 a las 12:37:25
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gti3a_proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `Id` int(11) NOT NULL,
  `Nombre` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Id_Admin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`Id`, `Nombre`, `Id_Admin`) VALUES
(1, 'Gandia', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispositivo`
--

CREATE TABLE `dispositivo` (
  `Id` int(11) NOT NULL,
  `Nombre` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Id_Ciudad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `dispositivo`
--

INSERT INTO `dispositivo` (`Id`, `Nombre`, `Id_Ciudad`) VALUES
(2, 'Sensorin', 1),
(3, 'Gas', 1),
(4, 'Sensor2', 1),
(5, 'GTI-3ARoberto', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medida`
--

CREATE TABLE `medida` (
  `Id` int(11) NOT NULL,
  `Dato` double NOT NULL,
  `Fecha` datetime(6) NOT NULL,
  `Latitud` double NOT NULL,
  `Longitud` double NOT NULL,
  `Id_Dispositivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `medida`
--

INSERT INTO `medida` (`Id`, `Dato`, `Fecha`, `Latitud`, `Longitud`, `Id_Dispositivo`) VALUES
(1, 0.4705, '2022-12-16 11:52:24.000000', 38.9970618, -0.16568674, 5),
(2, 0.4705, '2022-12-16 11:52:24.000000', 38.9970618, -0.16568674, 5),
(3, 0.4705, '2022-12-16 11:52:24.000000', 38.9970618, -0.16568674, 5),
(4, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(5, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(6, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(7, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(8, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(9, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(10, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(11, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(12, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(13, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(14, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(15, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(16, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5),
(17, 0.4705, '2022-12-16 11:52:25.000000', 38.9970618, -0.16568674, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id` int(11) NOT NULL,
  `Nombre` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Contrasena` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `Correo` text CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `EsAdmin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id`, `Nombre`, `Contrasena`, `Correo`, `EsAdmin`) VALUES
(2, 'Marc', '1234', 'marc@marc.com', 0),
(3, 'davidAdmin', '12345', 'davidAdmin@gmail.com', 1),
(6, 'david', '1234', 'david@david.com', 0),
(54, 'david1', '1234', 'david1@david1.com', 0),
(55, 'david2', '123', 'david2@david2.com', 0),
(56, 'david3', '123', 'david3@david3.com', 0),
(57, 'david4', '123', 'david4@david4.com', 0),
(58, 'davidP', '1234', 'davidP@davidP', 0),
(59, 'davidT', '1234', 'davidT@davidT', 0),
(60, 'davidJ', '1234', 'davidJ@davidJ.com', 0),
(61, 'pacocastells', '12345', 'fcastells@eln.upv.es', 0),
(62, 'dav', '1234', 'dav@dav.com', 0),
(63, 'davi', '123', 'davi@davi.com', 0),
(64, 'Dav2', '123', 'dav2@dav2.com', 0),
(65, 'david100', '1234', 'david100@david100', 0),
(66, 'dd', '123', 'dd@dd.com', 0),
(67, 'dada', '1234', 'dada@dada.com', 0),
(68, 'rr', '1234', 'rr@rr.com', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_dispositivo`
--

CREATE TABLE `usuario_dispositivo` (
  `Id_Usuario` int(11) NOT NULL,
  `Id_Dispositivo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario_dispositivo`
--

INSERT INTO `usuario_dispositivo` (`Id_Usuario`, `Id_Dispositivo`) VALUES
(2, 2),
(6, 3),
(6, 3),
(6, 3),
(6, 3),
(6, 3),
(6, 3),
(6, 3),
(6, 3),
(54, 3),
(54, 3),
(54, 4),
(55, 3),
(56, 3),
(58, 4),
(59, 4),
(60, 4),
(61, 3),
(62, 3),
(63, 3),
(64, 3),
(65, 3),
(66, 3),
(67, 3),
(68, 5);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id_Admin` (`Id_Admin`);

--
-- Indices de la tabla `dispositivo`
--
ALTER TABLE `dispositivo`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id_Ciudad` (`Id_Ciudad`);

--
-- Indices de la tabla `medida`
--
ALTER TABLE `medida`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id_Dispositivo` (`Id_Dispositivo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Correo` (`Correo`) USING HASH;

--
-- Indices de la tabla `usuario_dispositivo`
--
ALTER TABLE `usuario_dispositivo`
  ADD KEY `Id_Usuario` (`Id_Usuario`,`Id_Dispositivo`),
  ADD KEY `Id_Dispositivo` (`Id_Dispositivo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `dispositivo`
--
ALTER TABLE `dispositivo`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `medida`
--
ALTER TABLE `medida`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `ciudad_ibfk_1` FOREIGN KEY (`Id_Admin`) REFERENCES `usuario` (`Id`);

--
-- Filtros para la tabla `dispositivo`
--
ALTER TABLE `dispositivo`
  ADD CONSTRAINT `dispositivo_ibfk_1` FOREIGN KEY (`Id_Ciudad`) REFERENCES `ciudad` (`Id`);

--
-- Filtros para la tabla `medida`
--
ALTER TABLE `medida`
  ADD CONSTRAINT `medida_ibfk_1` FOREIGN KEY (`Id_Dispositivo`) REFERENCES `dispositivo` (`Id`);

--
-- Filtros para la tabla `usuario_dispositivo`
--
ALTER TABLE `usuario_dispositivo`
  ADD CONSTRAINT `usuario_dispositivo_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id`),
  ADD CONSTRAINT `usuario_dispositivo_ibfk_2` FOREIGN KEY (`Id_Dispositivo`) REFERENCES `dispositivo` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
