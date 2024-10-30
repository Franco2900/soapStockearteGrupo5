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
                    const base64Pdf = await crearCatalogoPDF(args.codigos);

                    // Definir la respuesta del servidor
                    const response = {
                        archivoPDF: base64Pdf
                    };

                    console.log('PDF creado');
                    callback(null, response);   
                } 
                catch (error) 
                {
                    console.error('Error al generar el PDF:', error);
                    callback({faultCode: 500, faultString: 'Error al generar el catálogo PDF',});
                }

            }

        }
    }
};


// Función para crear el PDF 
async function crearCatalogoPDF(codigosProductos) {
    return new Promise( async (resolve, reject) => {
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

        pdf.end(); // Finalizar el PDF
    });
};

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { catalogoService };
