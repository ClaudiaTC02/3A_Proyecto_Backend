//--------------------------------------------------------------------------------
// mapas.js
//
// Autor: Enrique Ferre Carbonell
// Fecha: 28/12/22
// Descripcion: funciones del mapa
//------------------------------------------------------------------------------

//muestra las medidas de hoy nada mas cargar la pagina
window.onload = mostrarMedidasOzono;

//variable para las peticiones
const IP_PUERTO = "http://localhost:8080";
//esta variable muestra las coordenadas y el zoom (las cooordenadas que va entre los parentesis van a ser latitud y longitud)
let map=L.map('map').setView([38.995026, -0.164651],8)

//esta es la variable que almacena la capa de puntos que anyadiremos al mapa
var points = L.layerGroup().addTo(map);
var medidasind = L.layerGroup().addTo(map);
//grupo de capas para almacenar el nitrogeno
var GroupNitrogeno = L.layerGroup().addTo(map);
var nitrogenoInd  =L.layerGroup().addTo(map);
//grupo de capas para almacenar las capas de dioxido de carbono
var grupoDioxido = L.layerGroup().addTo(map);
var dioxidoInd= L.layerGroup().addTo(map);
//layer controler para visualizar los contaminantes
var groupedLayerGroupOzono = L.layerGroup([points, medidasind]);
var groupedLayerGroupNitrogeno = L.layerGroup([GroupNitrogeno, nitrogenoInd]);
var groupedLayerGroupDioxido = L.layerGroup([ grupoDioxido, dioxidoInd]);
//anyadimos un mapa base de open streetmaps
var osm= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
})
osm.addTo(map)

var todo=[]//variable que se encargará de almacenar todas las consultas

//------------------------------------------------------------------------------
/**
 * @brief esta funcion se encarga de obtener todas las medidas de hoy de la base de datos en una lista
 * Diseño: --> buscarMedidas() --> [{id: int, Dato: double, fecha: date, latitud:double...}...]
 **/
//------------------------------------------------------------------------------
async function buscarMedidas() {
  return new Promise(function(resolve, reject) {
    fetch(IP_PUERTO + "/obtenerMedicionesDelDia", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((err) => console.log("Fetch failed " + err))
      .then((res) => res.json())
      .then((data) => {
        var listaDentro = [];
        data.forEach(function (medida) {
          var lng = medida.Longitud;
          var lat = medida.Latitud;
          var name = medida.Dato;
          var tipoGase = medida.Id_Dispositivo;
          listaDentro.push([lat,lng,name,tipoGase])
        });
        resolve(listaDentro);
      });
  });
}
//------------------------------------------------------------------------------
/**
 * @brief esta funcion se encarga de mostrar las medidas de hoy correspondientes al ozono
 * Diseño: --> mostrarMedidasOzono()  
 **/
//------------------------------------------------------------------------------
async function mostrarMedidasOzono(){
  var listaDentro =[]
  listaDentro.splice(0,  listaDentro.length)
  listaDentro= await buscarMedidas();
  
  var listaPortipoOzono= ordenarPortipo(listaDentro,5)
  var listaOrdenadaOzono= ordenarGrupos(listaPortipoOzono)
  var listasolocoordenadasOzono= ordenarGruposCoord(listaPortipoOzono)
  creadordecluster(listaOrdenadaOzono,points)
  hacermapaDeCalorInd(listasolocoordenadasOzono,listaOrdenadaOzono,medidasind)
  hacermapaDeCalor(listasolocoordenadasOzono,listaOrdenadaOzono,points)
  
  map.on('zoomend', function() {
    if (map.getZoom() <= 17 && map.hasLayer(groupedLayerGroupOzono)) {
      points.addTo(map);
    } else {
      map.removeLayer(points);
    }
  });
  map.on('zoomend', function() {
    if (map.getZoom() >= 15) {
      medidasind.addTo(map)&& map.hasLayer(groupedLayerGroupOzono);
    } else {
      map.removeLayer(medidasind);
    }
  });

}// fin mostrarMedidasOzono
//------------------------------------------------------------------------------
/**
 * @brief esta funcion se encarga de mostrar las medidas de hoy correspondientes al nitrogeno
 * Diseño: --> mostrarMedidasNitrogeno() 
 **/
//------------------------------------------------------------------------------
async function mostrarMedidasNitrogeno(){
  var listaDentro = await buscarMedidas();
  var listaPortipoNitrogeno= ordenarPortipo(listaDentro,3)
  var listaOrdenadaNitrogeno= ordenarGrupos(listaPortipoNitrogeno)
  var listasolocoordenadasNitrogeno= ordenarGruposCoord(listaPortipoNitrogeno)
  creadordecluster(listaOrdenadaNitrogeno,GroupNitrogeno)
  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoInd)
  hacermapaDeCalor(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno,GroupNitrogeno)
  map.on('zoomend', function() {
    if (map.getZoom() <= 17 && map.hasLayer(groupedLayerGroupNitrogeno)) {
      GroupNitrogeno.addTo(map);
    } else {
      map.removeLayer(GroupNitrogeno)&& map.hasLayer(GroupNitrogeno);
    }
  });
  map.on('zoomend', function() {
    if (map.getZoom() >= 15 && map.hasLayer(groupedLayerGroupNitrogeno)) {
      nitrogenoInd.addTo(map);
    } else {
      map.removeLayer(nitrogenoInd);
    }
  });
    //--Fin Gas Nitrogeno()---------------------------------------
 
}// fin mostrarMedidasNitrogeno
//------------------------------------------------------------------------------
/**
 * @brief esta funcion se encarga de mostrar las medidas de hoy correspondientes al co2
 * Diseño: --> mostrarMedidasDioxidoCarbono()
 **/
