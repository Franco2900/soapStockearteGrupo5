const http = require('http');
const fs = require('fs');    
const soap = require('soap');

const { servicioCatalogo } = require('./Logica/catalogoService');
const archivoWSDLCatalogo = fs.readFileSync('./Logica/catalogo.wsdl' , 'utf8'); // Archivo WSDL

/******************************************* CREACIÓN SERVIDOR ******************************************************/

// Creo el servidor SOAP
var server = http.createServer(function(request,response) {
    response.end('404 - No encontrado: ' + request.url);
});

server.listen(9000);


soap.listen(server, '/crearCatalogo', servicioCatalogo, archivoWSDLCatalogo, function(){
    console.log('Servidor SOAP ejecutandose en http://localhost:9000/crearCatalogo?wsdl'); // El server escucha en la ruta indicada y muestra el archivo WSDL al agregar ?wsdl a la ruta 
});