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
function cargarEventos(){
    //var tabla = document.getElementById("tabla_usuarios").innerHTML = "";
    //let stringTabla = "<tr><th>Nombre</th><th>Correo</th><tr>"
    //var id = document.getElementById("id_administrador").value
    // llamo a la función de la lógica (versión fake)
    console.log("botonObtenerUsuarios")
    buscarUsuariosDeAdmin(6, function (res) {
        console.log("boton "+res)
        console.log(res)
        mostrarUsuarios(res);
    });
} 
//botonObtenerUsuarios()
function botonObtenerUsuario() {
    //var tabla = document.getElementById("tabla_usuarios").innerHTML = "";
    //let stringTabla = "<tr><th>Nombre</th><th>Correo</th><tr>"
    //var id = document.getElementById("id_administrador").value
    // llamo a la función de la lógica (versión fake)
    buscarUsuariosDeAdmin(6, function (res) {
        mostrarUsuarios(res);
    });
}

function buscarUsuariosDeAdmin(id_admin,cb) {
    fetch(IP_PUERTO + "/buscarUsuariosDeAdmin?id_admin="+id_admin, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .catch((err) => console.log('Fetch failed ' + err))
        .then((res) => res.json())
        .then(data => {
            cb(data)
        })
} // ()

function mostrarUsuarios(res) {
    let listaUsuarios = document.getElementById("lista_usuarios");
    listaUsuarios.innerHTML = "";
    if(res.length > 0) {
        res.forEach((usuario) => {
            listaUsuarios.innerHTML +=
            "<li>" + "<b>Nombre: </b>"+ usuario.Nombre + "    "+ "<b>Correo: </b>" + usuario.Correo + " "+ '<input type="button" value="Eliminar" onclick="'+botonObtenerUsuario()+'">';
        });
    }
}