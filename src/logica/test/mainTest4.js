/**
 *
 * NOMBRE: mainTest4.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 02/01/2023
 * DESCRIPCIÓN: Realiza pruebas automáticas para comprobar que nuestra api rest funciona
 *
 */
//------------------------------------------------------------------------------
const PUERTO_IP = "http://localhost:8080";
process.env.NODE_ENV = "test";
const app = require("../../servidorREST/servidor");
const request = require("supertest");
var assert = require("assert");
const chai = require("chai");
const Logica = require("../logica");
const conexion = new Logica("gti3a_test", "root", "localhost", 3306, "mysql");
//------------------------------------------------------------------------------
describe("Test, probar métodos que buscan usuarios o dispositivos", function () {
  this.beforeAll(async function () {
    console.log("BEFORE ALL: Preparación de los test");
    var datosUsuario = {
      id: "",
      Nombre: "Claudia",
      Contrasena: "1234",
      Correo: "prueba@prueba.com",
      EsAdmin: "0",
    };
    var datosUsuario2 = {
      id: "",
      Nombre: "Admin",
      Contrasena: "1234",
      Correo: "Admin@Admin.com",
      EsAdmin: "1",
    };
    var datosCiudad = {
      id: "",
      Nombre: "La Laguna",
      Admin_id: "2",
    };
    var datosDispositivo = {
      id: "",
      Nombre: "Gas",
      Ciudad_id: "1",
    };
    var relacionUsuarioDispositivo = {
      Correo: "prueba@prueba.com",
      Nombre: "Gas",
    };
    try {
      await conexion.borrarRegistros({ Nombre: "usuario_dispositivo" });
      await conexion.borrarRegistros({ Nombre: "dispositivo" });
      await conexion.borrarRegistros({ Nombre: "ciudad" });
      await conexion.borrarRegistros({ Nombre: "usuario" });
      await conexion.insertarUsuario(datosUsuario);
      await conexion.insertarUsuario(datosUsuario2);
      await conexion.insertarCiudad(datosCiudad);
      await conexion.insertarDispositivo(datosDispositivo);
      await conexion.insertarUsuario_Dispositivo(relacionUsuarioDispositivo);
    } catch (e) {
      console.log("ERROR");
    }
  });
  //------------------------------------------------------------------------------
  // probar que obtiene todos los usuarios
  //------------------------------------------------------------------------------
  it("probando GET /obtenerUsuarios", function (hecho) {
    request(app)
      .get("/obtenerUsuarios")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res) => {
        var cargaJSON = JSON.parse(res.text);
        assert.equal(
          cargaJSON[cargaJSON.length - 1].Nombre.toString(),
          "Admin",
          "¿El primer nombre no es Admin?"
        );
      })
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que verifica que el usuario pertenece a la base de datos
  //------------------------------------------------------------------------------
  it("probando GET /verificarUsuario cuando existe", function (hecho) {
    request(app)
      .get("/verificarUsuario?Correo=prueba@prueba.com&Contrasena=1234")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res) => {
        console.log(res);
        var cargaJSON = JSON.parse(res.text);
        assert.equal(
        cargaJSON.Nombre.toString(),
          "Claudia",
          "¿El nombre no es Claudia?"
        );
      })
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que si un usuario no existe lanza un 404
  //------------------------------------------------------------------------------
  it("probando GET /verificarUsuario cuando no existe", function (hecho) {
    request(app)
      .get("/verificarUsuario?Correo=prueba@prueba.com&Contrasena=1111")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(404)
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que la lista de usuarios que tiene un administrador es correcta
  //------------------------------------------------------------------------------
  it("probando GET /buscarUsuariosDeAdmin", function (hecho) {
    request(app)
      .get("/buscarUsuariosDeAdmin?id_admin=2")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res) => {
        var cargaJSON = JSON.parse(res.text);
        assert.equal(
          cargaJSON[0].Nombre.toString(),
          "Claudia",
          "¿El nombre no es Claudia?"
        );
      })
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que obtieen el id de un usuario
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdUsuario cuando existe", function (hecho) {
    request(app)
      .get("/obtenerIdUsuario?Correo=prueba@prueba.com")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res)=> {
        var cargaJSON = JSON.parse(res.text);
        assert.equal(cargaJSON.id.toString(), "1", "¿El id no es 1?");
      })
      .end(hecho);
  });
  //------------------------------------------------------------------------------
  // probar que muestra una excepcion si no existe
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdUsuario cuando el correo no existe", function (hecho) {
    request(app)
      .get("/obtenerIdUsuario?Correo=pruebaaaaaa@prueba.com")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(404)
      .end(hecho);
  });
  //------------------------------------------------------------------------------
  // probar que muestra una excepcion si no tiene un correo
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdUsuario cuando el correo está vacío", function (hecho) {
    request(app)
      .get("/obtenerIdUsuario?Correo=")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(404)
      .end(hecho)
  });
  //------------------------------------------------------------------------------
  // probar que obtien el id de un dispositivo
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdDispositivo cuando existe", function (hecho) {
    request(app)
      .get("/obtenerIdDispositivo?Nombre=Gas")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res)=> {
        var cargaJSON = JSON.parse(res.text);
        console.log(cargaJSON)
        assert.equal(cargaJSON.id.toString(), "1", "¿El id no es 1?");
      })
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que si el dispositivo no existe muestra una excepción
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdDispositivo cuando el nombre no existe", function (done) {
    request(app)
      .get("/obtenerIdDispositivo?Nombre=Sensor")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(404)
      .end(done)
  }); //it()
  //------------------------------------------------------------------------------
  // probar que si no se da un nombre de dispositivo
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdDispositivo cuando el nombre se da vacío", function (done) {
    request(app)
      .get("/obtenerIdDispositivo?Nombre=")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(404)
      .end(done)
  }); //it()
  this.afterAll(async function () {
    try {
      await conexion.borrarRegistros({ Nombre: "usuario_dispositivo" });
      await conexion.borrarRegistros({ Nombre: "dispositivo" });
      await conexion.borrarRegistros({ Nombre: "ciudad" });
      await conexion.borrarRegistros({ Nombre: "usuario" });
    } catch (e) {
      console.log("ERROR");
    }
  });
});
