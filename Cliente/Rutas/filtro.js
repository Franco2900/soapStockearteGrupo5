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
 * /filtro:
 *   get:
 *     summary: Trae los filtros.
 *     description: Trae todos los filtros que creo un usuario.
 *     tags: [Filtros]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         required: true
 *         description: Nombre del usuario.
 *         schema:
 *           type: integer
 *           example: 1
 *           minimum: 1
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
        console.log("Solicitud del front-end recibida. Método llamado: traerFiltro\n");
    
        console.log("Datos que llegan del front-end: ");
        console.log(req.query);
    
        var clienteSoap = await crearClienteSoap('http://localhost:6789/filtroService?wsdl');
        var respuestaServidor = await clienteSoap.traerFiltroAsync(req.query);
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
 *             required: ["id_usuario", "nombre"]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: Nombre del usuario.
 *                 example: 10
 *                 minimum: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *                 example: "Filtro 2024"
 *               producto_codigo:
 *                 type: string
 *                 description: Código del producto.
 *                 example: ""
 *               tienda_codigo:
 *                 type: string
 *                 description: Código de la tienda.
 *                 example: "T009"
 *               fecha_inicio:
 *                 type: string
 *                 description: Fecha de inicio.
 *                 example: "2024-01-01"
 *               fecha_final:
 *                 type: string
 *                 description: Fecha final.
 *                 example: "2024-12-31"
 *               estado:
 *                 type: string
 *                 description: Estado del filtro.
 *                 example: ""
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
router.post('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: crearFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/filtroService?wsdl');
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
 *             required: ["id_usuario", "nombre"]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: Nombre del usuario.
 *                 example: 10
 *                 minimun: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *                 example: "Filtro 2024"
 *               producto_codigo:
 *                 type: string
 *                 description: Código del producto.
 *                 example: ""
 *               tienda_codigo:
 *                 type: string
 *                 description: Código de la tienda.
 *                 example: "T009"
 *               fecha_inicio:
 *                 type: string
 *                 description: Fecha de inicio.
 *                 example: ""
 *               fecha_final:
 *                 type: string
 *                 description: Fecha final.
 *                 example: ""
 *               estado:
 *                 type: string
 *                 description: Estado del filtro.
 *                 example: "ACEPTADA"
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
router.put('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: modificarFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/filtroService?wsdl');
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
 *             required: ["id_usuario", "nombre"]
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 description: Nombre del usuario.
 *                 example: 10
 *                 minimun: 1
 *               nombre:
 *                 type: string
 *                 description: Nombre del filtro.
 *                 example: "Filtro 2024"
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
router.delete('/', async (req, res) => {

    try
    {
        console.log("*****************************************************************");
        console.log("Solicitud del front-end recibida. Método llamado: borrarFiltro\n");

        console.log("Datos que llegan del front-end: ");
        console.log(req.body);

        var clienteSoap = await crearClienteSoap('http://localhost:6789/filtroService?wsdl');
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

module.exports = router;