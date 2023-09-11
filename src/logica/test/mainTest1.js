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
const conexion = new Logica("gti3a_test", "root", "localhost", 3306, "mysql")
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// main()
//------------------------------------------------------------------------------
// probar que se establece conexión
//------------------------------------------------------------------------------
describe("Test, probar conexión e insertar usuarios", function () {
  this.beforeAll(async function () {
    console.log("BEFORE ALL: Preparación de los test");
    // PRIMERO BORRO LOS DATOS DE LA TABLA DE USUARIO POR SI HUBIERAN
    try {
      await conexion.borrarRegistros({Nombre:"usuario"})
    } catch (e) {
      console.log("ERROR")
    } 
  });
  //------------------------------------------------------------------------------
  // probar que se conecta con la bbdd
  //------------------------------------------------------------------------------
  it("probando GET /test", function (hecho) {
    request(app)
      .get("/test")
      .set("User-Agent", "ClaudiaTorresCruz")
      .expect(200)
      .expect((res) => {
        chai.expect(res.text).to.be.a("string");
        chai.expect(res.text).to.equal("Parece que funciona");
      })
      .end(hecho);
  }); //it()
  //------------------------------------------------------------------------------
  // probar que añade usuarios que no existem
  //------------------------------------------------------------------------------
  it("probar POST /usuario", (done) => {
    const datos = {
      id: "",
      Nombre: "Claudia",
      Contrasena: "1234",
      Correo: "prueba@prueba.com",
      EsAdmin: "0",
    };
    request(app)
      .post("/usuario")
      .set("User-Agent", "ClaudiaTorresCruz")
      .set("Content-Type", "application/json")
      .send(datos)
      .expect(201)
      .end(done);
  });
  //------------------------------------------------------------------------------
  // probar que no añade usuarios que tienen el mismo correo
  //------------------------------------------------------------------------------
  it("probar POST /usuario", (done) => {
    let datos = {
      id: "",
      Nombre: "Pepe",
      Contrasena: "1234",
      Correo: "prueba@prueba.com",
      EsAdmin: "0",
    };
    request(app)
      .post("/usuario")
      .set("User-Agent", "ClaudiaTorresCruz")
      .set("Content-Type", "application/json")
      .send(datos)
      .expect(400)
      .end(done);
  });
  this.afterAll(async function () {
    try {
      await conexion.borrarRegistros({Nombre:"usuario"})
      await conexion.borrarRegistros({Nombre:"usuario"})
    } catch (e) {
      console.log("ERROR")
    } 
  });
}); //()
