//--------------------------------------------------------------------------------
// mapas.js
//
// Autor: Enrique Ferre Carbonell
// Fecha: 28/12/22
// Descripcion: funciones del mapa
//------------------------------------------------------------------------------

//muestra las medidas de hoy nada mas cargar la pagina
window.onload = mostrarMedidasOzono;
window.onload = ObtenerMedidasOficiales;

//variable para las peticiones
const IP_PUERTO = "http://localhost:8080";

//Para mi servidor usar esta
//const IP_PUERTO = "http://192.168.137.1:8080";

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
var estacionesOficiales = L.layerGroup().addTo(map);
//anyadimos un mapa base de open streetmaps
var osm= L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
})
osm.addTo(map)

var todo=[]//variable que se encargará de almacenar todas las consultas

//leyenda del mapa
var legend = document.getElementById('map-legend');
map.getContainer().appendChild(legend);
//PARA TELÉFONO
//Poner la leyenda en la esquina inferior derecha solo para móviles
if (window.innerWidth <= 800) {
  legend.style.position = 'absolute';
  legend.style.bottom = '10px';
  legend.style.marginTop = '410px';
  legend.style.padding = '10px';
  legend.style.borderRadius = '5px';
}

  
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
  
  hacermapaDeCalorInd(listasolocoordenadasOzono, listaOrdenadaOzono, medidasind)
  hacermapaDeInterpolacion(listaPortipoOzono,interpolacion)
  groupedLayerGroupOzono.addLayer(medidasind);
  

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
  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoInd)
  hacermapaDeInterpolacion(listaPortipoNitrogeno,interpolacion)
  groupedLayerGroupNitrogeno.addLayer(nitrogenoInd);
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
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoInd)
  hacermapaDeInterpolacion(listaPortipoDioxido,interpolacion)
  groupedLayerGroupDioxido.addLayer(dioxidoInd);
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
  heatmap = []
  
  for(var i=0;i<listaIndCoord.length;i++){
    var marker = L.marker([listaIndCoord[i][0],listaIndCoord[i][1]]).addTo(tipo);
    marker.setOpacity(0);

    marker.bindPopup(listaIndMedia[i].toString());

    
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
  if (media <= 0.02) {
    gradient = {0.4: '#adcfeb', 0.65: '#7fb8e1', 1: '#0096d2'};
  } else if (media <= 0.06) {
    gradient = {0.4: '#009645', 0.65: 'lime', 1: '#00BC56'};
  } else if (media > 0.06 && media <= 0.1) {
    gradient = {0.4: 'yellow', 0.65: 'yellow', 1: 'yellow'};
  } else if (media > 0.1 && media < 0.2) {
    gradient = {0.4: 'yellow', 0.65: 'orange', 1: 'red'};
  } else if (media >= 0.2) {
    gradient = {0.4: 'red', 0.65: '#C4342D', 1: '#990033'};
  }
  return {gradient: gradient};
}
//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de crear el mapa de interpolacion y los popup con las medidas
 * se quiere asignar
 * Diseño: lista<puntos>, capa --> hacermapaDeInterpolacion()
 **/
