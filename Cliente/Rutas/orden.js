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
 * /orden:
 *   get:
 *     summary: Consulta las ordenes de compra
 *     description: Consulta las ordenes de compra según los datos pasados
 *     tags: [Ordenes]
 *     parameters:
 *       - in: query
 *         name: id_usuario
 *         description: Usuario que realiza la consulta
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: producto_codigo
 *         description: Código del producto a buscar (opcional)
 *         schema:
 *           type: string
 *           example: "P005"
 *       - in: query
 *         name: tienda_codigo
 *         description: Código de la tienda a buscar (opcional)
 *         schema:
 *           type: string
 *           example: "T002"
 *       - in: query
 *         name: fecha_inicio
 *         description: Fecha de inicio a buscar (opcional)
 *         schema:
 *           type: string
 *           example: "2024-10-29"
 *       - in: query
 *         name: fecha_final
 *         description: Fecha final a buscar (opcional)
 *         schema:
 *           type: string
 *           example: "2024-11-01"
 *       - in: query
 *         name: estado
 *         description: Estado a buscar (SOLICITADA, RECHAZADA, ACEPTADA, RECIBIDA) (opcional)
 *         schema:
 *           type: string
 *           example: "RECIBIDA"
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
        console.log("Solicitud del front-end recibida. Método llamado: consultarOrdenesDeCompra\n");
    
        console.log("Datos que llegan del front-end: ");
        console.log(req.query);
    
        var clienteSoap = await crearClienteSoap('http://localhost:9000/ordenService?wsdl');
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


module.exports = router;