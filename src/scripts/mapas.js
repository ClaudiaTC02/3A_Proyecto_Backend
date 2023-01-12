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
//layer para visualizar el mapa de interpolacion
var interpolacion= L.layerGroup().addTo(map);
//ahora para las fechas-----------------------------------------------------------------------------
//esta es la variable que almacena la capa de puntos que anyadiremos al mapa
var pointsfecha = L.layerGroup().addTo(map);
var medidasindfecha = L.layerGroup().addTo(map);
//grupo de capas para almacenar el nitrogeno
var GroupNitrogenofecha = L.layerGroup().addTo(map);
var nitrogenoIndfecha  =L.layerGroup().addTo(map);
//grupo de capas para almacenar las capas de dioxido de carbono
var grupoDioxidofecha = L.layerGroup().addTo(map);
var dioxidoIndfecha= L.layerGroup().addTo(map);
//layer controler para visualizar los contaminantes
var groupedLayerGroupOzonofecha = L.layerGroup([pointsfecha, medidasindfecha]);
var groupedLayerGroupNitrogenofecha = L.layerGroup([GroupNitrogenofecha, nitrogenoIndfecha]);
var groupedLayerGroupDioxidofecha = L.layerGroup([ grupoDioxidofecha, dioxidoIndfecha]);
var interpolacionFecha= L.layerGroup().addTo(map);
var clusterFecha= L.layerGroup().addTo(map);
//anyadimos un mapa base de open streetmaps
var osm= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 16,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
})
osm.addTo(map)

var todo=[]//variable que se encargará de almacenar todas las consultas

//leyenda del mapa
var legend = document.getElementById('map-legend');
map.getContainer().appendChild(legend);
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
  interpolacion.clearLayers();
  var listaDentro =[]
  listaDentro.splice(0,  listaDentro.length)
  listaDentro= await buscarMedidas();
  var listaPortipoOzono= ordenarPortipo(listaDentro,5)
  var listaOrdenadaOzono= ordenarGrupos(listaPortipoOzono)
  var listasolocoordenadasOzono= ordenarGruposCoord(listaPortipoOzono)
  creadordecluster(listaOrdenadaOzono,groupedLayerGroupOzono)
  hacermapaDeCalorInd(listasolocoordenadasOzono,listaOrdenadaOzono,medidasind)
  hacermapaDeCalor(listasolocoordenadasOzono,listaOrdenadaOzono,points)
  hacermapaDeInterpolacion(listaPortipoOzono,interpolacion)
  
  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupOzono.removeLayer(points);
      groupedLayerGroupOzono.addLayer(medidasind);
    } else if (currentZoom == 13) {
      groupedLayerGroupOzono.addLayer(points);
      groupedLayerGroupOzono.removeLayer(medidasind);
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
  interpolacion.clearLayers();
  var listaDentro = await buscarMedidas();
  var listaPortipoNitrogeno= ordenarPortipo(listaDentro,3)
  var listaOrdenadaNitrogeno= ordenarGrupos(listaPortipoNitrogeno)
  var listasolocoordenadasNitrogeno= ordenarGruposCoord(listaPortipoNitrogeno)
  creadordecluster(listaOrdenadaNitrogeno,groupedLayerGroupNitrogeno)
  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoInd)
  hacermapaDeCalor(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno,GroupNitrogeno)
  hacermapaDeInterpolacion(listaPortipoNitrogeno,interpolacion)
  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupNitrogeno.removeLayer(GroupNitrogeno);
      groupedLayerGroupNitrogeno.addLayer(nitrogenoInd);
    } else if (currentZoom == 13) {
      groupedLayerGroupNitrogeno.addLayer(GroupNitrogeno);
      groupedLayerGroupNitrogeno.removeLayer(nitrogenoInd);
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
  interpolacion.clearLayers();
  var listaDentro = await buscarMedidas();
  var listaPortipoDioxido= ordenarPortipo(listaDentro,2)
  var listaOrdenadaDioxido= ordenarGrupos(listaPortipoDioxido)
  var listasolocoordenadasDioxido= ordenarGruposCoord(listaPortipoDioxido)
  creadordecluster(listaOrdenadaDioxido,groupedLayerGroupDioxido)
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoInd)
  hacermapaDeCalor( listasolocoordenadasDioxido,listaOrdenadaDioxido,grupoDioxido)
  hacermapaDeInterpolacion(listaPortipoDioxido,interpolacion)
  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupDioxido.removeLayer(grupoDioxido);
      groupedLayerGroupDioxido.addLayer(dioxidoInd);
    } else if (currentZoom == 13) {
      groupedLayerGroupDioxido.addLayer(grupoDioxido);
      groupedLayerGroupDioxido.removeLayer(dioxidoInd);
    }
  });
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
var overlayMaps = {
  "Interpolación": interpolacion,
};
map.removeLayer(interpolacion);
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
function ordenarGrupos(lista) {
  var grupos = [], grupoActual = [];
  var distanciaMinima = 0.006; // distancia mínima para agrupar puntos
  for (var i = 0; i < lista.length; i++) {
    if (grupoActual.length == 0) {
      // si no hay un grupo actual, iniciamos uno nuevo con el primer punto
      grupoActual.push(lista[i]);
    } else {
      var incluido = false;
      for (var j = 0; j < grupoActual.length; j++) {
        // calculamos la distancia entre el punto actual y los puntos del grupo actual
        var distancia = Math.sqrt(Math.pow(lista[i][0] - grupoActual[j][0], 2) + Math.pow(lista[i][1] - grupoActual[j][1], 2));
        if (distancia <= distanciaMinima) {
          // si el punto está dentro de la distancia mínima, lo agregamos al grupo actual
          grupoActual.push(lista[i]);
          incluido = true;
          break;
        }
      }
      if (!incluido) {
        // si el punto no se ha incluido en ningún grupo, creamos uno nuevo
        grupos.push(grupoActual);
        grupoActual = [lista[i]];
      }
    }
  }
  grupos.push(grupoActual);
  // agregamos el último grupo
  return grupos;
}
//------------------------------------------------------------------------------
/**
 * @brief similar a la funcion anterior, pero solo devuelve una lista con lat y long 
 * Diseño: <lista> --> ordenarGruposCoor()--> <lista>
 **/
