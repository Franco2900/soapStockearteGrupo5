/************************************ MÓDULOS USADOS  **********************************/
const http = require('http');
const fs   = require('fs');    
const soap = require('soap');

/*********************************** IMPORTACIÓN DE LA LÓGICA ***********************************/
// Lógica punto 1
const { ordenService } = require('./Logica/ordenService.js');
const archivoWSDLOrdenService = fs.readFileSync('./Logica/ordenService.wsdl', 'utf8'); // Archivo WSDL

// Lógica punto 2
const { filtroService } = require('./Logica/filtroService.js');
const archivoWSDLFiltroService = fs.readFileSync('./Logica/filtroService.wsdl' , 'utf8'); 

// Lógica punto 3
const { catalogoService } = require('./Logica/catalogoService.js');
const archivoWSDLCatalogoService = fs.readFileSync('./Logica/catalogoService.wsdl' , 'utf8'); 

// Logica punto 4
const { usuarioService } = require('./Logica/usuarioService.js');
const archivoWSDLUsuarioService = fs.readFileSync('./Logica/usuarioService.wsdl' , 'utf8');

/******************************************* CREACIÓN SERVIDOR ******************************************************/

// Creo el servidor SOAP
var server = http.createServer(function(request,response) {
    response.end('404 - No encontrado: ' + request.url);
});

server.listen(9000); // Dirección en la que escucha el servidor

// Rutas que escucha el servidor
soap.listen(server, '/ordenService', ordenService, archivoWSDLOrdenService, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/ordenService?wsdl'); // El server escucha en la ruta indicada y muestra el archivo WSDL al agregar ?wsdl a la ruta 
});

soap.listen(server, '/filtroService', filtroService, archivoWSDLFiltroService, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/filtroService?wsdl'); 
});

soap.listen(server, '/catalogoService', catalogoService, archivoWSDLCatalogoService, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/catalogoService?wsdl'); 
});

soap.listen(server, '/usuarioService', usuarioService, archivoWSDLUsuarioService, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/usuarioService?wsdl'); 
});