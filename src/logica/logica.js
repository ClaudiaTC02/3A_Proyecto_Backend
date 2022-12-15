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
//usamos mailtrap
const { MailtrapClient } = require("mailtrap");
const TOKEN = "undefined";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@techcommit00.com",
  name: "TechCommit",
};
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
    //await modeloUsuario_Dispositivo.create(body);
    var id_usuario = await this.obtenerIdUsuario(body.Correo)
    var Id_Dispositivo = await this.obtenerIdDispositivo(body.Nombre)
    
    return await this.conexion.query("INSERT INTO `usuario_dispositivo` (`Id_Usuario`, `Id_Dispositivo`) VALUES (:usuario_id, :dispositivo_id)",
    {
      replacements: { usuario_id: id_usuario[0].id,
      dispositivo_id:Id_Dispositivo[0].id },
      type: QueryTypes.INSERT
    })
  } // insertarUsuario_Dispositivo()
    //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de verificar si un usuario existe
   * @param correo correo 
   * @param contrasena contraseña del usuario
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
   * @brief este método se encarga de buscar el id de un usuario dado un correo
   * @param correo correo a buscar
   * Diseño: correo:Texto --> obtenerIdUsuario() --> [{id: int}] | 404
   */
   async obtenerIdUsuario(correo) {
    // SELECT * FROM Usuario WHERE Correo = $correo
    return await modeloUsuario.findAll({
      attributes: ['id'],
      where: {
        Correo: correo
      },
      raw:true
    })
  } //obtenerIdUsuario()
  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar el id un dispositivo dado un nombre
   * @param nombre nombre a buscar
   * Diseño: nombre:Texto --> obtenerIdDispositivo() --> [{id: int}] | 404
   */
   async obtenerIdDispositivo(nombre) {
    // SELECT * FROM Dispositivo WHERE Nombre = $nombre
    return await modeloDipositivo.findAll({
      attributes: ['id'],
      where: {
        Nombre: nombre
      },
      raw:true
    })
  } //obtenerIdDispositivo()
      //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de eliminar un usuario
   * @param correo correo del usuario a eliminar
   * Diseño: correo:Texto --> borrarUsuario() --> 200 | 404
   */
   async borrarUsuario(correo) {
    // DELETE * FROM Usuario WHERE Correo = $correo
    console.log(" * GET /borrarUsuario ");
    var id_usuario = await this.obtenerIdUsuario(correo);
    console.log(id_usuario);
    await this.borrarUsuario_Dispositivo(id_usuario[0].id)
    await modeloUsuario.destroy({
      where:{
        Correo: correo
      }
    })
  } //borrarUsuario()
      //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de eliminar una relación dispositivo-usuario
   * @param id_usuario id del usuario para eliminar el enlace usuario_dispositivo
   * Diseño: id_usuario:N --> borrarUsuario_Dispositivo() --> 200 | 404
   */
   async borrarUsuario_Dispositivo(id_usuario) {
    // DELETE * FROM Usuario WHERE Correo = $correo
    await this.conexion.query("DELETE FROM usuario_dispositivo WHERE usuario_dispositivo.Id_Usuario = :id",
    {
      replacements: { id: id_usuario },
      type: QueryTypes.DELETE
    })
  } //borrarUsuario_Dispositivo()
  /**
   * *
   * @brief este método se encarga de buscar un usuario según un id
   * @param id id a buscar
   * Diseño: id:N --> buscarUsuarioId() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
  async buscarUsuarioId(id) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloUsuario.findAll({
      where: {
        id: id
      },
      raw:true
    })
  } //buscarUsuarioId()
  /**
   * *
   * @brief este método se encarga de actualizar el usuario
   * @param id id del usuario
   * @param correo correo del usuario
   * @param nombre nombre del usuario
   * @param contra contra del usuario
   * @param admin admin del usuario
   * Diseño: id:N, correo:Txt, nombre:Txt, contra:Txt, admin:N --> actualizarUsuario() --> [{id: int, nombre: string, contraseña: string, correo:string, admin:string}] | 404
   */
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
              where: { id : id }
          }
      );
      return await modeloUsuario.findAll({
        where: {
          Correo: correo,
          Contrasena: contra
        },
        raw:true
      })
    } // actualizarUsuario()
//------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de buscar usuarios según el id de un admin
   * @param id_admin id del admin
   * Diseño: id_admin:N --> buscarUsuariosDeAdmin() --> [{id: int, nombre: string, contraseña: string, correo:string}] | 404
   */
   async buscarUsuariosDeAdmin(id_admin) {
    return await this.conexion.query("Select usuario.Nombre, usuario.Correo, usuario.id FROM usuario INNER JOIN ciudad ON ciudad.Id_Admin = :id INNER JOIN dispositivo ON dispositivo.Id_Ciudad = ciudad.Id INNER JOIN usuario_dispositivo ON usuario_dispositivo.Id_Dispositivo = dispositivo.Id WHERE usuario.Id = usuario_dispositivo.Id_Usuario AND usuario.EsAdmin = 0;",
    {
      replacements: { id: id_admin },
      type: QueryTypes.SELECT
    })
  } //buscarUsuariosDeAdmin()
  //------------------------------------------------------------------------------
  /**
   * *
   * @brief este método se encarga de obtener la fecha de la ultima medida de un usuario
   * @param id_usuario id del usuario
   * Diseño: id_usuario:N --> obtenerUltimaMedida() --> [{fecha: Date}] | 404
   */
   async obtenerUltimaMedida(id_usuario) {
    return await this.conexion.query("SELECT medida.Fecha FROM medida INNER JOIN usuario on usuario.id = :id INNER JOIN usuario_dispositivo on usuario_dispositivo.Id_Usuario = usuario.Id INNER JOIN dispositivo on dispositivo.id = usuario_dispositivo.Id_Dispositivo WHERE medida.Id_Dispositivo = dispositivo.Id  ORDER BY medida.Fecha DESC LIMIT 1;",
    {
      replacements: { id: id_usuario },
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
   * @param idSensor id del sensor
   * Diseño: id_senor:N --> buscarDispositivoPorId() --> [{id_sensor: int, nombre: String, id_ciudad:int] | 404
   */
   //------------------------------------------------------------------------------
  async buscarDispositivoPorId(idSensor) {
    // SELECT * FROM Usuario WHERE Correo = $correo AND Contraseña = $contraseña;
    return await modeloDipositivo.findAll({
      where: {
        Id: idSensor
      },
      raw:true
    })
  } //buscarDispositivoUsuario()
  /**
  * Funcion que inserta en la BBDD una medicion
  *
  * @param Medicion tabla de la BBDD 
  * @param body contenido a insertar
  *
  */
  async insertarMedicion(body) {
    await modeloMedida.create(body);
  }
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
  async enviarMail(){
    console.log("pasa por aqui")
    Email.send({
      Host : "send.smtp.mailtrap.io",
      Username : "api",
      Password : "e00291ffd3ffe3c9676e3fe1d948e9d6",
      To : 'davidlopez.gandia@gmail.com',
      From : "techcommit00@gmail.com",
      Subject : "Test email",
      Body : "<html><h2>Header</h2><strong>Bold text</strong><br></br><em>Italic</em></html>"
  }).then(
    message => alert(message)
    
  );
  }
}; //class()

