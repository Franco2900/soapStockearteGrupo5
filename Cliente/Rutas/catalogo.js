var express = require('express');
var router  = express.Router();

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
 * /catalogo:
 *   get:
 *     summary: Trae los catalogos.
 *     description: Trae todos los catalogos de la tienda.
 *     tags: [Catálogos]
 *     parameters:
 *       - in: query
 *         name: tienda_codigo
 *         required: true
 *         description: Codigo de la tienda.
 *         schema:
 *           type: string
 *           example: "T004"
 *     responses:
 *       200:
 *         description: Datos consultados correctamente
 *       500:
 *         description: Error al procesar la solicitud SOAP
 */
router.get('/', async (req, res) => { 
    // Para un GET, el cliente envia la request de la siguiente forma:  /endpoint?parametro1=valor1&parametro2=valor2
    // Aunque puede recibir json crudo como los POST, no es una buena práctica mandar json crudo a un GET
        
        try
        {
            console.log("*****************************************************************");
            console.log("Solicitud del front-end recibida. Método llamado: traerCatalogos\n");
        
            console.log("Datos que llegan del front-end: ");
            console.log(req.query);
        
            var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl');
            var respuestaServidor = await clienteSoap.traerCatalogosAsync(req.query);
            var respuesta = respuestaServidor[0]; 
        
            // DEBUG
            console.log("\nRespuesta del servidor: ");
            console.log(respuesta);
            //console.log(JSON.stringify(respuesta, null, 2));

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
 * /catalogo/productos:
 *   get:
 *     summary: Trae los productos de un catalogo.
 *     description: Trae todos los productos de un catalogo especifico.
 *     tags: [Catálogos]
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: true
 *         description: Titulo del catalogo.
 *         schema:
 *           type: string
 *           example: "Titulo"
 *     responses:
 *       200:
 *         description: Datos consultados correctamente
 *       500:
 *         description: Error al procesar la solicitud SOAP
 */
router.get('/productos', async (req, res) => { 
    // Para un GET, el cliente envia la request de la siguiente forma:  /endpoint?parametro1=valor1&parametro2=valor2
    // Aunque puede recibir json crudo como los POST, no es una buena práctica mandar json crudo a un GET
        
        try
        {
            console.log("*****************************************************************");
            console.log("Solicitud del front-end recibida. Método llamado: traerProductos\n");
        
            console.log("Datos que llegan del front-end: ");
            console.log(req.query);
        
            var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl');
            var respuestaServidor = await clienteSoap.traerProductosAsync({titulo: req.query.titulo});
            var respuesta = respuestaServidor[0]; 
        
            // DEBUG
            console.log("\nRespuesta del servidor: ");
            console.log(respuesta);
            //console.log(JSON.stringify(respuesta, null, 2));

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
 * /catalogo/noProductos:
 *   get:
 *     summary: Trae los productos que no tiene un catalogo pero que tiene la tienda.
 *     description: Trae todos los productos que no tiene un catalogo especifico pero que tiene la tienda.
 *     tags: [Catálogos]
 *     parameters:
 *       - in: query
 *         name: titulo
 *         required: true
 *         description: Titulo del catalogo.
 *         schema:
 *           type: string
 *           example: "Titulo"
 *     responses:
 *       200:
 *         description: Datos consultados correctamente
 *       500:
 *         description: Error al procesar la solicitud SOAP
 */
router.get('/noProductos', async (req, res) => { 
    // Para un GET, el cliente envia la request de la siguiente forma:  /endpoint?parametro1=valor1&parametro2=valor2
    // Aunque puede recibir json crudo como los POST, no es una buena práctica mandar json crudo a un GET
        
        try
        {
            console.log("*****************************************************************");
            console.log("Solicitud del front-end recibida. Método llamado: traerNoProductos\n");
        
            console.log("Datos que llegan del front-end: ");
            console.log(req.query);
        
            var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl');
            var respuestaServidor = await clienteSoap.traerNoProductosAsync({titulo: req.query.titulo});
            var respuesta = respuestaServidor[0]; 
        
            // DEBUG
            console.log("\nRespuesta del servidor: ");
            console.log(respuesta);
            //console.log(JSON.stringify(respuesta, null, 2));

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
 *             required: ["codigos", "titulo", "tienda_codigo"]
 *             properties:
 *               codigos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Lista de códigos para el catálogo.
 *               titulo:
 *                 type: string
 *                 description: Título del catálogo.
 *               tienda_codigo:
 *                 type: string
 *                 description: Tienda del usuario.
 *           example:
 *             {
 *               "codigos": [
 *                 "P008",
 *                 "P009"
 *               ],
 *               "titulo": "Prueba",
 *               "tienda_codigo": "T004"
 *             }
 *     responses:
 *       200:
 *         description: Catálogo creado exitosamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Catálogo creado por el servidor recibido exitosamente
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

        var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.crearCatalogoAsync({ codigos: req.body.codigos, titulo:req.body.titulo, tienda_codigo:req.body.tienda_codigo});
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML
        if (respuesta == null) {
            res.send(`<script>alert('Ya existe un catalogo con el mismo titulo.'); window.location.href = '/';</script>`);
            
        } else {
            // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        //res.send('Catálogo creado por el servidor recibido exitosamente');
        res.send(respuestaServidor[0]);
        }
    }
        
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


/**
 * @swagger
 * /catalogo/productos:
 *   post:
 *     summary: Asigna productos a un catálogo.
 *     description: Asigna productos a un catálogo ya existente.
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
 *           example:
 *             {
 *               "codigos": [
 *                 "P008",
 *                 "P009"
 *               ],
 *               "titulo": "Prueba"
 *             }
 *     responses:
 *       200:
 *         description: Productos asignados exitosamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Productos asignados exitosamente
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
router.post('/productos', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: asignarProductos\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.asignarProductosAsync({ codigos: req.body.codigos, titulo:req.body.titulo});
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        //res.send('Productos asignados exitosamente');
        res.send(respuestaServidor[0]);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }

});


/**
 * @swagger
 * /catalogo/productos:
 *   delete:
 *     summary: Desasigna productos a un catálogo.
 *     description: Desasigna productos a un catálogo ya existente.
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
 *           example:
 *             {
 *               "codigos": [
 *                 "P008",
 *                 "P009"
 *               ],
 *               "titulo": "Prueba"
 *             }
 *     responses:
 *       200:
 *         description: Productos desasignados exitosamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Productos desasignados exitosamente
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
router.delete('/productos', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: desasignarProductos\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.desasignarProductosAsync({ codigos: req.body.codigos, titulo:req.body.titulo});
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        //res.send('Productos desasignados exitosamente');
        res.send(respuestaServidor[0]);
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
 *   put:
 *     summary: Modifica un catálogo.
 *     description: Modifica un catálogo ya existente en el sistema.
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
 *           example:
 *             {
 *               "codigos": [
 *                 "P010",
 *                 "P009"
 *               ],
 *               "titulo": "Prueba"
 *             }
 *     responses:
 *       200:
 *         description: Catálogo modificado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   description: Catálogo modificado exitosamente.
 *             example:
 *               {
 *                 "mensaje": "Catálogo modificado exitosamente."
 *               }
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
router.put('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: modificarCatalogo\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl');
        var respuestaServidor = await clienteSoap.modificarCatalogoAsync(req.body);
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
 *   delete:
 *     summary: Borrar un catálogo.
 *     description: Borra un catálogo en el sistema.
 *     tags: [Catálogos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["titulo"]
 *             properties:
 *               titulo:
 *                 type: string
 *                 description: Título del catálogo.
 *                 example: "Prueba"
 *     responses:
 *       200:
 *         description: Catálogo borrado exitosamente.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Catálogo borrado exitosamente.
 *       500:
 *         description: Error al procesar la solicitud SOAP.
 */
router.delete('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: borrarCatalogo\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/catalogoService?wsdl'); // El cliente tiene que escuchar en la misma ruta que el servidor provee
        const respuestaServidor = await clienteSoap.borrarCatalogoAsync({titulo:req.body.titulo});
        var respuesta = respuestaServidor[0]; // Devuelve 3 cosas: los datos procesados, la respuesta del servidor en formato XML y la solicitud enviada por el cliente en formato XML

        // DEBUG
        console.log("\nRespuesta del servidor: ");
        console.log(respuesta);

        res.send('Catalogo borrado exitosamente');
    }
    catch(error)
    {
        console.log(error);
        res.status(500).send('Error al procesar la solicitud SOAP');
    }



});

module.exports = router;