//--------------------------------------------------------------------------------
// admin.js
//
// Autora: Claudia Torres Cruz
// Fecha: 22/11/22
// Descripcion: funciones administrador
//------------------------------------------------------------------------------
const IP_PUERTO = "http://localhost:8080";
//------------------------------------------------------------------------------
window.onload = cargarEventos;
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de cargar las funciones que se inicial al cargar
 * la página
 * Diseño:  --> cargarEventos() -->
 **/
//------------------------------------------------------------------------------
function cargarEventos() {
  var url_string = window.location;
  var url = new URL(url_string);
  var id = url.searchParams.get("a");
  console.log(id);
  //var tabla = document.getElementById("tabla_usuarios").innerHTML = "";
  //let stringTabla = "<tr><th>Nombre</th><th>Correo</th><tr>"
  //var id = document.getElementById("id_administrador").value
  // llamo a la función de la lógica (versión fake)
  /*console.log("botonObtenerUsuarios")
    buscarUsuariosDeAdmin(6, function (res) {
        console.log("boton "+res)
        console.log(res)
        mostrarUsuarios(res);
    });*/
  buscarUsuariosDeAdmin(id, function (res) {
    mostrarUsuarios(res);
  });
}
//------------------------------------------------------------------------------
/**
 * BOTON DESHABILITADO
 * BOTON DESHABILITADO
 * BOTON DESHABILITADO
 * BOTON DESHABILITADO
 *
 * @brief este método se encarga de llamar a la función para obtener todos los
 * usuarios del admin
 * Diseño:  --> botonObtenerUsuario() -->
 **/
//------------------------------------------------------------------------------
//botonObtenerUsuarios()
function botonObtenerUsuario() {
  //var tabla = document.getElementById("tabla_usuarios").innerHTML = "";
  //let stringTabla = "<tr><th>Nombre</th><th>Correo</th><tr>"
  //var id = document.getElementById("id_administrador").value
  // llamo a la función de la lógica (versión fake)
  buscarUsuariosDeAdmin(6, function (res) {
    mostrarUsuarios(res);
  });
} //botonObtenerUsuario
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de obtener todos los usuarios del administrador
 * @param id_admin es el id del administrador
 * @return data [{id: int, nombre: string, contraseña: string, correo:string}..]
 * Diseño: id_admin:N --> buscarUsuariosDeAdmin() --> [{id: int, nombre: string, contraseña: string, correo:string}...]
 **/
//------------------------------------------------------------------------------
function buscarUsuariosDeAdmin(id_admin, cb) {
  fetch(IP_PUERTO + "/buscarUsuariosDeAdmin?id_admin=" + id_admin, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .catch((err) => console.log("Fetch failed " + err))
    .then((res) => res.json())
    .then((data) => {
      cb(data);
    });
} // buscarUsuariosDeAdmin()
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de eliminar un usuario
 * @param correo
 * Diseño: correo:Texto --> botonEliminarUsuario() --> 200 | Error
 **/
//------------------------------------------------------------------------------
function botonEliminarUsuario(correo) {
  var Correo_ = {
    Correo: correo,
  };
  var body_ = JSON.stringify(Correo_);
  console.log(JSON.stringify(Correo_));
  fetch(IP_PUERTO + "/borrarUsuario", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body_,
    mode: "cors",
  })
    .catch((err) => console.log("Fetch failed " + err))
    .then((res) => document.location.reload());
} // ()
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de obtener la fecha de última medida de un usuario
 * @param id_usuario
 * @return data [{fecha: Date}...]
 * Diseño: id_usuario --> obtenerUltimaMedida() --> [{fecha: Date}...]
 **/
//------------------------------------------------------------------------------
function obtenerUltimaMedida(id_usuario, cb) {
  fetch(IP_PUERTO + "/obtenerUltimaMedida?id_usuario=" + id_usuario, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .catch((err) => console.log("Fetch failed " + err))
    .then((res) => res.json())
    .then((data) => {
      cb(data);
    });
} // ()
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de mostrar todos los usuarios
 * @param res todos los usuarios
 * Diseño: res:[{id: int, nombre: string, contraseña: string, correo:string}...] --> mostrarUsuarios() -->
 **/
//------------------------------------------------------------------------------
function mostrarUsuarios(res) {
  let listaUsuarios = document.getElementById("lista_usuarios");
  listaUsuarios.innerHTML = "";
  var fechaAyer = new Date();
  fechaAyer.setDate(fechaAyer.getDate() - 1);
  if (res.length > 0) {
    res.forEach((usuario) => {
      obtenerUltimaMedida(usuario.id, function (res) {
        if (res.length < 1) {
          //document.getElementById(divfield).innerHTML +="<input type='button' value='-'class='remove_this"+i+"' onclick=' removed("+i+",\""+s+"\") '>"
          listaUsuarios.innerHTML +=
            "<li id='texto'>" +
            "<b>Nombre: </b>" +
            usuario.Nombre +
            "    " +
            "<b id='texto1'>Correo: </b>" +
            usuario.Correo +
            "    " +
            "<b id='texto1'> Fecha de la última medición: </b>" +
            "-" +
            "<input type='button' value='Eliminar' id='boton_eliminar" +
            "' onclick=' botonEliminarUsuario(\"" +
            usuario.Correo +
            "\") '>";
        } else {
          var d = new Date(res[0].Fecha);
          var datestring =
            d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
          console.log("antes if");
          if (Date.parse(d) < Date.parse(fechaAyer)) {
            console.log("dentro del if");
            var li = document.createElement(null);
            li.innerHTML =
              "<br><li id='texto' style='color:red'>" +
              "<b>Nombre: </b>" +
              usuario.Nombre +
              "    " +
              "<b id='texto1'>Correo: </b>" +
              usuario.Correo +
              "    " +
              "<b id='texto1'> Fecha de la última medición: </b>" +
              datestring +
              "<input type='button' value='Eliminar' id='boton_eliminar" +
              "' onclick=' botonEliminarUsuario(\"" +
              usuario.Correo +
              "\") '><br>";
            listaUsuarios.prepend(li);
          } else {
            listaUsuarios.innerHTML +=
              "<br><li id='texto'>" +
              "<b>Nombre: </b>" +
              usuario.Nombre +
              "    " +
              "<b id='texto1'>Correo: </b>" +
              usuario.Correo +
              "    " +
              "<b id='texto1'> Fecha de la última medición: </b>" +
              datestring +
              "<input type='button' value='Eliminar' id='boton_eliminar" +
              "' onclick=' botonEliminarUsuario(\"" +
              usuario.Correo +
              "\") '><br>";
          }
        }
      });
    });
  }
}
