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
        // Consigo los datos
        var id_usuario = args.id_usuario;
        var producto_codigo = args.producto_codigo;
        var estado = args.estado;
        var fecha_inicio = args.fecha_inicio;
        var fecha_final = args.fecha_final;
        var tienda_codigo = args.tienda_codigo;

        // Consulto el tipo de usuario
        let consultaTipoDeUsuario = await conexionDataBase.query(`SELECT central, codigo 
            FROM tienda 
            INNER JOIN usuario
            ON codigo = tienda_codigo
            WHERE id = ${id_usuario} `, {});

        console.log(Boolean(consultaTipoDeUsuario[0].central) ); // DEBUG
        
        // Consulto las ordenes de compra
        let consultaSQL = `SELECT orden_de_compra.id AS id, estado, observaciones, fecha_de_solicitud, fecha_de_recepcion, tienda_codigo, producto_codigo, SUM(cantidad_solicitada) AS cantidad_solicitada
            FROM orden_de_compra 
            INNER JOIN item ON orden_de_compra.id = item.id_orden_de_compra
            WHERE 1=1`;

        if(producto_codigo) consultaSQL += ` AND item.producto_codigo = '${producto_codigo}' `;
        if(estado)          consultaSQL += ` AND orden_de_compra.estado = '${estado}' `;
        if(fecha_inicio)    consultaSQL += ` AND fecha_de_solicitud >= '${fecha_inicio}' `;
        if(fecha_final)     consultaSQL += ` AND fecha_de_solicitud <= '${fecha_final}' `;
        
        // Si es usuario de tienda central
        if(Boolean(consultaTipoDeUsuario[0].central) == true && Boolean(tienda_codigo) ) 
            consultaSQL += ` AND tienda_codigo = '${tienda_codigo}' `; // Se usa la tienda_codigo que mando el usuario Si no mando ningún tienda_codigo, se consulta todas las tiendas)
        
        // Si es usuario de tienda comun
        if(Boolean(consultaTipoDeUsuario[0].central) == false )
            consultaSQL += ` AND tienda_codigo = '${consultaTipoDeUsuario[0].codigo}' `;   // Se usa la tienda_codigo del usuario

        consultaSQL += ` GROUP BY producto_codigo, estado, tienda_codigo`;

        console.log(consultaSQL); //DEBUG

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