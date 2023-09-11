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
const hoy = new Date();
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// main()
//------------------------------------------------------------------------------
// probar que se establece conexión
//------------------------------------------------------------------------------
describe("Test, probar los métodos relacionados con las medidas", function () {
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
    var datosMedida = {
      medida: "10",
      latitud: "0",
      longitud: "0",
      fecha: hoy,
      dispositivo: "1",
    }
    var datosMedida2 = {
      medida: "50",
      latitud: "0",
      longitud: "0",
      fecha: hoy,
      dispositivo: "1",
    }
    try {
      await conexion.borrarRegistros({ Nombre: "usuario_dispositivo" });
      await conexion.borrarRegistros({ Nombre: "medida" });
      await conexion.borrarRegistros({ Nombre: "dispositivo" });
      await conexion.borrarRegistros({ Nombre: "ciudad" });
      await conexion.borrarRegistros({ Nombre: "usuario" });
      await conexion.insertarUsuario(datosUsuario);
      await conexion.insertarUsuario(datosUsuario2);
      await conexion.insertarCiudad(datosCiudad);
      await conexion.insertarDispositivo(datosDispositivo);
      await conexion.insertarUsuario_Dispositivo(relacionUsuarioDispositivo);
      await conexion.insertarMedicion(datosMedida)
      await conexion.insertarMedicion(datosMedida2)
    } catch (e) {
      console.log("ERROR");
    }
  });
    //------------------------------------------------------------------------------
    // probar que obtiene medidas
    //------------------------------------------------------------------------------
    it("probando GET /obtenerFechaUltimaMedida", function (hecho) {
      request(app)
        .get("/obtenerFechaUltimaMedida?id_usuario=1")
        .set("User-Agent", "ClaudiaTorresCruz")
        .expect(200)
        .end(hecho)
    }); //it()
    //------------------------------------------------------------------------------
    // probar que obtiene la media de las medidas de un usuario
    //------------------------------------------------------------------------------
    it("probando GET /obtenerMediaMedidas", function (hecho) {
      request(app)
        .get('/obtenerMediaMedidas?id_usuario=1')
        .set('User-Agent', 'ClaudiaTorresCruz')
        .expect(200)
        .expect((res)=> {
          var cargaJSON = JSON.parse(res.text);
          assert.equal(
            res.text,
            "30",
            "¿El valor no es 30?"
          );
        })
        .end(hecho);
    }); //it() 
    //------------------------------------------------------------------------------
    // probar que cuando el id no existe devuelve una excepción
    //------------------------------------------------------------------------------
    it("probando GET /obtenerMediaMedidas cuando el id no existe", function (hecho) {
      request(app)
        .get('/obtenerMediaMedidas?id_usuario=4')
        .set('User-Agent', 'ClaudiaTorresCruz')
        .expect(404)
        .end(hecho);
    }); //it() 
    //------------------------------------------------------------------------------
    // probar que cuando no tiene medidas devuelve excepción
    //------------------------------------------------------------------------------
    it("probando GET /obtenerMediaMedidas cuando no existen medidas", function (hecho) {
      request(app)
        .get('/obtenerMediaMedidas?id_usuario=2')
        .set('User-Agent', 'ClaudiaTorresCruz')
        .expect(404)
        .end(hecho);
    }); //it() 
    this.afterAll(async function () {
      try {
        await conexion.borrarRegistros({ Nombre: "usuario_dispositivo" });
        await conexion.borrarRegistros({ Nombre: "medida" });
        await conexion.borrarRegistros({ Nombre: "dispositivo" });
        await conexion.borrarRegistros({ Nombre: "ciudad" });
        await conexion.borrarRegistros({ Nombre: "usuario" });
        await conexion.borrarRegistros({ Nombre: "medida" });
      } catch (e) {
        console.log("ERROR");
      }
    });   
}); //()