//------------------------------------------------------------------------------
function hacermapaDeInterpolacion(lista,capa){
  
  var puntos= turf.featureCollection([]);//creamos el objeto turf para el popup
  var listadef=[]
  for(var i=0;i<lista.length;i++){
    listadef.push([lista[i][0],lista[i][1],lista[i][2]])//llenamos la lista con los puntos y sus intensidades para el mapa de interpolacion
  }
  for(var i=0;i<listadef.length;i++){//llenamos el objeto turf para el popup
    puntos.features.push(turf.point([listadef[i][0],listadef[i][1]]))
  }
  
  var idwLayer = L.idwLayer(listadef, {//creamos el mapa de interpolacion
    opacity: 0.3,
    cellSize: 10,
    exp: 10,
    min:0.1,
    max: 0.24,
    colorRange: ['green','yellow', 'red'],
    debug: true
  })
  idwLayer.addTo(capa);//lo anyadimos a la capa
  
  var lastMarker;
  map.on('click', function(e) {//cuando se haga click en el mapa
   
    if (lastMarker) {
      map.removeLayer(lastMarker);
    }
    var clickPoint = 0
    clickPoint=turf.point([e.latlng.lat, e.latlng.lng]);//obtenemos el punto donde hemos hecho click
    console.log("neardespoint"+ e.latlng.lng+":"+ e.latlng.lat)
    var nearestPoint = turf.nearestPoint(clickPoint, puntos);//usamos esto para comprobar el punto donde hemos hecho click con el punto mas proximo a el de la lista de puntos que definen el mapa de interpolacion
    
    var nearestCoord = nearestPoint.geometry.coordinates;//obtenemos el punto que esta mas cerca de donde hemos hecho click (su lat y long)
    console.log("neardescoord"+nearestCoord)
    var intensidad=0
    for(var i=0;i<listadef.length;i++){
      if(listadef[i][0]==nearestCoord[0]&& listadef[i][1]==nearestCoord[1]){//si coinciden
        intensidad=listadef[i][2];//le damos el valor de la medida registrada
      }
    }
    var marker = L.marker(e.latlng).addTo(capa);//hacemos un marker con un popup en el cual mostramos el valor de la intesidad
    marker.setOpacity(0);
    marker.bindPopup(intensidad.toString());//le pasamos el texto
    lastMarker = marker;
  });
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
  groupedLayerGroupDioxido.clearLayers()
  groupedLayerGroupOzono.clearLayers()
  groupedLayerGroupNitrogeno.clearLayers()
  estacionesOficiales.clearLayers()
  map.removeLayer(interpolacion);

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
  clusterFecha.clearLayers()
  interpolacionFecha.clearLayers()
  medidasindfecha.clearLayers()
  pointsfecha.clearLayers()
  nitrogenoIndfecha.clearLayers()
  GroupNitrogenofecha.clearLayers()
  dioxidoIndfecha.clearLayers()
  grupoDioxidofecha.clearLayers()

  var listaPortipoOzono= ordenarPortipo(listaDentro,5)
  var listaOrdenadaOzono= ordenarGrupos(listaPortipoOzono)
  var listasolocoordenadasOzono= ordenarGruposCoord(listaPortipoOzono)
 
  hacermapaDeCalorInd(listasolocoordenadasOzono,listaOrdenadaOzono,medidasindfecha)
 
  hacermapaDeInterpolacion(listaPortipoOzono,pointsfecha)
  groupedLayerGroupOzonofecha.addLayer(pointsfecha);
  

}// fin mostrarMedidasOzono
//------------------------------------------------------------------------------
/**
 * @brief funcion encargada de generar un mapa de calor y marcadores de oxido de nitrogeno a partir de una lista obtenida en una fecha determinada
 * Diseño: <lista> --> mostrarMedidasNitrogenoPorFecha() 
 **/
//------------------------------------------------------------------------------
function mostrarMedidasNitrogenoPorFecha(listaDentro){
  clusterFecha.clearLayers()
  interpolacionFecha.clearLayers()
  medidasindfecha.clearLayers()
  pointsfecha.clearLayers()
  nitrogenoIndfecha.clearLayers()
  GroupNitrogenofecha.clearLayers()
  dioxidoIndfecha.clearLayers()
  grupoDioxidofecha.clearLayers()
  

  var listaPortipoNitrogeno= ordenarPortipo(listaDentro,3)
  var listaOrdenadaNitrogeno= ordenarGrupos(listaPortipoNitrogeno)
  var listasolocoordenadasNitrogeno= ordenarGruposCoord(listaPortipoNitrogeno)

  hacermapaDeCalorInd(listasolocoordenadasNitrogeno,listaOrdenadaNitrogeno, nitrogenoIndfecha)
  hacermapaDeInterpolacion(listaPortipoNitrogeno,nitrogenoIndfecha)
  groupedLayerGroupNitrogenofecha.addLayer(nitrogenoIndfecha);
  
    
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
 
  hacermapaDeCalorInd( listasolocoordenadasDioxido,listaOrdenadaDioxido, dioxidoIndfecha)
  hacermapaDeInterpolacion(listaPortipoDioxido, dioxidoIndfecha)
  groupedLayerGroupDioxidofecha.addLayer(dioxidoIndfecha);
 
}

