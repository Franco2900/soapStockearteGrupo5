/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/********************** DEFINICIÓN DE SERVICIOS ***********************/

// Defino el servicio
const filtroService = {
    filtroService: {
        filtroServicePort: {

            traerFiltro: async function (args, callback) {
            
                try
                {
                    console.log('******************************************************************');
                    console.log('Función llamada: traerFiltro\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await traerFiltro(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);
            
                    callback(null, { filtros: resultadosConsulta });
                }
                catch(error)
                {
                    console.log(error);
                    callback(error, null);
                }
            
            },

            crearFiltro: async function (args, callback) {

                try
                {
                    console.log('******************************************************************');
                    console.log('Función llamada: crearFiltro\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    await crearFiltro(args);
                    
                    // Defino la respuesta del servidor
                    const response = {
                        mensaje: 'Filtro creado',
                    };
            
                    callback(null, response);
                }
                catch(error)
                {
                    console.log(error);
                    callback(error, null);
                }
                
            },

            modificarFiltro: async function (args, callback) {

                try
                {
                    console.log('******************************************************************');
                    console.log('Función llamada: modificarFiltro\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);
    
                    // Defino la lógica del servicio
                    await modificarFiltro(args);
                    
                    // Defino la respuesta del servidor
                    const response = {
                        mensaje: 'Filtro modificado',
                    };
            
                    callback(null, response);
                }
                catch(error)
                {
                    console.log(error);
                    callback(error, null);
                }
                
            },

            borrarFiltro: async function (args, callback) {

                try
                {
                    console.log('******************************************************************');
                    console.log('Función llamada: borrarFiltro\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);
    
                    // Defino la lógica del servicio
                    await borrarFiltro(args);
                    
                    // Defino la respuesta del servidor
                    const response = {
                        mensaje: 'Filtro borrado',
                    };
    
                    callback(null, response);
                }
                catch(error)
                {
                    console.log(error);
                    callback(error, null);
                }
                
            },

        }
    }
};


async function traerFiltro(args)
{
    try
    {
        var resultadosConsulta = await conexionDataBase.query(`SELECT * FROM filtro 
        WHERE usuario = '${args.usuario}' `, {});
        
        const datosLimpios = JSON.parse(JSON.stringify(resultadosConsulta) );

        return datosLimpios;
    }
    catch(error)
    {
        console.log(error);
    }
}


async function crearFiltro(args)
{

    try
    {
        await conexionDataBase.query(`INSERT INTO filtro 
            SET
            usuario = '${args.usuario}', 
            nombre = '${args.nombre}', 
            producto_codigo = '${args.producto_codigo}',
            tienda_codigo = '${args.tienda_codigo}', 
            fecha_inicio = '${args.fecha_inicio}',
            fecha_final = '${args.fecha_final}',
            estado = '${args.estado}' `, {});

        console.log('\nFiltro creado');

        return;
    }
    catch(error)
    {
        console.log(error);
    }

}


async function modificarFiltro(args)
{

    try
    {
        await conexionDataBase.query(`UPDATE filtro 
            SET
            producto_codigo = '${args.producto_codigo}',
            tienda_codigo = '${args.tienda_codigo}', 
            fecha_inicio = '${args.fecha_inicio}',
            fecha_final = '${args.fecha_final}', 
            estado = '${args.estado}' 
            WHERE 
            usuario = '${args.usuario}'
            AND nombre = '${args.nombre}' `, {});

            console.log('\nFiltro modificado');

        return;
    }
    catch(error)
    {
        console.log(error);
    }

}


async function borrarFiltro(args)
{

    try
    {
        await conexionDataBase.query(`DELETE FROM filtro 
            WHERE 
            usuario = '${args.usuario}'
            AND nombre = '${args.nombre}' `, {});

        console.log('\nFiltro borrado');

        return;
    }
    catch(error)
    {
        console.log(error);
    }

}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { filtroService };