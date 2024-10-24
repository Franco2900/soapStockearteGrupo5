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
        const clienteSoap = await soap.createClientAsync(url); // Crea cliente SOAP
        
        //console.log('Cliente SOAP creado exitosamente');
        clienteSoap.on('message', (xml) => {
            console.log('\nXML Enviado: ');
            console.log(xml);
        });

        return clienteSoap; // Retorna el cliente para usarlo más tarde
    }
    catch (error) {
        console.error('Error al crear el cliente SOAP:', error);
    }
}


/************************************** RUTAS ******************************************/

app.get('/filtro', async (req, res) => { 
// Para un GET, el cliente envia la request de la siguiente forma:  /endpoint?parametro1=valor1&parametro2=valor2
// Aunque puede recibir json crudo como los POST, no es una buena práctica mandar json crudo a un GET

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: consultarOrdenesDeCompra");
        console.log("Datos que llegan del front-end: ");
        console.log(req.query);

        //var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        //const respuestaServidor = await clienteSoap.consultarOrdenesDeCompra(req.body);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        //console.log("Respuesta del servidor: ");
        //console.log(respuesta);

        res.send(respuesta);
    }
    catch
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});

app.post('/filtro', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearFiltro");
        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        const respuestaServidor = await clienteSoap.crearFiltroAsync(req.body);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        //console.log("Respuesta del servidor: ");
        //console.log(respuesta);

        res.send(respuesta);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


app.post('/catalogo', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearCatalogo");
        console.log("Datos que llegan del front-end: " + req.body.codigos);
        
        const args = {
            codigos: req.body.codigos 
        };

        var clienteSoap = await crearClienteSoap('http://localhost:9000/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.crearCatalogoAsync(args);
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML

        // DEBUG
        //console.log("Respuesta del servidor: ");
        //console.log(respuesta);

        const pdfBuffer = Buffer.from(respuesta.archivoPDF, 'base64'); // Converte el string base64 a un buffer
        
        // Escribe el buffer en un archivo PDF
        fs.writeFile('catalogo.pdf', pdfBuffer, (error) => {
            if (error) console.error('Error al escribir el archivo PDF:', error);
            else       console.log('PDF creado por el servidor recibido exitosamente');
        });

        res.send('PDF creado por el servidor recibido exitosamente');
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


app.post('/usuario', upload.single('archivoCSV'), async (req, res) => {

    try {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: cargarUsuarios");
        console.log('Archivo subido por el front-end:');
        console.log(req.file);

        // Verifica que el archivo existe
        if (!req.file) {
            return res.status(400).send('Archivo CSV no subido');
        }

        var archivo = fs.readFileSync(req.file.path); // Lee el archivo subido
        var archivoBase64 = Buffer.from(archivo).toString('base64'); // Codifica el contenido del archivo a Base64
        //console.log(archivoBase64); // DEBUG

        var clienteSoap = await crearClienteSoap('http://localhost:9000/usuarioService?wsdl');
        var respuestaServidor = await clienteSoap.cargarUsuariosAsync({ archivoCSV: archivoBase64 });
        var respuesta = respuestaServidor[0];

        // DEBUG
        //console.log('Respuesta del servidor');
        //console.log(respuesta);

        fs.unlinkSync(req.file.path); // Elimina el archivo subido
        res.send(respuesta);

    } catch(error) 
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});



// Iniciar el cliente en el puerto 7000
app.listen(7000, () => {
    console.log('Cliente ejecutándose en http://localhost:7000');
});