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
                cargarUsuarios(args.archivoCSV);
        
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
                        
                        console.log('Archivo CSV leído completamente.');
                        resolve(results);

                    })
                    .on('error', (error) => {
                        reject(error);
                    });
    
        });


        var observaciones = '';

        // Verificación - Campos vacios (y existencia del código de tienda)
        for(var i = datosUsuarios.length-1; i >= 0 ; i--)
        {
            // Verifico que la variable NO sea una de las siguientes: false, 0, "", null, undefined, NaN 
            if(!datosUsuarios[i].Usuario)      observaciones += `En la linea ${i} falta el usuario\n`;
            if(!datosUsuarios[i].Password)     observaciones += `En la linea ${i} falta la contraseña\n`;
            if(!datosUsuarios[i].Nombre)       observaciones += `En la linea ${i} falta el nombre\n`;
            if(!datosUsuarios[i].Apellido)     observaciones += `En la linea ${i} falta el apellido\n`;
            if(!datosUsuarios[i].CodigoTienda) observaciones += `En la linea ${i} falta el codigo de la tienda\n`;

            if(!datosUsuarios[i].Usuario  || !datosUsuarios[i].Password || !datosUsuarios[i].Nombre ||
               !datosUsuarios[i].Apellido || !datosUsuarios[i].CodigoTienda)
            {
                datosUsuarios.splice(i, 1); // Elimino el elemento del arreglo
            } 
        }


        // Verificación: Estado de la tienda (si está deshabilitada, no da de alta el usuario)
        var tiendasConsulta = await conexionDataBase.query(`SELECT * FROM tienda`, {});
        // NOTA: ESTE VERIFICACIÓN NO ANDA
        for(var i = datosUsuarios.length-1; i >= 0 ; i--)
        {
            for(var j = tiendasConsulta.length-1; j >= 0 ; j--)
            {
                if(datosUsuarios[i].CodigoTienda == tiendasConsulta[i].codigo && Boolean(tiendasConsulta[j].habilitado) )
                {
                    observaciones += `La tienda de la linea ${i} esta deshabilitada`;
                    datosUsuarios.splice(i, 1);
                }
            }
        }
        

        // Verificación - Duplicidad de usuarios
        for(var i = datosUsuarios.length-1; i >= 0 ; i--)
        {
            for(var j = datosUsuarios.length-1; j >= 0 ; j--)
            {
                if(i != j && datosUsuarios[i].Usuario == datosUsuarios[j].Usuario)
                {
                    observaciones += `El usuario ${datosUsuarios[i].Usuario} esta repetido en las lineas ${j} y ${i}\n`;
                    datosUsuarios.splice(i, 1); 
                    break;
                }
            }
        }

        console.log(observaciones);

        // Carga a la base de datos
        for(var i = 0; i < datosUsuarios.length; i++)
        {
            await conexionDataBase.query(`INSERT INTO usuario 
                SET usuario = '${datosUsuarios[i].Usuario}', password = '${datosUsuarios[i].Password}',
                nombre = '${datosUsuarios[i].Nombre}', apellido = '${datosUsuarios[i].Apellido}', 
                habilitado = 1, tienda_codigo = '${datosUsuarios[i].CodigoTienda}' `);
        }
        
        fs.unlinkSync('./datosDeUsuarios.csv'); // Elimina el archivo subido

        // NOTA: FALTA DEVOLVER LAS OBSERVACIONES
        //return observaciones;
    }
    catch(error)
    {
        console.log(error);
    }
}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { servicioCargarUsuarios };
