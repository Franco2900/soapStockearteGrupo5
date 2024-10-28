var express = require('express');
var router  = express.Router();
const soap    = require('soap');

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

/**
 * @swagger
 * /catalogo:
 *   post:
 *     summary: Crea un catálogo.
 *     description: Crea un catálogo en el sistema y devuelve un archivo PDF.
 *     tags: [Catálogos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["codigos", "titulo"]
 *             properties:
 *               codigos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de códigos para el catálogo.
 *               titulo:
 *                 type: string
 *                 description: Título del catálogo.
 *     responses:
 *       200:
 *         description: Catálogo creado exitosamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: PDF creado por el servidor recibido exitosamente
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
router.post('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearCatalogo\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.crearCatalogoAsync({ codigos: req.body.codigos });
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        const pdfBuffer = Buffer.from(respuesta.archivoPDF, 'base64'); // Converte el string base64 a un buffer
        
        // Escribe el buffer en un archivo PDF
        fs.writeFile(`${req.body.titulo}.pdf`, pdfBuffer, (error) => {
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


module.exports = router;