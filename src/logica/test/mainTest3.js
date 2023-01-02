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
/*describe("Test 3, probar que busca medidas", function () {
    //------------------------------------------------------------------------------
    // probar que obtiene medidas
    //------------------------------------------------------------------------------
    it("probando GET /obtenerFechaUltimaMedida", function (hecho) {
        request.get(
          {
            url: PUERTO_IP+"/obtenerFechaUltimaMedida?id_usuario=40",
            headers: { "User-Agent": "ClaudiaTorresCruz" },
          },
          function (err, res, carga) {
            assert.equal(err, null, "¿Ha fallado algo?");
            assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
            var cargaJSON = JSON.parse(carga);
            assert.equal(
              cargaJSON[0].Fecha.toString(),
              "2023-01-01T17:19:09.000Z",
              "La fecha no es 2023-01-01T17:19:09.000Z?"
            );
            hecho();
          }
        );
      }); //it()
          //------------------------------------------------------------------------------
    // probar que obtiene medidas
    //------------------------------------------------------------------------------
    it("probando GET /obtenerMediaMedidas", function (hecho) {
      request.get(
        {
          url: PUERTO_IP+"/obtenerMediaMedidas?id_usuario=40",
          headers: { "User-Agent": "ClaudiaTorresCruz" },
        },
        function (err, res, carga) {
          console.log("hola");
          assert.equal(err, null, "¿Ha fallado algo?");
          console.log("hola");
          assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
          var cargaJSON = JSON.parse(carga);
          console.log(cargaJSON.toString());
          assert.equal(
            cargaJSON.toString(),
            "12.5",
            "¿El valor no es 12.5?"
          );
          hecho();
        }
      );
    }); //it()
}); //()*/