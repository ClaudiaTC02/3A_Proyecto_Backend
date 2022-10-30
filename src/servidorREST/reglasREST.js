/**
 *
 * NOMBRE: reglas.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 30/10/2022
 * DESCRIPCIÓN: Este fichero se encarga de contactar con la base de datos y hacer las peticiones REST
 */
//------------------------------------------------------------------------------
const common = require("mocha/lib/interfaces/common");
//------------------------------------------------------------------------------
module.exports.cargar = function (servidor, logica) {
  //------------------------------------------------------------------------------
  /**
   *  GET /test
   */
  //------------------------------------------------------------------------------
  servidor.get("/test", function (peticion, res) {
    console.log("GET test");
    res.send("Parece que funciona");
  });
  //------------------------------------------------------------------------------
  /**
   * GET /obtenerUsuario
   */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerUsuarios", async function (peticion, res) {
    console.log("GET obtenerUsuarios");
    //llamo a la función de la lógica adecuada
    var usuarios = await logica.obtenerUsuarios();
    // si el array de mediciones tiene casillas todo fue bien
    if (usuarios.length > 0) {
      res.send(usuarios);
    } else {
      // 404: not found
      res.sendStatus(404);
    }
  }); // get/ getMediciones
  //------------------------------------------------------------------------------
  /**
   * POST /usuario
   */
  //------------------------------------------------------------------------------
    servidor.post("/usuario", async function (peticion, respuesta) {
      console.log(" * POST /usuario ")
      const data = peticion.body;
      try {
          await logica.insertarUsuario(data);
          respuesta.sendStatus(201);
      } catch {
          respuesta.sendStatus(400);
      }
  }) // post /medicion
}; //()