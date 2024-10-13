const soap = require('soap');
const express = require('express');
const fs = require('fs');

const app = express();

/******************************************* MIDDLEWARE ***************************************************/

app.use(express.json());
/********************************** FUNCIONES DEL CLIENTE SOAP *******************************************/

async function crearClienteSoap(url) 
{
    try {
        const clienteSoap = await soap.createClientAsync(url); // Crear cliente SOAP
        console.log('Cliente SOAP creado exitosamente');
        return clienteSoap; // Retornar el cliente para usarlo más tarde
    }
    catch (error) {
        console.error('Error al crear el cliente SOAP:', error);
    }
}


var clienteSoap;

(async function() {
    clienteSoap = await crearClienteSoap('http://localhost:9000/crearCatalogo?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
})();


async function catalogo(args) 
{
    try 
    {
        const res = await clienteSoap.crearCatalogoAsync(args);
        return res[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML
    }
    catch (error) 
    {
        console.error('Error al hacer la solicitud SOAP:', error);
    }
}


/************************************** RUTAS ******************************************/

app.post('/crearCatalogo', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearCatalogo");
        console.log("Datos que llegan del front-end: " + req.body.codigos);
        
        const args = {
            codigos: req.body.codigos 
        };

        const respuesta = await catalogo(args); 
        //console.log("Respuesta del servidor: ");
        //console.log(respuesta);

        // Convertir el string base64 a un buffer
        const pdfBuffer = Buffer.from(respuesta.archivoPDF, 'base64');
        
        // Escribir el buffer en un archivo PDF
        fs.writeFile('catalogo.pdf', pdfBuffer, (error) => {
            if (error) {
                console.error('Error al escribir el archivo PDF:', error);
            } else {
                console.log('PDF creado exitosamente.');
            }
        });

        res.send(respuesta);
    }
    catch(error){
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


// Iniciar el cliente en el puerto 7000
app.listen(7000, () => {
    console.log('Cliente ejecutándose en http://localhost:7000');
});