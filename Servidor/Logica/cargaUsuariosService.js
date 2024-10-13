/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/************************************ MÓDULOS USADOS  **********************************/
const fs  = require('fs');  // Módulo para trabajar con archivos
const csvParser = require('csv-parser');

/********************** DEFINICIÓN DE SERVICIOS ***********************/

// Defino el servicio
const servicioCargarUsuarios = {
    cargarUsuariosService: {
        cargarUsuariosPort: {
            cargarUsuarios: function(args, callback) {
            
                console.log('******************************************************************');
                console.log("Datos enviados por la solicitud del cliente: ", args);
        
                // Defino la lógica del servicio
                cargarUsuarios(args);
        
                // Defino la respuesta del servidor
                const response = {
                    mensaje: "El mensaje fue recibido en el método cargarUsuarios",
                };
        
                callback(null, response);
            }
        }
    }
};


async function cargarUsuarios(args)
{
    try
    {
        var datosUsuarios = await new Promise((resolve, reject) => {
 
            const results = [];

            fs.createReadStream('./datosDePrueba.csv')
                .pipe(csvParser({ separator: ';', headers:['Usuario', 'Password', 'Nombre', 'Apellido', 'CodigoTienda'] }) )
                // Separo los datos por el punto y coma e indico cuales son los encabezados del archivo
                    .on('data', (fila) => {

                        //console.log(`Usuario: ${fila.Usuario}, Contraseña: ${fila.Password}, Nombre: ${fila.Nombre}, Apellido: ${fila.Apellido}, Codigo de la tienda: ${fila.CodigoTienda} `);
                        results.push(fila);

                    })
                    .on('end', () => {
                        
                        console.log('Archivo CSV leído completamente.');
                        resolve(results);

                    })
                    .on('error', (error) => {
                        reject(error);
                    });
    
        });


        for(var i = 0; i < datosUsuarios.length; i++)
        {

            await conexionDataBase.query(`INSERT INTO usuario 
                SET usuario = '${datosUsuarios[i].Usuario}', password = '${datosUsuarios[i].Password}',
                nombre = '${datosUsuarios[i].Nombre}', apellido = '${datosUsuarios[i].Apellido}', 
                habilitado = 1, tienda_codigo = '${datosUsuarios[i].CodigoTienda}' `);
        }
        
    }
    catch(error)
    {
        console.log(error);
    }
}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { servicioCargarUsuarios };
