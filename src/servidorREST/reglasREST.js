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
   * POST /usuario_dispositivo
   */
  //------------------------------------------------------------------------------
  servidor.post("/usuario_dispositivo", async function (peticion, respuesta) {
    console.log(" * POST /usuario_dispositivo ");
    const data = peticion.body;
    console.log(data);
    try {
      await logica.insertarUsuario_Dispositivo(data);
      respuesta.sendStatus(201);
    } catch {
      respuesta.sendStatus(400);
    }
  }); // post /usuario_dispositivo
  //------------------------------------------------------------------------------
  /**
   * GET /verificarUsuario/?Correo=<texto>&Contraseña=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/verificarUsuario", async function (peticion, respuesta) {
    console.log(" * GET /verificarUsuario ");
    var correo = peticion.query.Correo;
    console.log(correo);
    var contrasena = peticion.query.Contrasena;
    console.log(contrasena);
    if (correo == null && contrasena == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var usuario = await logica.verificarUsuario(correo, contrasena);
      respuesta.send(JSON.stringify(usuario[0]));
    }
  }); // GET /buscarUsuario/?Correo=<texto>&Contraseña=<texto>
  //------------------------------------------------------------------------------
  /**
   * GET /verificarUsuario/?Correo=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerIdUsuario", async function (peticion, respuesta) {
    console.log(" * GET /obtenerIdUsuario ");
    var correo = peticion.query.Correo;
    console.log(correo);
  
    if (correo == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var usuario = await logica.obtenerIdUsuario(correo);
      respuesta.send(JSON.stringify(usuario[0]));
    }
  }); // GET /buscarUsuario/?Correo=<texto>
    //------------------------------------------------------------------------------
  /**
   * GET /obtenerIdDispositivo/?Nombre=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerIdDispositivo", async function (peticion, respuesta) {
    console.log(" * GET /obtenerIdDispositivo ");
    var nombre = peticion.query.Nombre;
    console.log(nombre);
  
    if (nombre == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese dispositivo");
      return;
    } else {
      var dispositivo = await logica.obtenerIdDispositivo(nombre);
      respuesta.send(JSON.stringify(dispositivo[0]));
    }
  }); // GET /obtenerIdDispositivo/?Nombre=<texto>
    //------------------------------------------------------------------------------
  /**
   * GET /buscarUsuariosDeAdmin/?id_admin=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/buscarUsuariosDeAdmin", async function (peticion, respuesta) {
    console.log(" * GET /buscarUsuario ");
    var id_admin = peticion.query.id_admin;
    console.log(id_admin);
    if (id_admin == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var usuario = await logica.buscarUsuariosDeAdmin(id_admin);
      respuesta.send(JSON.stringify(usuario));
    }
  }); // GET /buscarUsuariosDeAdmin/?id_admin=<texto>
      //------------------------------------------------------------------------------
  /**
   * GET /obtenerUltimaMedida/?id_usuario=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerUltimaMedida", async function (peticion, respuesta) {
    console.log(" * GET /obtenerUltimaMedida");
    var id = peticion.query.id_usuario;
    console.log(id);
    if (id == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var medida = await logica.obtenerUltimaMedida(id);
      respuesta.send(JSON.stringify(medida));
    }
  }); // GET /obtenerUltimaMedida/?id_usuario=<texto>
  //------------------------------------------------------------------------------
  /**
   * POST /borrarUsuario/?correo=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.post("/borrarUsuario", async function (peticion, respuesta) {
    console.log(" * GET /borrarUsuario ");
    var correo = peticion.body.Correo;
    console.log(peticion.body);
    console.log(correo);
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
    var correoa = peticion.query.correoa;
    var contra = peticion.query.Contrasena;
    var admin = peticion.query.EsAdmin;
    //var foto = peticion.query.FotoPerfil;
     id_correo= await logica.obtenerIdUsuario(correoa)
    var id =id_correo[0].id;
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
  //------------------------------------------------------------------------------
   // GET /buscarDispositivoUsuario/?Id_Usuario=<texto>
  //------------------------------------------------------------------------------

    servidor.get("/buscarDispositivoUsuario", async function (peticion, respuesta) {
    console.log(" * GET /buscarDispoitivo ");
    var idUsuario = peticion.query.Id_Usuario;
    
    if (idUsuario == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var dispositivo = await logica.buscarDispositivoUsuario(idUsuario);
      respuesta.send(JSON.stringify(dispositivo[0]));
    }
  }); 
  // GET /buscarDispositivoUsuario/?Id_Usuario=<texto>
  //------------------------------------------------------------------------------
  servidor.get("/buscarDispositivoPorId", async function (peticion, respuesta) {
    console.log(" * GET /buscarDispositivoPorId");
    var idSensor = peticion.query.Id_Dispositivo;
    
    if (idSensor == null) {
      respuesta.sendStatus(404).send("no puedo encontrar este sensor");
      return;
    } else {
      var dispositivo = await logica.buscarDispositivoPorId(idSensor);
      respuesta.send(JSON.stringify(dispositivo[0]));
    }
  }); 
   // GET /buscarDispositivoUsuario/?Id_Usuario=<texto>
  //------------------------------------------------------------------------------
  servidor.get("/buscarIdUsuarioPorCorreo", async function (peticion, respuesta) {
    console.log(" * GET /buscarDispositivoPorId");
    var correo = peticion.query.Correo;
    
    if (correo == null) {
      respuesta.sendStatus(404).send("no puedo encontrar este sensor");
      return;
    } else {
      var dispositivo = await logica.buscarDispositivoPorId(correo);
      respuesta.send(JSON.stringify(dispositivo[0]));
    }
  }); 

}; //()
