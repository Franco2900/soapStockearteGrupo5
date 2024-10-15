/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/********************** DEFINICIÓN DE SERVICIOS ***********************/


// Defino el servicio
const servicioCrearFiltro = {
    crearFiltroService: {
        crearFiltroPort: {
            crearFiltro: async function (args, callback) {

                console.log('******************************************************************');
                console.log("Datos enviados por la solicitud del cliente: ");
                console.log(args);

                // Defino la lógica del servicio
                await crearFiltro(args);
                
                // Defino la respuesta del servidor
                const response = {
                    mensaje: 'Filtro creado',
                };
        
                callback(null, response);
            }
        }
    }
};



async function crearFiltro(args)
{
    try
    {
        await conexionDataBase.query(`INSERT INTO filtro SET
            usuario = '${args.usuario}', nombre = '${args.nombre}', producto_codigo = '${args.producto_codigo}',
            tienda_codigo = '${args.tienda_codigo}', fecha_inicio = '${args.fecha_inicio}',
            fecha_final = '${args.fecha_final}', habilitado = ${args.habilitado} `, {});
    }
    catch(error)
    {
        console.log(error);
    }

}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { servicioCrearFiltro };