//------------------------------------------------------------------------------
async function mostrarMedidasDioxidoCarbono(){
  var listaDentro = await buscarMedidas();
  var listaPortipoDioxido= ordenarPortipo(listaDentro,2)
  var listaOrdenadaDioxido= ordenarGrupos(listaPortipoDioxido)
  var listasolocoordenadasDioxido= ordenarGruposCoord(listaPortipoDioxido)
  creadordecluster(listaOrdenadaDioxido,grupoDioxido)
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoInd)
  hacermapaDeCalor( listasolocoordenadasDioxido,listaOrdenadaDioxido,grupoDioxido)
 
}// fin mostrarMedidasdioxido de carbono

//le atribuimos al conjunto de capas de puntos globales e individuales llamar a la funcion
//que muestre sus medidas cuando las seleccionemos
groupedLayerGroupDioxido.addEventListener('add', function() {
  mostrarMedidasDioxidoCarbono()
});
groupedLayerGroupNitrogeno.addEventListener('add', function() {
   mostrarMedidasNitrogeno()
});
//anyadimos los componentes del controlador con sus respectivos gases
var baseMaps ={
  //"Dióxido de carbono": ,
  "Ozono": groupedLayerGroupOzono,
  "Óxido de nitrógeno": groupedLayerGroupNitrogeno,
  "Dióxido de carbono": groupedLayerGroupDioxido,
}

//le atribuimos al conjunto de capas de puntos globales e individuales llamar a la funcion
//que muestre sus medidas cuando las seleccionemos
groupedLayerGroupOzono.addEventListener('add', function() {
  mostrarMedidasOzono()
});
//anyadimos este el ultimo para que se muestre primero y salga seleccionado nada mas cargue la pagina
groupedLayerGroupOzono.addTo(map)

//------------------------------------------------------------------------------
/**
 * @brief esta funcion recibe una lista de todas las medidas y el id del sensor para saber como clasificarlos
 * Diseño: <medidas> R --> ordenarPortipo() --><medidas>
 **/
//------------------------------------------------------------------------------
function ordenarPortipo(lista,tipo){
 
  var listaIgual=[]
  for(var i=0;i<lista.length;i++){
    
    if(lista[i][3]==tipo){
      
      listaIgual.push(lista[i])
    }
  }
  return listaIgual
}

//------------------------------------------------------------------------------
/**
 * @brief esta funcion agrupa los puntos de la lista ya seleccionada anteriormente clasificandolos por su proximidad
 * Diseño: <lista> --> ordenarPortipo()--> <lista>
 **/
