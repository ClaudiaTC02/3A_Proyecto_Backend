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
const modeloCiudad = require('./models').Ciudad;
const modeloMedida = require('./models').Medida;
const modeloDipositivo = require('./models').Dispositivo;
const modeloUsuario_Dispositivo = require('./models').Usuario_Dispositivo;
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
   * @brief este método se encarga de obtener todos los usuarios
   * @return usuarios
   * Diseño:  --> obtenerUsuarios() --> [{id: int, nombre: string, contraseña: string, correo:string}]
   **/
  //------------------------------------------------------------------------------
  async obtenerUsuarios() {
    // SELECT * FROM Usuario
    const usuarios = await modeloUsuario.findAll();
    return usuarios;
  } //obtenerUsuarios()
  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de insertar un usurio
   * @param body contenido a insertar
   * Diseño: body: [{id: int, nombre: string, contraseña: string, correo:string}] --> insertarUsuario() --> 201 | 404
   */
  async insertarUsuario(body) {
    // INSERT INTO Usuario ('id', 'nombre', 'contraseña', 'correo') VALUES ()
    await modeloUsuario.create(body);
  } // insertarUsuario()
    //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar si un usuario existe
   * @param correo correo a buscar
   * @param contrasena contraseña del usuario a buscar
   * Diseño: correo:Texto, contraseña:Texto --> buscarUsuario() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async buscarUsuario(correo, contrasena) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloUsuario.findAll({
      where: {
        Correo: correo,
        Contrasena: contrasena
      },
      raw:true
    })
  } //buscarUsuario()
      //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de eliminar un usuario
   * @param correo correo del usuario a eliminar
   * Diseño: correo:Texto --> borrarUsuario() --> 200 | 404
   */
   async borrarUsuario(correo) {
    // DELETE * FROM Usuario WHERE Correo = $correo
    await modeloUsuario.destroy({
      where:{
        Correo: correo
      }
    })
  } //borrarUsuario()
  async buscarUsuarioId(id) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloUsuario.findAll({
      where: {
        Id: id
      },
      raw:true
    })
  } //buscarUsuario()
    
    async actualizarUsuario(id,correo,nombre,contra,admin) {
      
        await modeloUsuario.update(
          {
            Nombre: nombre,
            Correo: correo,
            Contrasena: contra,
            EsAdmin: admin,
            //FotoPerfil: foto
          },
          {
              where: { id: id }
          }
      );
      return await modeloUsuario.findAll({
        where: {
          Correo: correo,
          Contrasena: contra
        },
        raw:true
      })
        
  
    } // actualizarFoto()


  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar usuarios según el id de un admin
   * @param id id del admin
   * Diseño: id:N --> buscarUsuariosDeAdmin() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
  async buscarUsuariosDeAdmin(id) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloUsuario.findAll({
      include:[
        {
          model: modeloCiudad,
          require: true
        }
      ]
    })
  } //buscarUsuario()
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
  }//testConexion()
}; //class()
