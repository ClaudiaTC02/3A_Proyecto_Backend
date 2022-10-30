<h3 align = "center"> BackEnd </h3>

---
<p align = "center"> En este repositorio se encuentra el código encargado de realizar la conexión con la base de datos
    <br>
</p>

## 📝 Tabla de contenido

- [Introducción](#Getting_started)
- [Tests](#tests)

## 🏁 Comenzando <a name = "getting_started"> </a>

Estas instrucciones le proporcionarán una copia del proyecto en funcionamiento en su ordenador con fines de desarrollo y prueba

### Requisitos previos

Qué necesita para instalar el software y cómo instalarlo.
Lo único que se debe instalar para hacer funcionar este proyecto es XAMPP para ello entra en esta página web y descárgalo según tu sistema operativo.

```
[XAMPP](https://www.apachefriends.org/es/download.html).
```

### Instalación

Tras haber completa la instalación del programa XAMPP, lo abriremos e iniciaremos los servicios de Apache y MySQL

1. Entramos en phpmyadmin haciendo click dentro del XAMPP en admin (MySQL) para crear la base de datos que usaremos, para ello puede o bien crearlo de forma manual con los campos correspondientes o importar el archivo "gti3a_proyecto" 

```
Backend/src/bd/gti3a_proyecto.sql
```

2. Una vez hecho esto, abres el terminal, te diriges a esta carpeta

```
Backend/src/logica
```

3. Una vez allí, ejecutas

```
npm install
```

4. Se repite el proceso esta vez ubicandote en

```
Backend/src/servidorREST
```

5. Por último ejecutas el servidor rest, en el directorio del paso anterior ejecutando este comando 

```
npm run servidor
```

## 🔧 Ejecutando las pruebas <a name = "tests"> </a>

Para ejecutar las pruebas automáticas en primer lugar deberá dirigirse desde el terminal a:

```
Backend/src/logica
```

Para ejecutar finalmente

```
npm test
```