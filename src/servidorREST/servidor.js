/**
 *
 * NOMBRE: servidor.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 30/10/2022
 * DESCRIPCIÓN: Este fichero contiene las características del servidor REST
 */
//------------------------------------------------------------------------------
const express = require("express");
const Logica = require("../logica/logica.js");
//------------------------------------------------------------------------------
/**
 * @param bbdd
 * @param usuario
 * @param host
 * @param puerto
 * @param dialecto
 * @return objeto Logica
 * Diseño: bbdd: texto, usuario: texto, host: texto, puerto: Z, dialecto: texto --> cargarLogica() --> Logica
 */
//------------------------------------------------------------------------------
function cargarLogica(bbdd, usuario, host, puerto, dialecto) {
  return new Logica(bbdd, usuario, host, puerto, dialecto);
}
//------------------------------------------------------------------------------
/**
 * @brief esta función se encarga de arrancar el servidor rest adecuadamente
 * Diseño: --> main() -->
 */
//------------------------------------------------------------------------------
async function main() {
  let logica
  var reglas = require("./reglasREST.js");
  //var medicion = logica.cargarModeloMedicion();
  //creo el servidor
  const isTestMode = process.env.NODE_ENV === 'test';
  var servidorExpress = express();
  if(isTestMode){
    //db de pruebas
    logica = cargarLogica("gti3a_test", "root", "localhost", 3306, "mysql");
  } else{
    logica = cargarLogica("gti3a_proyecto", "root", "localhost", 3306, "mysql");
  }
  // para poder acceder a la carga de la peticion
  servidorExpress.use(express.json());
  servidorExpress.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, DELETE"
    );
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });
  //Cargo las reglas rest
  reglas.cargar(servidorExpress, logica);
  // arranco el servidor
  var servicio = servidorExpress.listen(8080, function () {
    console.log("Servidor REST conectado en el puerto 8080");
  });
  // capturo control-c para cerrar el servicio ordenadamente
  process.on("SIGINT", function () {
    console.log(" terminando servicio... ");
    servicio.close();
  });
  module.exports = servicio;
} // main()
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
main();