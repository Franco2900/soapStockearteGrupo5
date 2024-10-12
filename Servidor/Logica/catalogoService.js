/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('./conexionDataBase.js');

/************************************ MÓDULOS USADOS  **********************************/
const PDFDocument = require('pdfkit'); // Módulo para trabajar con PDFs
const fs = require('fs');              // Módulo para trabajar con archivos

/********************** DEFINICIÓN DE SERVICIOS ***********************/

// Defino el servicio
const servicioCatalogo = {
    crearCatalogoService: {
        crearCatalogoPort: {
            crearCatalogo: function(args, callback) {
            
                console.log("Datos enviados por la solicitud del cliente: ", args);
        
                // Defino la lógica del servicio
                crearCatalogoPDF(args.codigos)
        
                // Defino la respuesta del servidor
                const response = {
                    mensaje: "Todo bien",
                };
        
                callback(null, response);
            }
        }
    }
};


async function crearCatalogoPDF(codigosProductos)
{
    try
    {
        const pdf = new PDFDocument(); // Creo un PDF
        const stream = fs.createWriteStream(`Catalogo ${codigosProductos.join(" ")}.pdf`) // Indico en que archivo se va a poner todo lo que haga. Si ya existe, lo sobreescribe
        pdf.pipe(stream); 

        const anchoPagina = pdf.page.width;  // Define el ancho de la pagina
        const altoPagina  = pdf.page.height; // Define el alto de la pagina

        // Creo el contenido del PDF
        for(var i = 0; i < codigosProductos.length; i++)
        {
            var resultadosConsulta = await conexionDataBase.query(`SELECT * FROM producto WHERE codigo = '${codigosProductos[i]}' `, {});

            pdf.font('Helvetica-Bold').text(`${resultadosConsulta[0].nombre}`, { align: 'center'} );
            pdf.text('');

            pdf.font('Helvetica').text(`Codigo: ${resultadosConsulta[0].codigo}` );
            pdf.text(`Talle: ${resultadosConsulta[0].talle}` );
            pdf.text(`Color: ${resultadosConsulta[0].color}` );

            //console.log(Buffer.isBuffer(resultadosConsulta[i].foto) );
            
            let bufferImagen = Buffer.from(resultadosConsulta[0].foto.toString(), 'base64'); // De la base de datos me llega un buffer y lo parseo a un string
            
            pdf.image(bufferImagen, (anchoPagina/2)-150, (altoPagina/2)-150, { width: 300, height:300 } ); // Agrega una imagen al PDF            
            pdf.rect( (anchoPagina/2)-150, (altoPagina/2)-150, 300, 300).stroke();                         // Agrega un rectángulo para resaltar el borde de la imagen

            if(i != codigosProductos.length - 1) pdf.addPage(); // Añado una nueva página (solo si no es el último producto)
        }

        pdf.end(); // Finaliza el pdf

        stream.on('finish', () => { // Evento que se ejecuta al terminar el stream de datos
            console.log('PDF creado');
        });

    }
    catch(error)
    {
        console.log(error);
    }
}


/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
module.exports = { servicioCatalogo };
