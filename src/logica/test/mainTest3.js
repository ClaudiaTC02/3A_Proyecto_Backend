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
describe("Test 3, probar que busca medidas", function () {
    //------------------------------------------------------------------------------
    // probar que obtiene medidas
    //------------------------------------------------------------------------------
    it("probando GET /obtenerUltimaMedida", function (hecho) {
        request.get(
          {
            url: PUERTO_IP+"/obtenerUltimaMedida?id_usuario=7",
            headers: { "User-Agent": "ClaudiaTorresCruz" },
          },
          function (err, res, carga) {
            assert.equal(err, null, "¿Ha fallado algo?");
            assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
            var cargaJSON = JSON.parse(carga);
            assert.equal(
              cargaJSON[0].Dato.toString(),
              "20",
              "¿El dato no es 20?"
            );
            hecho();
          }
        );
      }); //it()
}); //()