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
describe("Test, probar que obtiene usuarios", function () {
  this.beforeAll(async function () {
    console.log("BEFORE ALL: Preparación de los test");
    // PRIMERO BORRO LOS DATOS DE LA TABLA DE USUARIO POR SI HUBIERAN
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
  // probar que obtiene usuarios
  //------------------------------------------------------------------------------
  it("probando GET /obtenerUsuarios", function (hecho) {
    console.log("eey");
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
  // probar que busca usuarios
  //------------------------------------------------------------------------------
  it("probando GET /verificarUsuario", function (hecho) {
    request(app)
      .get("/verificarUsuario?Correo=prueba@prueba.com&Contrasena=1234")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res) => {
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
  // probar que busca usuarios
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
