/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');
const sharp = require('sharp');

/************************************ MÓDULOS USADOS  **********************************/
const PDFDocument = require('../node_modules/pdfkit'); // Módulo para trabajar con PDFs

/********************** DEFINICIÓN DE SERVICIOS ***********************/

// Defino el servicio
const catalogoService = {
    catalogoService: {
        catalogoServicePort: {

            crearCatalogo: async function (args, callback) {

                console.log('******************************************************************');
                console.log('Función llamada: crearCatalogo\n');

                console.log("Datos que llegan del cliente: ");
                console.log(args);

                try {
                    // Crear el PDF en base64
                    const base64Pdf = await crearCatalogoPDF(args);

                    // Definir la respuesta del servidor
                    const response = {
                        archivoPDF: base64Pdf
                    };

                    console.log('PDF creado');
                    callback(null, response);
                }
                catch (error) {
                    console.error('Error al generar el PDF:', error);
                    callback({ faultCode: 500, faultString: 'Error al generar el catálogo PDF', });
                }

            },
            modificarCatalogo: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: modificarCatalogo\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    await modificarCatalogo(args);

                    // Defino la respuesta del servidor
                    const response = {
                        mensaje: 'Catalogo modificado',
                    };

                    callback(null, response);
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            borrarCatalogo: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: borrarCatalogo\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    await borrarCatalogo(args);

                    // Defino la respuesta del servidor
                    const response = {
                        mensaje: 'Catalogo borrado',
                    };

                    callback(null, response);
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            traerCatalogos: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: traerCatalogos\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await traerCatalogos(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);
                    //console.log(JSON.stringify(resultadosConsulta, null, 2));

                    callback(null, { catalogos: resultadosConsulta });
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            asignarProductos: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: asignarProductos\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await asignarProductos(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);
                    //console.log(JSON.stringify(resultadosConsulta, null, 2));

                    callback(null, { mensaje: 'Catalogo modificado' });
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            traerProductos: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: traerProductos\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await traerProductos(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);

                    callback(null, { productos: resultadosConsulta });
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            desasignarProductos: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: desasignarProductos\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await desasignarProductos(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);
                    //console.log(JSON.stringify(resultadosConsulta, null, 2));

                    callback(null, { mensaje: 'Catalogo modificado' });
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            },
            traerNoProductos: async function (args, callback) {

                try {
                    console.log('******************************************************************');
                    console.log('Función llamada: traerNoProductos\n');

                    console.log("Datos que llegan del cliente: ");
                    console.log(args);

                    // Defino la lógica del servicio
                    var resultadosConsulta = await traerNoProductos(args);
                    console.log('\nDatos devueltos al cliente');
                    console.log(resultadosConsulta);

                    callback(null, { productos: resultadosConsulta });
                }
                catch (error) {
                    console.log(error);
                    callback(error, null);
                }

            }

        }
    }
};


// Función para crear el PDF 
async function crearCatalogoPDF(args) {

    const codigosProductos = args.codigos;
    const titulo = args.titulo;
    const codigoTienda = args.tienda_codigo;

    return new Promise(async (resolve, reject) => {
        const pdf = new PDFDocument();
        let buffers = [];

        pdf.on('data', buffers.push.bind(buffers)); // Almacenar chunks en un array
        pdf.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers); // Combinar los buffers
            const base64Pdf = pdfBuffer.toString('base64'); // Convertir a base64
            resolve(base64Pdf); // Resolver con el base64
        });

        pdf.on('error', (error) => {
            reject(error); // En caso de error
        });

        const anchoPagina = pdf.page.width;
        const altoPagina = pdf.page.height;

        // Crear el contenido del PDF
        for (const codigoProducto of codigosProductos) {
            try {
                const resultadosConsulta = await conexionDataBase.query(`SELECT * FROM producto WHERE codigo = '${codigoProducto}' `, {});

                pdf.font('Helvetica-Bold').text(`${resultadosConsulta[0].nombre}`, { align: 'center' });
                pdf.text('');
                pdf.font('Helvetica').text(`Codigo: ${resultadosConsulta[0].codigo}`);
                pdf.text(`Talle: ${resultadosConsulta[0].talle}`);
                pdf.text(`Color: ${resultadosConsulta[0].color}`);

                const imageBuffer = await sharp(resultadosConsulta[0].foto)
                    .png()
                    .resize(300, 300)
                    .toBuffer();

                pdf.image(imageBuffer, (anchoPagina / 2) - 150, (altoPagina / 2) - 150, { width: 300, height: 300 });
                pdf.rect((anchoPagina / 2) - 150, (altoPagina / 2) - 150, 300, 300).stroke();

                if (codigoProducto !== codigosProductos[codigosProductos.length - 1]) {
                    pdf.addPage();
                }

            } catch (error) {
                reject(error);
            }
        }

        try {

            await conexionDataBase.query(`INSERT INTO catalogo 
        SET
        titulo = '${titulo}',
        tienda_codigo = '${codigoTienda}' `, {});

            for (const codigoProducto of codigosProductos) {
                await conexionDataBase.query(`INSERT INTO catalogo_x_producto
            SET
            titulo = '${titulo}',
            producto_codigo='${codigoProducto}'`, {});
            }

            console.log('\nCatalogo creado');
        } catch (error) {
            console.log(error);
        }

        pdf.end(); // Finalizar el PDF
    });
};



