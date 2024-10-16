const soap    = require('soap');
const express = require('express');
const fs      = require('fs');
const multer  = require('multer');

const app = express();

/******************************************* MIDDLEWARE ***************************************************/
app.use(express.json());

const upload = multer({ dest: 'uploads/' }); // Carpeta de destino para los archivos subidos

/********************************** FUNCIONES DEL CLIENTE SOAP *******************************************/

async function crearClienteSoap(url) 
{
    try {
        const clienteSoap = await soap.createClientAsync(url); // Crear cliente SOAP
        //console.log('Cliente SOAP creado exitosamente');
        return clienteSoap; // Retornar el cliente para usarlo más tarde
    }
    catch (error) {
        console.error('Error al crear el cliente SOAP:', error);
    }
}


async function catalogo(args) 
{
    try 
    {
        var clienteSoap = await crearClienteSoap('http://localhost:9000/crearCatalogo?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const res = await clienteSoap.crearCatalogoAsync(args);
        return res[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML
    }
    catch (error) 
    {
        console.error('Error al hacer la solicitud SOAP:', error);
    }
}


async function usuarios(args) 
{
    try 
    {
        var clienteSoap = await crearClienteSoap('http://localhost:9000/cargarUsuarios?wsdl');
        const res = await clienteSoap.cargarUsuariosAsync({ archivoCSV: args });
        return res[0]; 
    }
    catch (error) 
    {
        console.error('Error al hacer la solicitud SOAP:', error);
    }
}


async function filtro(args)
{
    try 
    {
        var clienteSoap = await crearClienteSoap('http://localhost:9000/crearFiltro?wsdl');
        const res = await clienteSoap.crearFiltroAsync(args);
        return res[0]; 
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

        const pdfBuffer = Buffer.from(respuesta.archivoPDF, 'base64'); // Converte el string base64 a un buffer
        
        // Escribe el buffer en un archivo PDF
        fs.writeFile('catalogo.pdf', pdfBuffer, (error) => {
            if (error) console.error('Error al escribir el archivo PDF:', error);
            else       console.log('PDF creado por el servidor recibido exitosamente.');
        });

        res.send(respuesta);
    }
    catch(error){
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


app.post('/cargarUsuarios', upload.single('archivoCSV'), async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: cargarUsuarios");

        console.log('Archivo subido por el front-end:');
        console.log(req.file); 
        const archivoCSV = fs.readFileSync(req.file.path); // Lee el archivo subido

        //const archivoCSV = fs.readFileSync('./datosDePrueba.csv');        // Lee el archivo CSV de manera sincrónica
        const archivoBase64 = Buffer.from(archivoCSV).toString('base64'); // Codifica el contenido del archivo a Base64

        const respuesta = await usuarios(archivoBase64); 
        console.log('Respuesta del servidor');
        console.log(respuesta);

        fs.unlinkSync(req.file.path); // Elimina el archivo subido

        res.send(respuesta);
    }
    catch(error){
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});



app.post('/crearFiltro', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearFiltro");
        console.log("Datos que llegan del front-end: ");
        console.log(req.body);


        const respuesta = await filtro(req.body); 
        console.log("Respuesta del servidor: ");
        console.log(respuesta);

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