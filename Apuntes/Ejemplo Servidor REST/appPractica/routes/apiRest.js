const path = require('path'); // Módulo para trabajar con rutas

var express = require('express');
var router = express.Router();

/*****************************************************************************************************************************/
// FUNCIONES ÚTILES
/*****************************************************************************************************************************/

function buscarRevista_X_Titulo(tituloSitioWeb, tituloRevista){

    let archivoJSON = require(path.join(__dirname + `/../datos/${req.params.tituloSitioWeb}.json`)); // Busco el archivo .json
    return archivoJSON.find(revista => revista["Título"] == req.params.tituloRevista); // Busco si coincide el titulo del parametro con algun titulo del archivo .json
}

function buscarRevista_X_ISSNImpreso(tituloSitioWeb, issn){

    let archivoJSON = require(path.join(__dirname + `/../datos/${tituloSitioWeb}.json`));
    return archivoJSON.find(revista => revista["ISSN impresa"] == issn);
}

function buscarRevista_X_ISSNEnLinea(tituloSitioWeb, issn){

    let archivoJSON = require(path.join(__dirname + `/../datos/${tituloSitioWeb}.json`));
    return archivoJSON.find(revista => revista["ISSN en linea"] == issn);
}

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES GET
/*****************************************************************************************************************************/

router.get('/database/:database', function(req, res){
    // Solo busco el archivo .json y devuelvo su contenido
    let archivoJSON = require(path.join(__dirname + `/../datos/${req.params.database}.json`));
    res.send(archivoJSON);
})


router.get('/database/:database/titulo/:tituloRevista', function(req, res){

    let respuesta;

    if(buscarRevista_X_Titulo(req.params.database, req.params.tituloRevista) != undefined) respuesta = buscarRevista_X_Titulo(req.params.database, req.params.tituloRevista);
    else                                                                                   respuesta = `No existe una revista en ${req.params.database} con el título de ${req.params.tituloRevista}`;

    res.send(respuesta);
})


router.get('/database/:database/ISSN/:issn', function(req, res){

    let respuesta;

    if(buscarRevista_X_ISSNImpreso(req.params.database, req.params.issn) != undefined)      respuesta = buscarRevista_X_ISSNImpreso(req.params.database, req.params.issn);
    else if(buscarRevista_X_ISSNEnLinea(req.params.database, req.params.issn) != undefined) respuesta = buscarRevista_X_ISSNEnLinea(req.params.database, req.params.issn);
    else                                                                                          respuesta = `No hay ninguna revista con el ISSN: ${req.params.issn}`;

    res.send(respuesta);
})

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES POST
/*****************************************************************************************************************************/

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES PUT
/*****************************************************************************************************************************/

/*****************************************************************************************************************************/
// ENRUTAMIENTO: MANEJO DE PETICIONES DELETE
/*****************************************************************************************************************************/


module.exports = router;