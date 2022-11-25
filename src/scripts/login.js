

const PUERTO_IP = "http://localhost:8080"




function login(){
    const correo= document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasenya').value;
    const boton = document.getElementById('boton_login');
    console.log(correo);
    verificarUsuario(correo,contrasena,function (res) {
        if(res.EsAdmin == true){
            console.log(res.id);
            window.location.href = "admin.html?a="+ res.id;   
        }else{
            window.location.href = "index.html?a=";
        }
      
    });
   
    
}

function verificarUsuario(correo,contrasena,cb) {
  fetch(PUERTO_IP + "/verificarUsuario?Correo="+correo+"&Contrasena="+contrasena, {
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