//------------------------------------------------------------------------------
function ordenarGrupos(lista){
 
  var listaOrdenada=[]
    
  var elemento=[]
    var listaFinal=[]
  var incluido=false
  
  for(var i=0;i<lista.length;i++){
    for(var j=i;j<lista.length;j++){
      var calculodistancia= Math.sqrt(((lista[j][0]-lista[i][0])*(lista[j][0]-lista[i][0]))+((lista[j][1]-lista[i][1])*(lista[j][1]-lista[i][1])))
      
      if(listaOrdenada.includes(lista[j][0] && lista[j][1])){
        
        incluido=true
      }else{
        incluido=false
      }
        
      if(calculodistancia<=0.006 && incluido==false){
        
        elemento.push([lista[j][0],lista[j][1],lista[j][2]])
      }
    }
    if(elemento.length != 0){
      
      listaOrdenada[i]= [].concat(elemento)
    }
    
    elemento.splice(0,  elemento.length)
    
  }
  var cont=0
  for(var i=0;i<listaOrdenada.length;i++){
    
    if(i==0){
      listaFinal.push(listaOrdenada[i])
      cont=cont+listaOrdenada[i].length
      
    }
    
    if(i==cont){
      listaFinal.push(listaOrdenada[i])
      
    }
   
  }
  
  return listaFinal
}

//------------------------------------------------------------------------------
/**
 * @brief similar a la funcion anterior, pero solo devuelve una lista con lat y long 
 * Diseño: <lista> --> ordenarGruposCoor()--> <lista>
 **/
//------------------------------------------------------------------------------
function ordenarGruposCoord(lista){
  var listaOrdenada=[]
    
  var elemento=[]
    var listaFinal=[]
  var incluido=false
  
  for(var i=0;i<lista.length;i++){
    for(var j=i;j<lista.length;j++){
      var calculodistancia= Math.sqrt(((lista[j][0]-lista[i][0])*(lista[j][0]-lista[i][0]))+((lista[j][1]-lista[i][1])*(lista[j][1]-lista[i][1])))
      
      if(listaOrdenada.includes(lista[j][0] && lista[j][1])){
        
        incluido=true
      }else{
        incluido=false
      }
        
      if(calculodistancia<=0.006 && incluido==false){
        
        elemento.push([lista[j][0],lista[j][1]])
      }
    }
    if(elemento.length != 0){
      listaOrdenada[i]= [].concat(elemento)
    }
    
    elemento.splice(0,  elemento.length)
    
  }
  var cont=0
  for(var i=0;i<listaOrdenada.length;i++){
    
    if(i==0){
      listaFinal.push(listaOrdenada[i])
      cont=cont+listaOrdenada[i].length
    }
    
    if(i==cont){
      listaFinal.push(listaOrdenada[i])
    }
   
  }
  
  return listaFinal
}

//------------------------------------------------------------------------------
/**
 * @brief funcion que recibe una lista filtrada de puntos un mismo tipo de medida de gas
 * y los anyade en el mapa
 * Diseño: <lista>, R --> creadordecluster()
 **/
//------------------------------------------------------------------------------
function creadordecluster(lista,tipo){
  var clusterGroups = [];//lista que almacena la grupacion de puntos
  var listar=[]//lista para obtener cada lista de elementos ordenados
  var listacoord=[]//lista para obtener solo coordenadas
  var listamedia=[]//lista para guardar todas las medidas y sacar una media

  for(var j=0;j<lista.length;j++){
    
    //sirve para sacar los elementos del array
    for(var i = 0; i < lista[j].length; i++) {
      listar.push(lista[j][i])
      
    }
    //sirve par hacer un array solo de latitudes y longitudes
    for(var i = 0; i < lista[j].length; i++) {
      listacoord.push([listar[i][0],listar[i][1]])
      listamedia.push(listar[i][2])//esto sirve para sacar las medias
    }
    var suma=0
    for(var i = 0; i < listamedia.length; i++) {
      suma=suma+listamedia[i]
    }
   
    for(var i = 0; i < lista[j].length; i++){
      // create a marker cluster group for the point
      var clusterGroup = L.markerClusterGroup();

      clusterGroup.addLayer(L.marker(listacoord[i]));
      
      // add the cluster group to the array
      clusterGroups.push(clusterGroup);
      clusterGroup.addTo(tipo)
     
    }
    //limpliamos todas las listas
    listar.splice(0,  listar.length)
    listacoord.splice(0,  listacoord.length)
    clusterGroups.splice(0,clusterGroup.length)
    listamedia.splice(0,listamedia.length)
   
    
  }
  
}