function ObtenerMedidasOficiales(){
 
  // const $ = cheerio.load(url);
  // console.log($("body").text());
  $.ajax({
    url: "https://cors-anywhere.herokuapp.com/https://www.eltiempo.es/calidad-aire/valencia~ROW_NUMBER_4~~TEMP_UNIT_c~~WIND_UNIT_kmh~",
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    },
    success: function(data) { 
      // Use DOMParser to parse the HTML string into a DOM
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");
    var extractedData = {};
    
    // Extract the data you want from the DOM and add it to the extractedData object
    //extractedData.property1 = doc.querySelector(".svalue_good").textContent;
    //extractedData.property2 = doc.querySelectorAll(".data").textContent;
    /*let ciudades = '{ "ciudades" : [' +
      '{ "Albalat dels Tarongers" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Algar de Palancia" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Alzira" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Benigánim" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Buñol" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Burjassot" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Caudete de las Fuentes" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Cortes de Pallás" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Cuart de Poblet" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Gandía" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Ontinyent" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Paterna" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Sagunt Cea" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Sagunt Port" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Sagunt-Nord" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Sedaví" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Torrebaja" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Torrente" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"València - Avd. Francia" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"València - Molí Del Sol" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"València-Pista De Silla" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"València-Politècnic" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"València-Vivers" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Vilamarxant" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Villar del Arzobispo" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""},' +
      '{ "ciudad":"Zarra" , "O3":"" , "NO2":"" , "SO2":"" , "PM2.5":"" , "PM10":"" , "CO":""} ]}';
      const objCiudades = JSON.parse(ciudades);*/
      var objMedidas = [];
  /*  var elements = doc.querySelectorAll(".data");
    for (var i = 0; i < elements.length; i++) {
      console.log(elements[i].textContent);
      console.log(elements.length)
    }*/
    var elements2 = doc.querySelectorAll(".value_good, .value_moderate, .value_null");
    for (var i = 0; i < elements2.length; i++) {
     //console.log(elements2[i].textContent);
     //console.log(elements2.length)
      objMedidas.push(elements2[i].textContent.trim()); 
    }
    // Convert the extractedData object into a JSON string
    //var jsonData = JSON.stringify(extractedData);
    // Do something with the JSON data
    console.log(objMedidas);

    var myIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/992/992349.png',
      iconSize: [35, 47],
      popupAnchor: [-3, -30]
  });
    //creamos los marcadores para las estaciones de medidas oficiales
    var markerAlbalat = L.marker([39.703101, -0.337802], {icon: myIcon}).addTo(estacionesOficiales);
    markerAlbalat.bindPopup("Albalat dels Tarongers" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[0] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[1] + "<br>"+ "<b>CO:  </b>" +objMedidas[5]);

    var markerAlgar = L.marker([39.780930, -0.368191], {icon: myIcon}).addTo(estacionesOficiales);
    markerAlgar.bindPopup("Algar de Palancia" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[6] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[7] + "<br>"+ "<b>CO:  </b>" +objMedidas[11]);

    var markerAlzira = L.marker([39.154875, -0.431890], {icon: myIcon}).addTo(estacionesOficiales);
    markerAlzira.bindPopup("Alzira" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[12] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[13] + "<br>"+ "<b>CO:  </b>" +objMedidas[17]);

    var markerBenigánim = L.marker([38.943183, -0.445719], {icon: myIcon}).addTo(estacionesOficiales);
    markerBenigánim.bindPopup("Beniganim" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[18] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[19] + "<br>"+ "<b>CO:  </b>" +objMedidas[23]);

    var markerBuñol = L.marker([39.420255, -0.793399], {icon: myIcon}).addTo(estacionesOficiales);
    markerBuñol.bindPopup("Buñol" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[24] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[25] + "<br>"+ "<b>CO:  </b>" +objMedidas[29]);

    var markerBurjassot = L.marker([39.509729, -0.417221], {icon: myIcon}).addTo(estacionesOficiales);
    markerBurjassot.bindPopup("Burjassot" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[30] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[31] + "<br>"+ "<b>CO:  </b>" +objMedidas[35]);

    var markerCaudete = L.marker([39.557806, -1.280138], {icon: myIcon}).addTo(estacionesOficiales);
    markerCaudete.bindPopup("Caudete de las Fuentes" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[36] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[37] + "<br>"+ "<b>CO:  </b>" +objMedidas[41]);

    var markerCortes = L.marker([39.242268, -0.941525], {icon: myIcon}).addTo(estacionesOficiales);
    markerCortes.bindPopup("Cortes de Pallas" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[42] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[43] + "<br>"+ "<b>CO:  </b>" +objMedidas[47]);

    var markerCuart = L.marker([39.481061, -0.451558], {icon: myIcon}).addTo(estacionesOficiales);
    markerCuart.bindPopup("Cuarta de Poble" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[48] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[49] + "<br>"+ "<b>CO:  </b>" +objMedidas[53]);

    var markerGandia = L.marker([38.985748, -0.162910], {icon: myIcon}).addTo(estacionesOficiales);
    markerGandia.bindPopup("Gandia" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[54] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[55] + "<br>"+ "<b>CO:  </b>" +objMedidas[59]);

    var markerOntinyent = L.marker([38.822803, -0.595123], {icon: myIcon}).addTo(estacionesOficiales);
    markerOntinyent.bindPopup("Ontinyent" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[60] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[61] + "<br>"+ "<b>CO:  </b>" +objMedidas[65]);

    var markerPaterna = L.marker([39.504344, -0.440896], {icon: myIcon}).addTo(estacionesOficiales);
    markerPaterna.bindPopup("Paterna" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[66] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[67] + "<br>"+ "<b>CO:  </b>" +objMedidas[71]);

    var markerSaguntoCea = L.marker([39.680218, -0.278238], {icon: myIcon}).addTo(estacionesOficiales);
    markerSaguntoCea.bindPopup("Sagunto Cea" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[72] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[73] + "<br>"+ "<b>CO:  </b>" +objMedidas[77]);

    var markerSaguntPort = L.marker([39.681593, -0.275807], {icon: myIcon}).addTo(estacionesOficiales);
    markerSaguntPort.bindPopup("Sagunto Port" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[78] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[79] + "<br>"+ "<b>CO:  </b>" +objMedidas[83]);

    var markerSaguntNord = L.marker([39.664786, -0.221515], {icon: myIcon}).addTo(estacionesOficiales);
    markerSaguntNord.bindPopup("Sagunto Nord" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[84] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[85] + "<br>"+ "<b>CO:  </b>" +objMedidas[89]);

    var markerSedavi = L.marker([39.425734, -0.382522], {icon: myIcon}).addTo(estacionesOficiales);
    markerSedavi.bindPopup("Sedavi" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[90] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[91] + "<br>"+ "<b>CO:  </b>" +objMedidas[95]);

    var markerTorrebaja= L.marker([40.099221, -1.258338], {icon: myIcon}).addTo(estacionesOficiales);
    markerTorrebaja.bindPopup("Torrebaja" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[96] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[97] + "<br>"+ "<b>CO:  </b>" +objMedidas[101]);

    var markerTorrente = L.marker([39.423540, -0.485153], {icon: myIcon}).addTo(estacionesOficiales);
    markerTorrente.bindPopup("Torrente" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[102] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[103] + "<br>"+ "<b>CO:  </b>" +objMedidas[107]);

    var markerValenciaFrancia = L.marker([39.482846, -0.334992], {icon: myIcon}).addTo(estacionesOficiales);
    markerValenciaFrancia.bindPopup("Valencia Av.Francia" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[108] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[109] + "<br>"+ "<b>CO:  </b>" +objMedidas[113]);

    var markerValenciaSol = L.marker([39.488223, -0.384043], {icon: myIcon}).addTo(estacionesOficiales);
    markerValenciaSol.bindPopup("Valencia Moli del Sol" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[114] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[115] + "<br>"+ "<b>CO:  </b>" +objMedidas[119]);

    var markerValenciaSilla = L.marker([39.447016, -0.357838], {icon: myIcon}).addTo(estacionesOficiales);
    markerValenciaSilla.bindPopup("Valencia Pista de Silla" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[120] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[121] + "<br>"+ "<b>CO:  </b>" +objMedidas[125]);

    var markerValenciaPolitec = L.marker([39.419898, -0.335389], {icon: myIcon}).addTo(estacionesOficiales);
    markerValenciaPolitec.bindPopup("Valencia Politecnic" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[126] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[127] + "<br>"+ "<b>CO:  </b>" +objMedidas[131]);

    var markerValenciaVivers = L.marker([39.477280, -0.409826], {icon: myIcon}).addTo(estacionesOficiales);
    markerValenciaVivers.bindPopup("Valencia Vivers" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[132] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[133] + "<br>"+ "<b>CO:  </b>" +objMedidas[137]);

    var markerVilamarxant = L.marker([39.569727, -0.627513], {icon: myIcon}).addTo(estacionesOficiales);
    markerVilamarxant.bindPopup("Vilamarxant" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[138] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[139] + "<br>"+ "<b>CO:  </b>" +objMedidas[143]);

    var markerVillar = L.marker([39.735290, -0.826027], {icon: myIcon}).addTo(estacionesOficiales);
    markerVillar.bindPopup("Villar del Arzobispo" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[144] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[145] + "<br>"+ "<b>CO:  </b>" +objMedidas[149]);

    var markerAlzira = L.marker([39.091703, -1.073827], {icon: myIcon}).addTo(estacionesOficiales);
    markerAlzira.bindPopup("Zarra" + "<br>"+ "<b>O<sub>3</sub>:  </b>"+ objMedidas[150] + "<br>"+ "<b>NO<sub>2</sub>:  </b>"+ objMedidas[151] + "<br>"+ "<b>CO:  </b>" +objMedidas[155]);


    }
  });

}