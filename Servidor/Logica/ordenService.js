/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/********************** DEFINICIÓN DE SERVICIOS ***********************/

const ordenService = {
    ordenService: {
        ordenServicePort: { 

            consultarOrdenesDeCompra: async function (args, callback) {
                
                try
                {
                    console.log('******************************************************************');
                    console.log('Función llamada: consultarOrdenesDeCompra\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);
    
                    // Defino la lógica del servicio
                    var resultadosConsulta = await consultarOrdenesDeCompra(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);

                    callback(null, {ordenes: resultadosConsulta});
                }
                catch(error)
                {
                    console.log(error);
                    callback(error, null);
                }
                
            },


        }

    }
}


async function consultarOrdenesDeCompra(args)
{

    try
    {
        let consultaSQL = `SELECT orden_de_compra.id AS id, estado, observaciones, fecha_de_solicitud, fecha_de_recepcion, tienda_codigo, producto_codigo, cantidad_solicitada
            FROM orden_de_compra 
            INNER JOIN item ON orden_de_compra.id = item.id_orden_de_compra
            WHERE 1=1`;

        if(args.producto_codigo) consultaSQL += ` AND item.producto_codigo = '${args.producto_codigo}' `;
        if(args.estado)          consultaSQL += ` AND orden_de_compra.estado = '${args.estado}' `;
        if(args.fecha_inicio)    consultaSQL += ` AND fecha_de_solicitud >= '${args.fecha_inicio}' `;
        if(args.fecha_final)     consultaSQL += ` AND fecha_de_solicitud <= '${args.fecha_final}' `;
        if(args.tienda_codigo)   consultaSQL += ` AND tienda_codigo = '${args.tienda_codigo}' `;

        //console.log(consultaSQL); //DEBUG

        var resultadosConsulta = await conexionDataBase.query(consultaSQL, {});            
        const datosLimpios = JSON.parse(JSON.stringify(resultadosConsulta) );

        //console.log(datosLimpios); //DEBUG
        return datosLimpios;
    }
    catch(error)
    {
        console.log(error);
    }

}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { ordenService };