//------------------------------------------------------------------------------
/**
 * @brief funcion que recibe una lista filtrada de puntos un mismo tipo de medida de gas
 * otra igual pero solo de coordenadas y el tipo de gas que es y crea un mapa de calor 
 * a partir de la media entre las medidas mas cercanas
 * Diseño: <lista>,<lista>, R --> chacermapaDeCalor()
 **/
//------------------------------------------------------------------------------
function hacermapaDeCalor(listacoord,listamed,tipo){
  var heatLayers = [];//lista de maps de calor
  var listapuntosExtra=[]//lista de los puntos extra fakeados
  
  //el primer for recorre la listas de listas de solo coordenadas
  for(var i=0;i<listacoord.length;i++){
    //este for añade puntos fakeados a una lista para luego añadirlos
    for(var j=0;j<listacoord[i].length; j++){
     
      listapuntosExtra.push([listacoord[i][j][0]+0.000269,listacoord[i][j][1]+0.000200])
      listapuntosExtra.push([listacoord[i][j][0]-0.000231,listacoord[i][j][1]+0.000272])
      listapuntosExtra.push([listacoord[i][j][0]-0.000327,listacoord[i][j][1]-0.000308])
    }
    //cocatenamos las dos listas
     listacoord[i] = [...listacoord[i], ...listapuntosExtra];
    
   //se las pasamos al mapa de calor
    heatLayers[i]= L.heatLayer(listacoord[i], {
      radius: 60,
      blur: 15,
      minOpacity:0.5,
    });
    //ahora asignamos sus colores
    var suma=0
    var media=0
    //sacamos la media de todas las medidas
    for(var j=0;j<listamed[i].length; j++){
     suma=suma+listamed[i][j][2]
    }
    //obtenemos la media
    media=suma/listamed[i].length
    //le asignamos los colores al mapa de calor
    nivelMapadeCalor(heatLayers[i],media)
    //anyadimos el mapa de calor a la lista de mapas de calor 
    heatLayers[i].addTo(tipo)
    //limpliamos la lista para la siguiente pasada del for
    listapuntosExtra.splice(0,listapuntosExtra.length)
  }

 

}
//------------------------------------------------------------------------------
/**
 * @brief similar a la funcion anterior, pero esta vez realiza un mapa a partir de las medidas individuales
 * Diseño: <lista>,<lista>, R -->  hacermapaDeCalorInd()
 **/
//------------------------------------------------------------------------------
function hacermapaDeCalorInd(listacoordind,listamedind,tipo){
   //ahora hacemos los mapas individuales
   listaIndCoord=[]
   listaIndMedia=[]
   listaIndPuntosExtra=[]
   listaHeadlayersInd=[]
  //llenamos las listas
   for(var i=0;i<listacoordind.length;i++){
     for(var j=0;j<listacoordind[i].length; j++){
       listaIndCoord.push([listacoordind[i][j][0],listacoordind[i][j][1]])
      }
      
    //ahora asignamos sus colores
    for(var j=0;j<listamedind[i].length; j++){
      listaIndMedia.push(listamedind[i][j][2]) 
    }
   
  }
  //anyadimos puntos extra a sus lados
  for(var i=0;i<listaIndCoord.length;i++){
    
    listaIndPuntosExtra.splice(0,listaIndPuntosExtra.length)
    listaIndPuntosExtra.push([listaIndCoord[i][0],listaIndCoord[i][1]])
    listaIndPuntosExtra.push([listaIndCoord[i][0]+0.000269,listaIndCoord[i][1]+0.000200])
    listaIndPuntosExtra.push([listaIndCoord[i][0]-0.000231,listaIndCoord[i][1]+0.000272])
    listaIndPuntosExtra.push([listaIndCoord[i][0]-0.000327,listaIndCoord[i][1]-0.000308])
    
    //se las pasamos al mapa de calor
    
    listaHeadlayersInd[i]= L.heatLayer([], {
     radius: 50,
     blur: 30,
     minOpacity:0.2,
   });
   //le pasamos los puntos al mapa de calor
   listaHeadlayersInd[i].setLatLngs(listaIndPuntosExtra);
   //le asignamos el color a cada medida
   nivelMapadeCalor(listaHeadlayersInd[i],listaIndMedia[i])
   //se lo asignamos a su respectivo grupo
   listaHeadlayersInd[i].addTo(tipo)
  }
   
}