//------------------------------------------------------------------------------
function ordenarGruposCoord(lista){
  var grupos = [], grupoActual = [];
  var distanciaMinima = 0.006; // distancia mínima para agrupar puntos
  for (var i = 0; i < lista.length; i++) {
    if (grupoActual.length == 0) {
      // si no hay un grupo actual, iniciamos uno nuevo con el primer punto
      grupoActual.push([lista[i][0],lista[i][1]]);
    } else {
      var incluido = false;
      for (var j = 0; j < grupoActual.length; j++) {
        // calculamos la distancia entre el punto actual y los puntos del grupo actual
        var distancia = Math.sqrt(Math.pow(lista[i][0] - grupoActual[j][0], 2) + Math.pow(lista[i][1] - grupoActual[j][1], 2));
        if (distancia <= distanciaMinima) {
          // si el punto está dentro de la distancia mínima, lo agregamos al grupo actual
          grupoActual.push([lista[i][0],lista[i][1]]);
          incluido = true;
          break;
        }
      }
      if (!incluido) {
        // si el punto no se ha incluido en ningún grupo, creamos uno nuevo
        grupos.push(grupoActual);
        grupoActual = [[lista[i][0],lista[i][1]]];
      }
    }
  }
  grupos.push(grupoActual);
  // agregamos el último grupo
  return grupos;
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
    //ahora asignamos sus colores
    var suma=0
    var media=0
    //sacamos la media de todas las medidas
    for(var j=0;j<listamed[i].length; j++){
     suma=suma+listamed[i][j][2]
    }
    //obtenemos la media
    media=suma/listamed[i].length
    
   //se las pasamos al mapa de calor
    heatLayers[i]= L.heatLayer(listacoord[i], {
      radius: 60,
      blur: 25,
      minOpacity:0.2,
     
    });
    
    //le asignamos los colores al mapa de calor
    var configColor = nivelMapadeCalor(media)
    heatLayers[i].setOptions({gradient: configColor.gradient});
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
  console.log(listacoordind)
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
  var heatmap=[]
  for(var i=0;i<listaIndCoord.length;i++){
    
    var extraPoints = []
    extraPoints.push([listaIndCoord[i][0],listaIndCoord[i][1]])
    extraPoints.push([listaIndCoord[i][0]+0.000269,listaIndCoord[i][1]+0.000200])
    extraPoints.push([listaIndCoord[i][0]-0.000231,listaIndCoord[i][1]+0.000272])
    extraPoints.push([listaIndCoord[i][0]-0.000327,listaIndCoord[i][1]-0.000308])
    heatmap[i] = L.heatLayer(extraPoints, nivelMapadeCalor(listaIndMedia[i]));
    heatmap[i].setOptions({radius: 40, blur: 60, minOpacity: 0.03});
   //le asignamos el color a cada medida
   heatmap[i].addTo(tipo)
  }
  
}

