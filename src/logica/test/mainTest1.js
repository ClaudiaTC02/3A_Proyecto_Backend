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
describe("Test 1, probar insertar, ver y borrar usuarios", function () {
  it("probando GET /test", function (hecho) {
    request.get(
      {
        url: PUERTO_IP + "/test",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        assert.equal(
          carga,
          "Parece que funciona",
          "¿La carga no es 'Parece que funciona'?"
        );
        hecho();
      }
    );
  }); //it()
  //------------------------------------------------------------------------------
  // probar que añade usuarios
  //------------------------------------------------------------------------------
  it("probar POST /usuario", function (hecho) {
    var datos = {id:"",Nombre:"Claudia",Contraseña:"1234",Correo:"prueba@prueba.com"}
    request.post({ url : PUERTO_IP+"/usuario",
        headers : { "User-Agent" : "ClaudiaTorresCruz" , "Content-Type" : "application/json" },
        body : JSON.stringify( datos )
        },
        function( err, respuesta, carga ) {
            assert.equal( err, null, "¿ha habido un error?" )
            assert.equal( respuesta.statusCode, 201, "¿El código no es 201 (OK)" )
            hecho()
        } // callback
    ) // .post
}) // it
  //------------------------------------------------------------------------------
  // probar que obtiene usuarios
  //------------------------------------------------------------------------------
  it("probando GET /obtenerUsuarios", function (hecho) {
    request.get(
      {
        url: PUERTO_IP + "/obtenerUsuarios",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(
          cargaJSON[0].Nombre.toString(),
          "Claudia",
          "¿El primer nombre no es Claudia?"
        );
        hecho();
      }
    );
  }); //it()
    //------------------------------------------------------------------------------
  // probar que busca usuarios
  //------------------------------------------------------------------------------
  it("probando GET /buscarUsuario", function (hecho) {
    request.get(
      {
        url: PUERTO_IP+"/buscarUsuario?Correo=prueba@prueba.com&Contrasena=1234",
        headers: { "User-Agent": "ClaudiaTorresCruz" },
      },
      function (err, res, carga) {
        assert.equal(err, null, "¿Ha fallado algo?");
        assert.equal(res.statusCode, 200, "¿El código no es 200 (OK)");
        var cargaJSON = JSON.parse(carga);
        assert.equal(
          cargaJSON.Nombre.toString(),
          "Claudia",
          "¿El nombre no es Claudia?"
        );
        hecho();
      }
    );
  }); //it()
    //------------------------------------------------------------------------------
  // probar que elimina usuarios
  //------------------------------------------------------------------------------
  it("probar POST /borrarUsuario", function (hecho) {
    var datos = {id:"",Nombre:"Claudia",Contraseña:"1234",Correo:"prueba@prueba.com"}
    request.post({ url : PUERTO_IP+"/borrarUsuario",
        headers : { "User-Agent" : "ClaudiaTorresCruz" , "Content-Type" : "application/json" },
        body : JSON.stringify( datos )
        },
        function( err, respuesta, carga ) {
            assert.equal( err, null, "¿ha habido un error?" )
            assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
            hecho()
        } // callback
    ) // .post
}) // it
}); //()