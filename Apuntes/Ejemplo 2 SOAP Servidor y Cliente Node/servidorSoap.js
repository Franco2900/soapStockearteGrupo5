const soap = require('soap');
const fs   = require('fs');
const http = require('http');

// Defino el servicio
const service = {
  saludarService: {
    saludarPort: {
      saludar: function(args, callback) {
        
        console.log("Datos enviados por la solicitud del cliente: ", args);

        // Defino la lógica del servicio
        var saludo = `Hola ${args.nombre}`;
        var saludoCordial = `Buenas ${args.nombre}`;

        // Defino la respuesta del servidor
        const response = {
          saludo: saludo,
          saludoCordial: saludoCordial
        };

        callback(null, response);
      }
    }
  }
};


const archivoWSDL = fs.readFileSync('plantilla.wsdl' , 'utf8'); // Archivo WSDL

// Creo el servidor SOAP
var server = http.createServer(function(request,response) {
  response.end('404: Not Found: ' + request.url);
});

server.listen(8080);

soap.listen(server, '/saludar', service, archivoWSDL, function(){
  console.log('SOAP server running at http://localhost:8080/saludar?wsdl'); // El server escucha en http://localhost:8000/clima y provee el archivo WSDL al agregar ?wsdl a la ruta 
});