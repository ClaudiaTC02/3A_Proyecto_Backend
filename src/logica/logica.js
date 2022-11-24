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
const { DataTypes, Sequelize } = require("sequelize");
const { OP } = require("sequelize");
const { QueryTypes } = require('sequelize');
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
   * @brief este método se encarga de insertar la relacion disp-us
   * @param body contenido a insertar
   * Diseño: body: [{idUsuario: int, idDispositivo: int}] --> insertarUsuario_Dispositivo() --> 201 | 404
   */
   async insertarUsuario_Dispositivo(body) {
    // INSERT INTO Usuario_Dispositivo ('idUsuario', 'idDispositivo') VALUES ()
    await modeloUsuario_Dispositivo.create(body);
  } // insertarUsuario_Dispositivo()
    //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar si un usuario existe
   * @param correo correo a buscar
   * @param contrasena contraseña del usuario a buscar
   * Diseño: correo:Texto, contraseña:Texto --> verificarUsuario() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async verificarUsuario(correo, contrasena) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloUsuario.findAll({
      where: {
        Correo: correo,
        Contrasena: contrasena
      },
      raw:true
    })
  } //verificarUsuario()
      //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar un usuario dado un correo
   * @param correo correo a buscar
   * Diseño: correo:Texto --> obtenerIdUsuario() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async obtenerIdUsuario(correo) {
    // SELECT * FROM Usuario WHERE Correo = $correo
    return await modeloUsuario.findAll({
      where: {
        Correo: correo
      },
      raw:true
    })
  } //obtenerIdUsuario()
  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar un usuario dado un correo
   * @param correo correo a buscar
   * Diseño: correo:Texto --> obtenerIdUsuario() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async obtenerIdDispositivo(nombre) {
    // SELECT * FROM Dispositivo WHERE Nombre = $nombre
    return await modeloDipositivo.findAll({
      where: {
        Nombre: nombre
      },
      raw:true
    })
  } //obtenerIdUsuario()
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
        id: id
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
   * @param id_admin id del admin
   * Diseño: id_admin:N --> buscarUsuariosDeAdmin() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async buscarUsuariosDeAdmin(id_admin) {
    return await this.conexion.query("Select usuario.Nombre, usuario.Correo FROM usuario INNER JOIN ciudad ON ciudad.Id_Admin = :id INNER JOIN dispositivo ON dispositivo.Id_Ciudad = ciudad.Id INNER JOIN usuario_dispositivo ON usuario_dispositivo.Id_Dispositivo = dispositivo.Id WHERE usuario.Id = usuario_dispositivo.Id_Usuario AND usuario.EsAdmin = 0;",
    {
      replacements: { id: id_admin },
      type: QueryTypes.SELECT
    })
  } //buscarUsuariosDeAdmin()
/**
   * *
   * @brief este método se encarga de buscar el dispositivo del usuario por su id
   * @param id id del usuario
   * Diseño: id_usuario:N --> buscarDispositivoUsuario() --> [{id_usuario: int, id_sensor:int] | 404
   */
  async buscarDispositivoUsuario(id) {
    // SELECT * modeloUsuario_Dispositivo WHERE Id_usuario =$id;
    return await modeloUsuario_Dispositivo.findAll({
      where: {
        Id_Usuario: id
      },
      raw:true
    })
  } //buscarDispositivoUsuario()
/**
   * *
   * @brief este método se encarga de buscar el dispositivo por su id
   * @param id id del usensor
   * Diseño: id_senor:N --> buscarDispositivoUsuario() --> [{id_sensor: int, nombre: String, id_ciudad:int] | 404
   */
   //------------------------------------------------------------------------------
   async buscarDispositivoPorId(idSensor) {
    // SELECT * FROM UModeloDispositivo WHERE Id_Sensor = $id ;
    return await modeloDipositivo.findAll({
      where: {
        Id: idSensor
      },
      raw:true
    })
  } //buscarDispositivoUsuario()
  //------------------------------------------------------------------------------
  /**
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