//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de asignar un color a los mapas de calor a partir de un numero y el mapa de calor al que 
 * se quiere asignar
 * Diseño: mapa, R --> nivelMapadeCalor()
 **/
//------------------------------------------------------------------------------
function nivelMapadeCalor(mapaDeCalor,media){
  //si la concentracion de gases es baja
  if(media<=0.6){
    mapaDeCalor.setOptions({
      gradient: {
        0.4: '#009645',
        0.65: 'lime',
        1: '#00BC56'
      }
    });
  }//si la concentracion de gases es mediana
  else if(media>=0.6&&media<=1.2){
    mapaDeCalor.setOptions({
      gradient: {
        0.4: 'yellow',
        0.65: 'yellow',
        1: 'orange'
      }
    });
  }
  //si la concentracion de gases es alta
 else if(media>=1.2&&media<=1.8){
  mapaDeCalor.setOptions({
      gradient: {
        0.4: 'yellow',
        0.65: 'orange',
        1: 'red'
      }
    });
  }
  //si la concentracion de gases es crítica
 else if(media>=1.8){
  mapaDeCalor.setOptions({
      gradient: {
       0.4: 'red',
        0.65: '#C4342D ',
        1: '#990033'
      }
    });
  }
}
//--------------------------CONTROLADOR DEL BUSCADOR POR FECHA-----------------------------------------------------------------------------------------
//el controlador de la derecha del mapa
var control= L.control.layers(baseMaps)
control.addTo(map);
// Obtiene el elemento contenedor del mapa donde guardaremos el form
var container = map.getContainer();
//funcion que se ejecuta al pulsar el boton volver a las medidas de hoy
function reloadPage() {
  window.location.reload();
}
//cuando se pulsa el boton de buscar del buscador 
var buscador = document.getElementById('buscadorFechas');
buscador.style.display = 'none';
document.getElementById('botonActivador').addEventListener('click', function() {
  var estado = buscador.style.display;
  if (estado === 'none') {
    buscador.style.display = 'block';
    document.getElementById('botonActivador').style.display = 'none';
  } else {
    buscador.style.display = 'none';
  }
});
var fecha;
buscador.onsubmit =  async function(evento) {
  // Previene el envío del formulario
  evento.preventDefault()
  // Obtiene el elemento input seleccionado
  var inputSeleccionado = document.querySelector('input[name="opciones"]:checked');
  // Si se ha seleccionado una opción, muestra su valor
  //borramos el manejador
 control.remove()
 //antes borramos los puntos de todas las capas
  points.clearLayers();
  medidasind.clearLayers();
  nitrogenoInd.clearLayers()
  GroupNitrogeno.clearLayers()
  dioxidoInd.clearLayers()
  grupoDioxido.clearLayers()

  // Obtiene el valor de los campos de texto
    fecha = buscador.elements.fecha.value
      // Llamamos a la funcion para buscar las medidas pasandol las fechas
      var lista= await buscarMedidaConFecha(fecha)
    if (inputSeleccionado.value=="5") {
      mostrarMedidasOzonoFecha(lista)
    }else if(inputSeleccionado.value=="3"){
      mostrarMedidasNitrogenoPorFecha(lista)
    }else if(inputSeleccionado.value=="2"){
      mostrarMedidasDioxidoCarbonoFecha(lista)
    }
    
}

// Obtiene el elemento contenedor del mapa
container.appendChild(buscador);

//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de buscar las medidas a partir de una consulta en la bd a partir de una fecha
 * y obtenemos una lista con las medidas de ese dia
 * Diseño: fecha --> buscarMedidaConFecha() --><lista>
 **/
