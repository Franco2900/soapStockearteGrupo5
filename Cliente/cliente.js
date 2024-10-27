const soap    = require('soap');
const express = require('express');
const fs      = require('fs');
const multer  = require('multer');
const cors    = require('cors');

const app = express();

const swaggerUi = require('swagger-ui-express'); // Modulo de interfaz de usuario de Swagger
const swaggerSpecifications = require('./swagger'); // Documentación de la API

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecifications) );

app.use(cors({
    origin: 'http://localhost:5173', // Permitir sólo este origen
    methods: ['GET', 'POST'],        // Métodos permitidos, según tus necesidades
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Accept']
  }));
  

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

/**
 * @swagger
 * /filtro:
 *   get:
 *     summary: Consulta las ordenes de compra
 *     description: Consulta las ordenes de compra con un filtro personalizado
 *     tags: [Filtros]
 *     parameters:
 *       - in: query
 *         name: producto_codigo
 *         description: Código del producto a buscar (opcional)
 *         schema:
 *           type: string
 *       - in: query
 *         name: tienda_codigo
 *         description: Código de la tienda a buscar (opcional)
 *         schema:
 *           type: string
 *       - in: query
 *         name: fecha_inicio
 *         description: Fecha de inicio a buscar (opcional)
 *         schema:
 *           type: string
 *       - in: query
 *         name: fecha_final
 *         description: Fecha final a buscar (opcional)
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         description: Estado a buscar (SOLICITADA, RECHAZADA, ACEPTADA, RECIBIDA) (opcional)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos consultados correctamente
 *       500:
 *         description: Error al procesar la solicitud SOAP
 */
app.get('/filtro', async (req, res) => { 
// Para un GET, el cliente envia la request de la siguiente forma:  /endpoint?parametro1=valor1&parametro2=valor2
// Aunque puede recibir json crudo como los POST, no es una buena práctica mandar json crudo a un GET

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: consultarOrdenesDeCompra\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.query);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        var respuestaServidor = await clienteSoap.consultarOrdenesDeCompraAsync(req.query);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        res.send(respuesta);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


/**
 * @swagger
 * /filtro:
 *   post:
 *     summary: Crea un filtro.
 *     description: Crea un filtro en el sistema.
 *     tags: [Filtros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["usuario", "nombre"]
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre del usuario.
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *               producto_codigo:
 *                 type: string
 *                 description: Código del producto.
 *               tienda_codigo:
 *                 type: string
 *                 description: Código de la tienda.
 *               fecha_inicio:
 *                 type: string
 *                 description: Fecha de inicio.
 *               fecha_final:
 *                 type: string
 *                 description: Fecha final.
 *               estado:
 *                 type: string
 *                 description: Estado del filtro.
 *     responses:
 *       200:
 *         description: Filtro creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de respuesta.
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
app.post('/filtro', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        var respuestaServidor = await clienteSoap.crearFiltroAsync(req.body);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        res.send(respuesta);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


/**
 * @swagger
 * /filtro:
 *   put:
 *     summary: Modifica un filtro.
 *     description: Modifica un filtro ya existente en el sistema.
 *     tags: [Filtros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["usuario", "nombre"]
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre del usuario.
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *               producto_codigo:
 *                 type: string
 *                 description: Código del producto.
 *               tienda_codigo:
 *                 type: string
 *                 description: Código de la tienda.
 *               fecha_inicio:
 *                 type: string
 *                 description: Fecha de inicio.
 *               fecha_final:
 *                 type: string
 *                 description: Fecha final.
 *               estado:
 *                 type: string
 *                 description: Estado del filtro.
 *     responses:
 *       200:
 *         description: Filtro modificado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de respuesta.
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
app.put('/filtro', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: modificarFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        var respuestaServidor = await clienteSoap.modificarFiltroAsync(req.body);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        res.send(respuesta);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


/**
 * @swagger
 * /filtro:
 *   delete:
 *     summary: Borra un filtro.
 *     description: Borra un filtro existente en el sistema.
 *     tags: [Filtros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["usuario", "nombre"]
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre del usuario.
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *     responses:
 *       200:
 *         description: Filtro eliminado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Mensaje de respuesta.
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
app.delete('/filtro', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: borrarFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:9000/filtroService?wsdl');
        var respuestaServidor = await clienteSoap.borrarFiltroAsync(req.body);
        var respuesta = respuestaServidor[0]; 

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        res.send(respuesta);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


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
app.post('/catalogo', async (req, res) => {

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
app.post('/usuario', upload.single('archivoCSV'), async (req, res) => {

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



// Iniciar el cliente en el puerto 7000
app.listen(7000, () => {
    console.log('Cliente ejecutándose en http://localhost:7000');
});