var express = require('express');
var router  = express.Router();

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); // Carpeta de destino para los archivos subidos

const fs      = require('fs');

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
 * /usuario:
 *   post:
 *     summary: Carga usuarios desde un archivo CSV.
 *     description: Carga usuarios en el sistema desde un archivo CSV.
 *     tags: [Usuarios]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivoCSV:
 *                 type: string
 *                 format: binary
 *                 description: Archivo CSV con datos de usuarios.
 *             required:
 *               - archivoCSV
 *     responses:
 *       200:
 *         description: Usuarios cargados exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de respuesta.
 *       400:
 *         description: Archivo CSV no subido.
 *       500:
 *         description: Error al procesar la solicitud.
 */
router.post('/', upload.single('archivoCSV'), async (req, res) => {

    try {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: cargarUsuarios\n");

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
        console.log('\nRespuesta del servidor');
        console.log(respuesta);

        fs.unlinkSync(req.file.path); // Elimina el archivo subido
        res.send(respuesta);

    } catch(error) 
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});

module.exports = router;