//------------------------------------------------------------------------------
async function buscarMedidaConFecha(fecha){
 
  return new Promise(function(resolve, reject) {
    fetch(IP_PUERTO + "/obtenerMedicionesDelDiaConFecha?fecha=" + fecha, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((err) => console.log("Fetch failed " + err))
      .then((res) => res.json())
      .then((data) => {

        var listaDentro = [];
        data.forEach(function (medida) {
          var lng = medida.Longitud;
          var lat = medida.Latitud;
          var name = medida.Dato;
          var tipoGase = medida.Id_Dispositivo;

          listaDentro.push([lat,lng,name,tipoGase])
        });
        resolve(listaDentro);
      });
  });
}
//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de generar un mapa de calor y marcadores de ozono a partir de una lista obtenida en una fecha determinada
 * Diseño: <lista> --> mostrarMedidasOzonoFecha() 
 **/
//------------------------------------------------------------------------------
function mostrarMedidasOzonoFecha(listaDentro){
  var listaPortipoOzono= ordenarPortipo(listaDentro,5)
  var listaOrdenadaOzono= ordenarGrupos(listaPortipoOzono)
  var listasolocoordenadasOzono= ordenarGruposCoord(listaPortipoOzono)
  creadordecluster(listaOrdenadaOzono,points)
  hacermapaDeCalorInd(listasolocoordenadasOzono,listaOrdenadaOzono,medidasind)
  hacermapaDeCalor(listasolocoordenadasOzono,listaOrdenadaOzono,points)
  
  map.on('zoomend', function() {
    if (map.getZoom() <= 17) {
      points.addTo(map);
    } else {
      map.removeLayer(points);
    }
  });
  map.on('zoomend', function() {
    if (map.getZoom() >= 15) {
      medidasind.addTo(map)
    } else {
      map.removeLayer(medidasind);
    }
  });

}// fin mostrarMedidasOzono
//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de generar un mapa de calor y marcadores de oxido de nitrogeno a partir de una lista obtenida en una fecha determinada
 * Diseño: <lista> --> mostrarMedidasNitrogenoPorFecha() 
 **/
//------------------------------------------------------------------------------
function mostrarMedidasNitrogenoPorFecha(listaDentro){
  var listaPortipoNitrogeno= ordenarPortipo(listaDentro,3)
  var listaOrdenadaNitrogeno= ordenarGrupos(listaPortipoNitrogeno)
  var listasolocoordenadasNitrogeno= ordenarGruposCoord(listaPortipoNitrogeno)
  creadordecluster(listaOrdenadaNitrogeno,GroupNitrogeno)
  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoInd)
  hacermapaDeCalor(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno,GroupNitrogeno)
  map.on('zoomend', function() {
    if (map.getZoom() <= 17 ) {
      GroupNitrogeno.addTo(map);
    } else {
      map.removeLayer(GroupNitrogeno);
    }
  });
  map.on('zoomend', function() {
    if (map.getZoom() >= 15 ) {
      nitrogenoInd.addTo(map);
    } else {
      map.removeLayer(nitrogenoInd);
    }
  });
    
}
//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de generar un mapa de calor y marcadores de co2 a partir de una lista obtenida en una fecha determinada
 * Diseño: <lista> --> mostrarMedidasDioxidoCarbonoFecha() 
 **/
//------------------------------------------------------------------------------
function mostrarMedidasDioxidoCarbonoFecha(listaDentro){
  var listaPortipoDioxido= ordenarPortipo(listaDentro,2)
  var listaOrdenadaDioxido= ordenarGrupos(listaPortipoDioxido)
  var listasolocoordenadasDioxido= ordenarGruposCoord(listaPortipoDioxido)
  creadordecluster(listaOrdenadaDioxido,grupoDioxido)
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoInd)
  hacermapaDeCalor( listasolocoordenadasDioxido,listaOrdenadaDioxido,grupoDioxido)
  map.on('zoomend', function() {
    if (map.getZoom() <= 17 ) {
      grupoDioxido.addTo(map);
    } else {
      map.removeLayer(grupoDioxido);
    }
  });
  map.on('zoomend', function() {
    if (map.getZoom() >= 15 ) {
      dioxidoInd.addTo(map);
    } else {
      map.removeLayer(dioxidoInd);
    }
  });
}