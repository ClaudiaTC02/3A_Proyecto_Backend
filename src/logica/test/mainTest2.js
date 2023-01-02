/**
 *
 * NOMBRE: test.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 07/10/2022
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
//------------------------------------------------------------------------------
// main()
//------------------------------------------------------------------------------
// probar que se establece conexión
//------------------------------------------------------------------------------
describe("Test, probar que inserta la relación usuario-dispositivo y que borra usuarios", function () {
  //------------------------------------------------------------------------------
  // se ejecuta para preparar la bd
  //------------------------------------------------------------------------------
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
    try {
      await conexion.borrarRegistros({ Nombre: "usuario_dispositivo" });
      await conexion.borrarRegistros({ Nombre: "dispositivo" });
      await conexion.borrarRegistros({ Nombre: "ciudad" });
      await conexion.borrarRegistros({ Nombre: "usuario" });
      await conexion.insertarUsuario(datosUsuario);
      await conexion.insertarUsuario(datosUsuario2);
      await conexion.insertarCiudad(datosCiudad);
      await conexion.insertarDispositivo(datosDispositivo);
    } catch (e) {
      console.log("ERROR");
    }
  });
  //------------------------------------------------------------------------------
  // probar que añade usuario_dispositivo
  //------------------------------------------------------------------------------
  it("probar POST /usuario_dispositivo", function (done) {
    let datos = { Correo: "prueba@prueba.com", Nombre: "Gas" };
    request(app)
      .post("/usuario_dispositivo")
      .set("User-Agent", "ClaudiaTorresCruz")
      .set("Content-Type", "application/json")
      .send(datos)
      .expect(201)
      .end(function (err, res) {
        assert.equal(err, null, "¿ha habido un error?");
        done();
      });
  });
  //------------------------------------------------------------------------------
  // probar que elimina usuarios
  //------------------------------------------------------------------------------
  it("probar POST /borrarUsuario", function (hecho) {
    var datos = {
      id: "",
      Nombre: "Claudia",
      Contrasena: "1234",
      Correo: "prueba@prueba.com",
      EsAdmin: "0",
    };
    request(app)
      .post("/borrarUsuario")
      .set("User-Agent", "ClaudiaTorresCruz")
      .set("Content-Type", "application/json")
      .send(datos)
      .expect(200)
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // limpiar db
  //------------------------------------------------------------------------------
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
}); //()
