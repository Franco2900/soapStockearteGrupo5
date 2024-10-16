/************************************ MÓDULOS USADOS  **********************************/
const http = require('http');
const fs   = require('fs');    
const soap = require('soap');

/*********************************** IMPORTACIÓN DE LA LÓGICA ***********************************/
// Lógica punto 2
const { servicioCrearFiltro } = require('./Logica/crearFiltro.js');
const archivoWSDLCrearFiltro = fs.readFileSync('./Logica/crearFiltro.wsdl' , 'utf8'); // Archivo WSDL

// Lógica punto 3
const { servicioCatalogo } = require('./Logica/catalogoService.js');
const archivoWSDLCatalogo = fs.readFileSync('./Logica/catalogo.wsdl' , 'utf8'); 

// Logica punto 4
const { servicioCargarUsuarios } = require('./Logica/cargarUsuariosService.js');
const archivoWSDLCargarUsuarios = fs.readFileSync('./Logica/cargarUsuarios.wsdl' , 'utf8');

/******************************************* CREACIÓN SERVIDOR ******************************************************/

// Creo el servidor SOAP
var server = http.createServer(function(request,response) {
    response.end('404 - No encontrado: ' + request.url);
});

server.listen(9000);


soap.listen(server, '/crearCatalogo', servicioCatalogo, archivoWSDLCatalogo, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/crearCatalogo?wsdl'); // El server escucha en la ruta indicada y muestra el archivo WSDL al agregar ?wsdl a la ruta 
});

soap.listen(server, '/cargarUsuarios', servicioCargarUsuarios, archivoWSDLCargarUsuarios, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/cargarUsuarios?wsdl'); 
});

soap.listen(server, '/crearFiltro', servicioCrearFiltro, archivoWSDLCrearFiltro, function(){
    console.log('Servidor SOAP escuchando en http://localhost:9000/crearFiltro?wsdl'); 
});