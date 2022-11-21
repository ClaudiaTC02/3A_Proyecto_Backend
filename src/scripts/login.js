
const PUERTO_IP = "http://localhost:8080"

function buscarUsuario(correo, contrasena, cb){
    fetch(PUERTO_IP + "/buscarUsuario?Correo="+correo+"&Contrasena="+contrasena, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .catch((err) =>
          console.log("No se pudo recoger los datos del usuario" + err)
        )
        .then((res) => res.json())
        .then((resJSON) => {
          cb(resJSON);
        });
}

function login(){
    const correo= document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasenya').value;
    const boton = document.getElementById('boton_login');
    console.log(correo)
    boton.addEventListener('click', (e)=>{
        buscarUsuario(correo, contrasena, funcion(res))
            console.log(res)
        
    })
}
