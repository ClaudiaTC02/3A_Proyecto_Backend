/**
 *
 * NOMBRE: logica.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 30/10/2022
 * DESCRIPCIÓN: En este fichero se encuentra la lógica verdadera encargada de recoger datos de la base de datos
 *
 */
//------------------------------------------------------------------------------
//usamos sequelize
const sequelize = require("sequelize");
const { DataTypes, Sequelize } = require("sequelize");
const { OP } = require("sequelize");
//cargamos los modelos
const modeloUsuario = require('./models').Usuario;
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = class Logica {
  //------------------------------------------------------------------------------
  /**
   * @brief este es el constructor de la clase lógica
   * @param bbdd
   * @param usuario
   * @param host
   * @param puerto
   * @param dialecto
   * @return conexion
   * Diseño: bbdd: texto, usuario: texto, host: texto, puerto: Z, dialecto: texto --> constructor() --> conexion: Sequalize
   **/
  //------------------------------------------------------------------------------
  constructor(bbdd, usuario, host, puerto, dialecto) {
    this.conexion = new Sequelize(bbdd, usuario, null, {
      host: host,
      port: puerto,
      dialect: dialecto,
    });
  }
  //------------------------------------------------------------------------------
  /**
   * @brief este método se encarga de obtener todas las mediciones
   * @param Medicion (tabla de la base de datos)
   * @return mediciones
   * Diseño:  --> obtenerUsuarios() --> [{id: int, nombre: string, contraseña: string, correo:string}]
   **/
  //------------------------------------------------------------------------------
  async obtenerUsuarios() {
    const usuarios = await modeloUsuario.findAll();
    return usuarios;
  }
  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de insertar un usurio
   * @param body contenido a insertar
   * Diseño: body: [{id: int, nombre: string, contraseña: string, correo:string}] --> insertarUsuario() --> 201 | 404
   */
  async insertarUsuario(body) {
    await modeloUsuario.create(body);
  }
  //------------------------------------------------------------------------------
  /**
   * @brief este método se encarga de comprobar que la conexión con la base de datos de phpmyadmin esté establecida
   * Diseño: --> testConexion() -->
   **/
  //------------------------------------------------------------------------------
  async testConexion() {
    try {
      await this.conexion.authenticate();
      console.log("Conexión establecida");
    } catch (error) {
      console.error("No se puede conectar con la base de datos: ", error);
    }
  }
};
