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
    llenarLista(res);
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
    llenarLista(res);
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
function compararFechas(a, b) {
  // Convierte las fechas en objetos Date
  const dateA = new Date(a.fecha);
  const dateB = new Date(b.fecha);
  console.log("hola")
  // Compara las fechas y devuelve un número negativo si la fecha A es anterior a la fecha B,
  // un número positivo si la fecha A es posterior a la fecha B, y 0 si son iguales
  return dateA - dateB;
}
//------------------------------------------------------------------------------
/**
 * @brief este método se encarga de mostrar todos los usuarios
 * @param res todos los usuarios
 * Diseño: res:[{id: int, nombre: string, contraseña: string, correo:string}...] --> mostrarUsuarios() -->
 **/
//------------------------------------------------------------------------------
function llenarLista(res) {
  /*let listaUsuarios = document.getElementById("lista_usuarios");
  listaUsuarios.innerHTML = "";*/
  if (res.length > 0) {
    var listaUsuarioFecha = []
    var listaUsuarioSinFecha = []
    res.forEach(function(usuario, idx, array) {
      obtenerUltimaMedida(usuario.id, function (res) {
        if(res.length < 1){
          var usuarioFecha = {
            nombre: usuario.Nombre,
            correo: usuario.Correo, 
            fecha: "-"
          }
          listaUsuarioSinFecha.push(usuarioFecha);
        } else{
          var d = new Date(res[0].Fecha);
          var datestring =
            d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
          var usuarioFecha = {
            nombre: usuario.Nombre,
            correo: usuario.Correo,
            fecha: d
          }
          listaUsuarioFecha.push(usuarioFecha)
        }
        console.log("acabo?")
        if (idx === array.length - 1){ 
          listaUsuarioFecha.sort(compararFechas);
          console.log(listaUsuarioFecha)
          listaUsuarioFecha.push(...listaUsuarioSinFecha);
          ponerDatosEnTabla(listaUsuarioFecha)
        }
      });
    });
  }
}
function ponerDatosEnTabla(lista){
  var fechaAyer = new Date();
  fechaAyer.setDate(fechaAyer.getDate() - 1);
  console.log(lista)
  // Obtener el elemento <table> en el que se quiere agregar los elementos
  var miTabla = document.getElementById("tabla_usuarios");
  // Iterar sobre el array JSON
  for (var i = 0; i < lista.length; i++) {
    // Crear una nueva fila
    var tr = document.createElement("tr");
    // Crear dos nuevas celdas
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var button = document.createElement(null)
    button.innerHTML = "<input type='button' value='Eliminar' id='boton_eliminar" +
    "' onclick=' botonEliminarUsuario(\"" +
    lista[i].correo +
    "\") '><br>";
    // Establecer el contenido de las celdas como la información del elemento del array JSON
    console.log(lista[i])
    td1.innerHTML = lista[i].nombre;
    td2.innerHTML = lista[i].correo;
    var datestring = "-"
    if(lista[i].fecha != "-"){
      var d = new Date(lista[i].fecha);
      datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
      if (Date.parse(d) < Date.parse(fechaAyer)){
        td1.style.color = 'red'
        td2.style.color = 'red'
        td3.style.color = 'red'
      }
    }
    td3.innerHTML = datestring;
    td4.appendChild(button)
    // Agregar las celdas a la fila
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    // Agregar la fila a la tabla
    miTabla.appendChild(tr);
  }
}