async function modificarCatalogo(args) {
    const titulo = args.titulo;
    const codigosProductos = args.codigos;

    try {
        await conexionDataBase.query(`DELETE FROM catalogo_x_producto
        WHERE 
        titulo = '${titulo}'`, {});

        for (const codigoProducto of codigosProductos) {
            await conexionDataBase.query(`INSERT INTO catalogo_x_producto
            SET
            titulo = '${titulo}',
            producto_codigo='${codigoProducto}'`, {});
        }


        console.log('\nCatalogo modificado');

        return;
    }
    catch (error) {
        console.log(error);
    }

}




async function borrarCatalogo(args) {

    try {
        await conexionDataBase.query(`DELETE FROM catalogo_x_producto
            WHERE 
            titulo = '${args.titulo}'`, {});

        await conexionDataBase.query(`DELETE FROM catalogo 
        WHERE 
        titulo = '${args.titulo}'`, {});

        console.log('\nCatalogo borrado');

        return;
    }
    catch (error) {
        console.log(error);
    }

};


async function traerCatalogos(args) {
    try {

        var resultadosConsulta = await conexionDataBase.query(`SELECT cxp.*,p.nombre,p.talle,p.foto,p.color FROM catalogo c
        INNER JOIN catalogo_x_producto cxp on c.titulo = cxp.titulo
        INNER JOIN producto p on p.codigo = cxp.producto_codigo
        WHERE c.tienda_codigo = '${args.tienda_codigo}' `, {});

        for (var i = 0; i < resultadosConsulta.length; i++) {
            resultadosConsulta[i].foto = resultadosConsulta[i].foto.toString('base64');
        };


        // Agrupamos los productos por título, donde cada uno tiene un arreglo de productos
        resultadosConsulta = Object.values(resultadosConsulta.reduce((acc, row) => {
            // Verificamos si el titulo es distinto al anterior
            if (!acc[row.titulo]) {
                acc[row.titulo] = { titulo: row.titulo, productos: [] };
            }

            // Agrega el producto a la lista de productos para ese título
            acc[row.titulo].productos.push({
                producto_codigo: row.producto_codigo,
                nombre: row.nombre,
                talle: row.talle,
                foto: row.foto,
                color: row.color
            });

            return acc;
        }, {}));

        const datosLimpios = JSON.parse(JSON.stringify(resultadosConsulta));

        return datosLimpios;
    }
    catch (error) {
        console.log(error);
    }
}

async function asignarProductos(args) {
    const titulo = args.titulo;
    const codigosProductos = args.codigos;

    try {
        for (let codigo of codigosProductos) {
            await conexionDataBase.query(`INSERT INTO catalogo_x_producto
            SET
            titulo = '${titulo}',
            producto_codigo='${codigo}'`, {});
        }
        console.log('\nCatalogo modificado');

        return;
    }
    catch (error) {
        console.log(error);
    }

}

async function desasignarProductos(args) {
    const titulo = args.titulo;
    const codigosProductos = args.codigos;

    try {
        for (let codigo of codigosProductos) {
            await conexionDataBase.query(`DELETE FROM catalogo_x_producto
            WHERE titulo = '${titulo}'
            AND producto_codigo='${codigo}'`, {});
            console.log('\nProducto quitado');
        }
        console.log('\nCatalogo modificado');

        return;
    }
    catch (error) {
        console.log(error);
    }
}

async function traerProductos(args) {
    const titulo = args.titulo;
    try {
        const resultadosConsulta = await conexionDataBase.query(`SELECT p.codigo, p.nombre, p.talle, p.foto, p.color
            FROM PRODUCTO p, catalogo_x_producto cp
            where p.codigo = cp.producto_codigo
            AND cp.titulo = '${titulo}'`, {});
        
        for (var i = 0; i < resultadosConsulta.length; i++) {
            resultadosConsulta[i].foto = resultadosConsulta[i].foto.toString('base64');
        };

        const datosLimpios = JSON.parse(JSON.stringify(resultadosConsulta));
        return datosLimpios;
    }
    catch (error) {
        console.log(error);
    }

}

async function traerNoProductos(args) {
    const titulo = args.titulo;
    try {
        const resultadosConsulta = await conexionDataBase.query(`SELECT p.codigo, p.nombre, p.talle, p.foto, p.color
            FROM producto p
            JOIN tienda_x_producto t ON p.codigo = t.producto_codigo
            WHERE t.tienda_codigo = (
                SELECT c.tienda_codigo 
                FROM catalogo c
                WHERE c.titulo = '${titulo}'
                LIMIT 1
            )
            AND NOT EXISTS (
                SELECT 1
                FROM catalogo_x_producto c
                WHERE c.producto_codigo = p.codigo 
                AND c.titulo = '${titulo}'
            )`, {});
        
        for (var i = 0; i < resultadosConsulta.length; i++) {
            resultadosConsulta[i].foto = resultadosConsulta[i].foto.toString('base64');
        };

        const datosLimpios = JSON.parse(JSON.stringify(resultadosConsulta));
        return datosLimpios;
    }
    catch (error) {
        console.log(error);
    }
}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { catalogoService };
