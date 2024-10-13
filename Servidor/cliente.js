const soap = require('soap');
const express = require('express');
const bodyParser = require('body-parser');
const bodyParserXml = require('body-parser-xml');


bodyParserXml(bodyParser);
const app = express();

// Middleware para recibir el cuerpo de la solicitud como texto crudo (en este caso, XML)
//app.use(express.raw({ type: '*/*' }));

// Usar el middleware para parsear XML
app.use(bodyParser.xml({
    limit: '10MB', // Tamaño límite de los XML
    xmlParseOptions: {
        explicitArray: false // Solo si quieres un objeto en vez de arrays
    }
}));

async function crearClienteSoap(url) {
    try {
        const clienteSoap = await soap.createClientAsync(url); // Crear cliente SOAP
        console.log('Cliente SOAP creado exitosamente');
        return clienteSoap; // Retornar el cliente para usarlo más tarde
    }
    catch (error) {
        console.error('Error al crear el cliente SOAP:', error);
    }
}

async function catalogo(cliente, args) {
    try {
        const res = await cliente.crearCatalogoAsync(args);
        return res;
        }
    catch (error) {
        console.error('Error al hacer la solicitud SOAP:', error);
    }
}



// Ruta que recibe el XML y lo reenvía al servidor SOAP
app.post('/crearCatalogo', async (req, res) => {

    try{
        console.log("recibido");
        //const xmlData = req.body.toString();  // Convertimos el buffer recibido a string (XML)
        //const XML = new DOMParser().parseFromString(xmlData, 'text/xml');
        const xmlData = req.body;
        //console.log(xmlData);
        const cliente = await crearClienteSoap('http://localhost:7000/crearCatalogo?wsdl');
        const respuesta = await catalogo(cliente,xmlData);
        res.contentType('application/xml');
        res.send(respuesta);
    }catch(error){
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


// Iniciar el cliente en el puerto 3000
app.listen(8000, () => {
    console.log('Servidor ejecutándose en http://localhost:8000');
});