//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de asignar un color a los mapas de calor a partir de un numero y el mapa de calor al que 
 * se quiere asignar
 * Diseño: mapa, R --> nivelMapadeCalor()
 **/
//------------------------------------------------------------------------------
function nivelMapadeCalor(media) {
  var gradient;
  if (media <= 0.2) {
    gradient = {0.4: '#adcfeb', 0.65: '#7fb8e1', 1: '#0096d2'};
  } else if (media <= 0.7) {
    gradient = {0.4: '#009645', 0.65: 'lime', 1: '#00BC56'};
  } else if (media > 0.7 && media <= 1.2) {
    gradient = {0.4: 'yellow', 0.65: 'yellow', 1: 'yellow'};
  } else if (media > 1.2 && media < 1.8) {
    gradient = {0.4: 'yellow', 0.65: 'orange', 1: 'red'};
  } else if (media >= 1.8) {
    gradient = {0.4: 'red', 0.65: '#C4342D', 1: '#990033'};
  }
  return {gradient: gradient};
}
function hacermapaDeInterpolacion(lista,capa){
  var puntos=[]
  var listadef=[]
  for(var i=0;i<lista.length;i++){
    listadef.push([lista[i][0],lista[i][1],lista[i][2]])
    puntos.push(turf.point([lista[i][0],lista[i][1]]))
    
  }
  
  var idwLayer = L.idwLayer(listadef, {
    opacity: 0.1,
    cellSize: 10,
    exp: 10,
    min:0,
    max: 2,
    colorRange: ['green','yellow', 'red'],
    debug: true
  })

 
  
  map.on('zoomend', function() {
    var zoom = map.getZoom();
    if (zoom < 13) {
      idwLayer.removeFrom(capa);
    } else {
       idwLayer.addTo(capa);
    }
  });

}

  
//--------------------------CONTROLADOR DEL BUSCADOR POR FECHA-----------------------------------------------------------------------------------------
//el controlador de la derecha del mapa
var control= L.control.layers(baseMaps, overlayMaps)
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
  groupedLayerGroupDioxido.clearLayers()
  groupedLayerGroupOzono.clearLayers()
  groupedLayerGroupNitrogeno.clearLayers()
  map.removeLayer(interpolacion);

  // Obtiene el valor de los campos de texto
    fecha = buscador.elements.fecha.value
      // Llamamos a la funcion para buscar las medidas pasandol las fechas
      var lista= await buscarMedidaConFecha(fecha)
      var checkbox = document.getElementById("checkbox-1");
    if (inputSeleccionado.value=="5") {
      mostrarMedidasOzonoFecha(lista)
      checkbox.addEventListener("change", function() {
        if (this.checked) {
          map.addLayer(interpolacionFecha)
          hacermapaDeInterpolacion(lista,interpolacionFecha)
        } else {
           map.removeLayer(interpolacionFecha)
        }
    });
    }else if(inputSeleccionado.value=="3"){
      mostrarMedidasNitrogenoPorFecha(lista)
      checkbox.addEventListener("change", function() {
        if (this.checked) {
          map.addLayer(interpolacionFecha)
          hacermapaDeInterpolacion(lista,interpolacionFecha)
        } else {
           map.removeLayer(interpolacionFecha)
        }
    });
    }else if(inputSeleccionado.value=="2"){
      mostrarMedidasDioxidoCarbonoFecha(lista)
      checkbox.addEventListener("change", function() {
        if (this.checked) {
          map.addLayer(interpolacionFecha)
          hacermapaDeInterpolacion(lista,interpolacionFecha)
        } else {
           map.removeLayer(interpolacionFecha)
        }
    });
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
  clusterFecha.clearLayers()
  medidasindfecha.clearLayers()
  pointsfecha.clearLayers()
  nitrogenoIndfecha.clearLayers()
  GroupNitrogenofecha.clearLayers()
  dioxidoIndfecha.clearLayers()
  grupoDioxidofecha.clearLayers()

  var listaPortipoOzono= ordenarPortipo(listaDentro,5)
  var listaOrdenadaOzono= ordenarGrupos(listaPortipoOzono)
  var listasolocoordenadasOzono= ordenarGruposCoord(listaPortipoOzono)
  creadordecluster(listaOrdenadaOzono,clusterFecha)
  hacermapaDeCalorInd(listasolocoordenadasOzono,listaOrdenadaOzono,medidasindfecha)
  hacermapaDeCalor(listasolocoordenadasOzono,listaOrdenadaOzono,pointsfecha)
  
  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupOzonofecha.removeLayer(pointsfecha);
      groupedLayerGroupOzonofecha.addLayer(medidasindfecha);
    } else if (currentZoom == 13) {
      groupedLayerGroupOzonofecha.addLayer(pointsfecha);
      groupedLayerGroupOzonofecha.removeLayer(medidasindfecha);
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
  clusterFecha.clearLayers()
  medidasindfecha.clearLayers()
  pointsfecha.clearLayers()
  nitrogenoIndfecha.clearLayers()
  GroupNitrogenofecha.clearLayers()
  dioxidoIndfecha.clearLayers()
  grupoDioxidofecha.clearLayers()
  

  var listaPortipoNitrogeno= ordenarPortipo(listaDentro,3)
  var listaOrdenadaNitrogeno= ordenarGrupos(listaPortipoNitrogeno)
  var listasolocoordenadasNitrogeno= ordenarGruposCoord(listaPortipoNitrogeno)
  creadordecluster(listaOrdenadaNitrogeno,clusterFecha)
  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoIndfecha)
  hacermapaDeCalor(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno,GroupNitrogenofecha)
  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupNitrogenofecha.removeLayer(GroupNitrogenofecha);
      groupedLayerGroupNitrogenofecha.addLayer(nitrogenoIndfecha);
    } else if (currentZoom == 13) {
      groupedLayerGroupNitrogenofecha.addLayer(GroupNitrogenofecha);
      groupedLayerGroupNitrogenofecha.removeLayer(nitrogenoIndfecha);
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
  clusterFecha.clearLayers()
  medidasindfecha.clearLayers()
  pointsfecha.clearLayers()
  nitrogenoIndfecha.clearLayers()
  GroupNitrogenofecha.clearLayers()
  dioxidoIndfecha.clearLayers()
  grupoDioxidofecha.clearLayers()

  var listaPortipoDioxido= ordenarPortipo(listaDentro,2)
  var listaOrdenadaDioxido= ordenarGrupos(listaPortipoDioxido)
  var listasolocoordenadasDioxido= ordenarGruposCoord(listaPortipoDioxido)
  creadordecluster(listaOrdenadaDioxido,clusterFecha)
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoIndfecha)
  hacermapaDeCalor( listasolocoordenadasDioxido,listaOrdenadaDioxido,grupoDioxidofecha)

  map.on("zoomend", function() {
    var currentZoom = map.getZoom();
    if (currentZoom >= 14) {
      groupedLayerGroupDioxidofecha.removeLayer(grupoDioxidofecha);
      groupedLayerGroupDioxidofecha.addLayer(dioxidoIndfecha);
    } else if (currentZoom == 13) {
      groupedLayerGroupDioxidofecha.addLayer(grupoDioxidofecha);
      groupedLayerGroupDioxidofecha.removeLayer(dioxidoIndfecha);
    }
  });
}