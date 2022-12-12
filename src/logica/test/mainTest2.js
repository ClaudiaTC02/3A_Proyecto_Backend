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
var request = require("request");
var assert = require("assert");
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
// main()
//------------------------------------------------------------------------------
// probar que se establece conexión
//------------------------------------------------------------------------------
describe("Test 2, probar que busca usuarios y dispositivos", function () {
  before(function () {
    console.log("preparación de los test");
  });
  //------------------------------------------------------------------------------
  // probar que obtieen el id de un usuario
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdUsuario", function (hecho) {
    request.get(
      {
        url: PUERTO_IP + "/obtenerIdUsuario?Correo=marc@marc.com",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(cargaJSON.id.toString(), "21", "¿El id no es 21?");
        hecho();
      }
    );
  }); //it()
  //------------------------------------------------------------------------------
  // probar que obtieen el id de un dispositivo
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdDispositivo", function (hecho) {
    request.get(
      {
        url: PUERTO_IP + "/obtenerIdDispositivo?Nombre=Sensorin",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(cargaJSON.id.toString(), "3", "¿El id no es 3?");
        hecho();
      }
    );
  }); //it()
  //------------------------------------------------------------------------------
  // probar que añade usuario_dispositivo
  //------------------------------------------------------------------------------
  it("probar POST /usuario_dispositivo", function (hecho) {
    var datos = { Correo: "david@david.com", Nombre: "Gas" };
    request.post(
      {
        url: PUERTO_IP + "/usuario_dispositivo",
        headers: {
          "User-Agent": "ClaudiaTorresCruz",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      },
      function (err, respuesta, carga) {
        assert.equal(err, null, "¿ha habido un error?");
        assert.equal(respuesta.statusCode, 201, "¿El código no es 201 (OK)");
        hecho();
      } // callback
    ); // .post
  }); // it
}); //()
