const PUERTO_IP = "http://localhost:8080"



function setCookie(name, value, expires, path, domain, secure) {
    let cookieString = name + "=" + encodeURIComponent(value);
  
    if (expires) {
      let expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + expires * 1000);
      cookieString += ", expires=" + expirationDate.toGMTString();
    }
  
    if (path) {
      cookieString += ", path=" + path;
    }
  
    if (domain) {
      cookieString += ", domain=" + domain;
    }
  
    if (secure) {
      cookieString += ", secure";
    }
    console.log("llego aqui")
    document.cookie = cookieString;
  }

function login(){
    const correo= document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasenya').value;
    const boton = document.getElementById('boton_login');
    console.log(correo);
    verificarUsuario(correo,contrasena,function (res) {
        if(res.EsAdmin == true){
            console.log(res.id);
            console.log(res.Nombre);
            setCookie("login", res.Nombre);
            window.location.href = "admin.html?a="+ res.id;   
        }else{
            window.location.href = "index.html?a=";
            alert("El nombre de usuario o la contraseña son incorrectos");
        }
      
    });
   
    
}
//------------------------------------------------------------------------------
/**
 * @brief Esta funcion se encarga de comprobar si los credenciales son correctos y redirigir al usuario segun su nivel de acceso 
 * @param correo, contrasena
 * Diseño:  correo:String, contrasena:String --> verificarUsuario() -->
 **/
//------------------------------------------------------------------------------
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
