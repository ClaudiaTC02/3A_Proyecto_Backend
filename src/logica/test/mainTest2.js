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
    //------------------------------------------------------------------------------
    // probar que busca usuarios
    //------------------------------------------------------------------------------
  it("probando GET /obtenerIdUsuario", function (hecho) {
    request.get(
      {
        url: PUERTO_IP+"/obtenerIdUsuario?Correo=marc@marc.com",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(
          cargaJSON.Nombre.toString(),
          "Marc",
          "¿El nombre no es Marc?"
        );
        hecho();
      }
    );
  }); //it()    
  //------------------------------------------------------------------------------
  // probar que busca dispositivos
  //------------------------------------------------------------------------------
  it("probando GET /obtenerIdDispositivo", function (hecho) {
    request.get(
      {
        url: PUERTO_IP+"/obtenerIdDispositivo?Nombre=Sensorin",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(
          cargaJSON.Nombre.toString(),
          "Sensorin",
          "¿El nombre no es Sensorin?"
        );
        hecho();
      }
    );
  }); //it()
  
}); //()