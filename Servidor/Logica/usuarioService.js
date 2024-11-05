/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/************************************ MÓDULOS USADOS  **********************************/
const fs  = require('fs');  // Módulo para trabajar con archivos
const csvParser = require('csv-parser');

/********************** DEFINICIÓN DE SERVICIOS ***********************/

// Defino el servicio
const usuarioService = {
    usuarioService: {
        usuarioServicePort: {
            cargarUsuarios: async function(args, callback) {
            
                console.log('******************************************************************');
                console.log('Función llamada: cargarUsuarios\n');

                console.log("Datos que llegan del cliente: ");
                console.log(args);

                // DEBUG
                const archivoDecodificado = Buffer.from(args.archivoCSV, 'base64'); // Verificar este paso
                fs.writeFileSync("./datosDeUsuarios.csv", archivoDecodificado); // Escribir archivo

                // Defino la lógica del servicio
                var observaciones = await cargarUsuarios(args.archivoCSV);

                // Defino la respuesta del servidor
                const response = {
                    mensaje: observaciones,
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
        const archivoDecodificado = Buffer.from(args, 'base64'); // Decodifica la cadena Base64
        
        fs.writeFileSync("./datosDeUsuarios.csv", archivoDecodificado); // Escribe el archivo decodificado en la ruta de destino

        var datosUsuarios = await new Promise((resolve, reject) => {
 
            const results = [];

            fs.createReadStream('./datosDeUsuarios.csv')
                .pipe(csvParser({ separator: ';', headers:['Usuario', 'Password', 'Nombre', 'Apellido', 'CodigoTienda'] }) )
                // Separo los datos por el punto y coma e indico cuales son los encabezados del archivo
                    .on('data', (fila) => {

                        //console.log(`Usuario: ${fila.Usuario}, Contraseña: ${fila.Password}, Nombre: ${fila.Nombre}, Apellido: ${fila.Apellido}, Codigo de la tienda: ${fila.CodigoTienda} `);
                        results.push(fila);

                    })
                    .on('end', () => {
                        
                        console.log('Archivo CSV leído completamente\n');
                        resolve(results);

                    })
                    .on('error', (error) => {
                        reject(error);
                    });
    
        });


        var observaciones = '';
        var lineas = 1; // Las lineas en los archivos .csv empiezan a partir del 1
        var lineasConErrores = [];

        // Verificación - Campos vacios (y existencia del código de tienda)
        for(var i = 0; i < datosUsuarios.length ; i++)
        {
            // Verifico que la variable NO sea una de las siguientes: false, 0, "", null, undefined, NaN 
            if(!datosUsuarios[i].Usuario)      observaciones += `En la linea ${i+lineas} falta el usuario\n`;
            if(!datosUsuarios[i].Password)     observaciones += `En la linea ${i+lineas} falta la contraseña\n`;
            if(!datosUsuarios[i].Nombre)       observaciones += `En la linea ${i+lineas} falta el nombre\n`;
            if(!datosUsuarios[i].Apellido)     observaciones += `En la linea ${i+lineas} falta el apellido\n`;
            if(!datosUsuarios[i].CodigoTienda) observaciones += `En la linea ${i+lineas} falta el codigo de la tienda\n`;

            if(!datosUsuarios[i].Usuario  || !datosUsuarios[i].Password || !datosUsuarios[i].Nombre ||
               !datosUsuarios[i].Apellido || !datosUsuarios[i].CodigoTienda)
            {
                lineasConErrores.push(i);
            } 
        }


        // Verificación: Estado de la tienda (si está deshabilitada, no da de alta el usuario)
        let tiendasConsulta = await conexionDataBase.query(`SELECT * FROM tienda`, {});
        
        for(var i = 0; i < datosUsuarios.length ; i++)
        {
            let tiendaHabilitada = true;

            // Recorro todas las tiendas hasta encontrar la tienda que pertenece al usuario
            for(var j = tiendasConsulta.length-1; j >= 0 ; j--)
            {
                if(datosUsuarios[i].CodigoTienda == tiendasConsulta[j].codigo)
                {
                    tiendaHabilitada = Boolean(tiendasConsulta[j].habilitado);
                    break;
                }
            }
            
            if (!tiendaHabilitada) 
            {
                observaciones += `La tienda de la linea ${i+lineas} está deshabilitada\n`;
                lineasConErrores.push(i);
            }
        }
        

        // Verificación - Duplicidad de usuarios
        for(var i = 0; i < datosUsuarios.length ; i++)
        {
            for(var j = 0; j < datosUsuarios.length ; j++)
            {
                if(i != j && datosUsuarios[i].Usuario == datosUsuarios[j].Usuario)
                {
                    observaciones += `El usuario ${datosUsuarios[i].Usuario} esta repetido en las lineas ${j+lineas} y ${i+lineas}\n`;
                    lineasConErrores.push(i);
                    break;
                }
            }
        }


        // Verificación - Existencia de usuario en la base de datos
        for(var i = 0; i < datosUsuarios.length ; i++)
        {
            var existeUsuario = await conexionDataBase.chequearExistenciaUsuario(datosUsuarios[i].Usuario);

            if(existeUsuario)
            {
                observaciones += `El usuario ${datosUsuarios[i].Usuario} en la linea ${i+lineas} ya existe en la base de datos\n`;
                lineasConErrores.push(i);
            }
        }

        
        // Elimino las lineas con errores
        for(var i = 0; i < datosUsuarios.length ; i++)
        {
            if(lineasConErrores.includes(i) )
            {
                datosUsuarios.splice(i, 1);
                i--;
            }
        }

        console.log(observaciones);
        console.log(`Hay en total ${lineasConErrores.length} lineas con errores`);

        // Carga a la base de datos
        for(var i = 0; i < datosUsuarios.length; i++)
        {
            await conexionDataBase.query(`INSERT INTO usuario 
                SET usuario = '${datosUsuarios[i].Usuario}', password = '${datosUsuarios[i].Password}',
                nombre = '${datosUsuarios[i].Nombre}', apellido = '${datosUsuarios[i].Apellido}', 
                habilitado = 1, tienda_codigo = '${datosUsuarios[i].CodigoTienda}' `);
        }
        
        fs.unlinkSync('./datosDeUsuarios.csv'); // Elimina el archivo subido

        if(observaciones == '') observaciones = 'No hubo problemas';
        return observaciones;
    }
    catch(error)
    {
        console.log(error);
    }
}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { usuarioService };
