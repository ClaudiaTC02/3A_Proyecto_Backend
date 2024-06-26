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
   * GET /obtenerUsuarios
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
  }); // get/ obtenerUsuarios
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
   * POST /borrarRegistros
   */
  //------------------------------------------------------------------------------
  servidor.post("/borrarRegistros", async function (peticion, respuesta) {
    console.log(" * POST /borrarRegistros ");
    const data = peticion.body;
    console.log(data);
    try {
      await logica.borrarRegistros(data);
      respuesta.sendStatus(201);
    } catch {
      respuesta.sendStatus(400);
    }
  }); // post /borrarRegistros
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
   * POST /enviarMail
   */
  //------------------------------------------------------------------------------
  servidor.post("/enviarMail", async function (peticion, respuesta) {
    console.log(" * POST /enviarMail");
    const data = peticion.body;
    console.log(data);
    try {
      await logica.enviarMail();
      respuesta.sendStatus(201);
    } catch {
      respuesta.sendStatus(400);
    }
  }); // post /enviarMail
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
      if(usuario != "No se pudo encontrar"){
        respuesta.send(JSON.stringify(usuario[0]));
      } else{
        respuesta.sendStatus(404).send("No se pudo encontrar ese usuario");
      }
    }
  }); // GET /verificarUsuario/?Correo=<texto>&Contraseña=<texto>
  //------------------------------------------------------------------------------
  /**
   * GET /obtenerIdUsuario/?Correo=<texto>
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
      if(usuario != "No se pudo encontrar"){
        respuesta.send(JSON.stringify(usuario[0]));
      } else{
        respuesta.sendStatus(404).send("No se pudo encontrar ese usuario");
      }
    }
  }); // GET /obtenerIdUsuario/?Correo=<texto>
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
      respuesta.sendStatus(404).send("No puedo encontrar ese dispositivo");
      return;
    } else {
      var dispositivo = await logica.obtenerIdDispositivo(nombre);
      if(dispositivo != "No se pudo encontrar"){
        respuesta.send(JSON.stringify(dispositivo[0]));
      } else{
        respuesta.sendStatus(404).send("No puedo encontrar ese dispositivo");
      }
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
  servidor.get("/obtenerFechaUltimaMedida", async function (peticion, respuesta) {
    console.log(" * GET /obtenerUltimaMedida");
    var id = peticion.query.id_usuario;
    console.log(id);
    if (id == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      var medida = await logica.obtenerFechaUltimaMedida(id);
      respuesta.send(JSON.stringify(medida));
    }
  }); // GET /obtenerUltimaMedida/?id_usuario=<texto>
    //------------------------------------------------------------------------------
  /**
   * GET /obtenerMediaMedidas/?id_usuario=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerMediaMedidas", async function (peticion, respuesta) {

    console.log(" * GET /obtenerMediaMedidas");
    var id = peticion.query.id_usuario;
    console.log(id);
    if (id == null) {
      respuesta.sendStatus(404).send("No se pudieron encontrar medidas");
      return;
    } else {
      try{
      var medida = await logica.obtenerMediaMedicionesDia(id);
      if(!Number.isNaN(medida)) {
        respuesta.send(JSON.stringify(medida));
      } else {
        respuesta.sendStatus(404).send("No se pudieron encontrar medidas");
      }
    } catch {
      respuesta.sendStatus(404).send("No se pudieron encontrar medidas");
    }
    }
  }); // GET /obtenerMediaMedidas/?id_usuario=<texto>
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
  //------------------------------------------------------------------------------
  /**
   * POST /actualizarUsuario/?correoa=<texto>
   */
  //------------------------------------------------------------------------------
  servidor.post("/actualizarUsuario", async function (peticion, respuesta) {
    var correo = peticion.body.Correo;
    var nombre = peticion.body.Nombre;
    var correoa = peticion.query.correoa;
    var contra = peticion.body.Contrasena;
    var admin = peticion.body.EsAdmin;
    //var foto = peticion.query.FotoPerfil;

    id_correo = await logica.obtenerIdUsuario(correoa);
    var id = id_correo[0].id;
    console.log(" * el usuario que se va a ctualizar " + id);

    if (id == null) {
      respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
      return;
    } else {
      console.log(" * POST /actualizarUsuario ");
      var usuario = await logica.actualizarUsuario(
        id,
        correo,
        nombre,
        contra,
        admin
      );
      respuesta.send(JSON.stringify(usuario[0]));
    }
  }); // POST /actualizarUsuario/?correoa=<texto>
  //------------------------------------------------------------------------------
  // GET /buscarDispositivoUsuario/?Id_Usuario=<texto>
  //------------------------------------------------------------------------------
  servidor.get(
    "/buscarDispositivoUsuario",
    async function (peticion, respuesta) {
      console.log(" * GET /buscarDispoitivo ");
      var idUsuario = peticion.query.Id_Usuario;

      if (idUsuario == null) {
        respuesta.sendStatus(404).send("no puedo encontrar ese usuario");
        return;
      } else {
        var dispositivo = await logica.buscarDispositivoUsuario(idUsuario);
        respuesta.send(JSON.stringify(dispositivo[0]));
      }
    }
  ); //GET /buscarDispositivoUsuario/?Id_Usuario=<texto>
  //------------------------------------------------------------------------------
  // GET /buscarDispositivoPorId/?Id_Dispositivo=<texto>
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
  //------------------------------------------------------------------------------
  // GET /buscarIdUsuarioPorCorreo/?correo=<texto>
  //------------------------------------------------------------------------------
  servidor.get(
    "/buscarIdUsuarioPorCorreo",
    async function (peticion, respuesta) {
      console.log(" * GET /buscarIdUsuarioPorCorreo");
      var correo = peticion.query.Correo;

      if (correo == null) {
        respuesta.sendStatus(404).send("no puedo encontrar este sensor");
        return;
      } else {
        var dispositivo = await logica.buscarDispositivoPorId(correo);
        respuesta.send(JSON.stringify(dispositivo[0]));
      }
    }
  ); //GET /buscarIdUsuarioPorCorreo/?correo=<texto>

  //------------------------------------------------------------------------------
  // GET /buscarDispositivosUsuarioPorCorreo/?correo=<texto>
  //------------------------------------------------------------------------------
  servidor.get(
    "/buscarDispositivosUsuarioPorCorreo",
    async function (peticion, respuesta) {
      console.log(" * GET /buscarDispositivoPorId");
      var correo = peticion.query.Correo;
      id_correo = await logica.obtenerIdUsuario(correo);
      var id = id_correo[0].id;
      const nombreDisp = [];
      if (correo == null) {
        respuesta.sendStatus(404).send("no puedo encontrar este sensor");
        return;
      } else {
        var dispositivo = await logica.buscarDispositivoUsuario(id);

        for (let i = 0; i < dispositivo.length; i++) {
          var a = i;
          var elid = dispositivo[a].Id_Dispositivo;
          nombreDisp[a] = await logica.buscarDispositivoPorId(elid);
        }
        respuesta.send(JSON.stringify(nombreDisp));
      }
    }
  ); //GET /buscarDispositivosUsuarioPorCorreo/?correo=<texto>
  //------------------------------------------------------------------------------
  /**
  * POST /medicion
  */
  //------------------------------------------------------------------------------
  servidor.post("/medicion", async function (peticion, respuesta) {
    console.log(" * POST /medicion ")
    var id = await logica.obtenerIdDispositivo(peticion.body.dispositivo)
    
    peticion.body.dispositivo = id[0].id;
    const data = peticion.body;
    console.log(data);
    try {
        await logica.insertarMedicion(data);
        console.log(data);
        respuesta.sendStatus(201);
    } catch {
        respuesta.sendStatus(400);
    }
  }) // post /medicion
  //------------------------------------------------------------------------------
  /**
  * GET /obtenerMediciones
  */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerMediciones", async function (peticion, res) {
    console.log(" * GET /obtenerMediciones ")
    //llamo a la función de la lógica adecuada
    var mediciones = await logica.obtenerMediciones();
    // si el array de mediciones tiene casillas todo fue bien
    if (mediciones.length > 0) {
      res.send(mediciones);
    } else {
      // 404: not found
      res.sendStatus(404);
    }
  }); // get//obtenerMediciones

  //------------------------------------------------------------------------------
  /**
  * GET /obtenerMedicionesDelDia
  */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerMedicionesDelDia", async function (peticion, res) {
    console.log(" * GET /obtenerMedicionesDelDia ")
    //llamo a la función de la lógica adecuada
    var mediciones = await logica.obtenerMedicionesDia();
    // si el array de mediciones tiene casillas todo fue bien
    if (mediciones.length > 0) {
      res.send(mediciones);
    } else {
      // 404: not found
      res.sendStatus(404);
    }
  }); // get//obtenerMediciones

  //------------------------------------------------------------------------------
  /**
  * GET /obtenerMedicionesDelDiaConFecha
  */
  //------------------------------------------------------------------------------
  servidor.get("/obtenerMedicionesDelDiaConFecha", async function (peticion, res) {
    console.log(" * GET /obtenerMedicionesDelDiaConFecha")
    //llamo a la función de la lógica adecuada
    var fecha= peticion.query.fecha
    var mediciones = await logica.obtenerMedicionesDiaConFecha(fecha);
    // si el array de mediciones tiene casillas todo fue bien
    if (mediciones.length > 0) {
      res.send(mediciones);
    } else {
      // 404: not found
      res.sendStatus(404);
    }
  }); // get//obtenerMediciones
}; //()
