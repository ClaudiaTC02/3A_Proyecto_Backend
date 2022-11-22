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
    console.log(" * POST /usuario ");
    const data = peticion.body;
    console.log(data);
    try {
      await logica.insertarUsuario(data);
      respuesta.sendStatus(201);
    } catch {
      respuesta.sendStatus(400);
    }
  }); // post /usuario
  //------------------------------------------------------------------------------
  /**
   * GET /buscarUsuario/?Correo=<texto>&Contraseña=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/buscarUsuario", async function (peticion, respuesta) {
    console.log(" * GET /buscarUsuario ");
    var correo = peticion.query.Correo;
    console.log(correo);
    var contrasena = peticion.query.Contrasena;
    console.log(contrasena);
    if (correo == null && contrasena == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var usuario = await logica.buscarUsuario(correo, contrasena);
      respuesta.send(JSON.stringify(usuario[0]));
    }
  }); // GET /buscarUsuario/?Correo=<texto>&Contraseña=<texto>
  //------------------------------------------------------------------------------
  /**
   * POST /borrarUsuario/?correo=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.post("/borrarUsuario", async function (peticion, respuesta) {
    console.log(" * GET /borrarUsuario ");
    var correo = peticion.body.Correo;
    try {
      await logica.borrarUsuario(correo);
      respuesta.sendStatus(200);
    } catch {
      respuesta.sendStatus(400);
    }
  }); // POST /borrarUsuario/?correo=<texto>
  servidor.get("/actualizarUsuario", async function (peticion, respuesta) {
    var correo = peticion.query.Correo;
    var nombre = peticion.query.Nombre;
    var id = peticion.query.id;
    var contra = peticion.query.Contrasena;
    var admin = peticion.query.EsAdmin;
    //var foto = peticion.query.FotoPerfil;
    
    console.log(" * el usuario que se va a ctualizar" +id);

    if (id == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      console.log(" * POST /actualizarUsuario ");
      var usuario = await logica. actualizarUsuario(id,correo,nombre,contra,admin);
      respuesta.send(JSON.stringify(usuario[0]));
    }
     
      
  }); // PUT /actualizarUsuario/?Correo=<texto>&Contraseña=<texto>
}; //()
