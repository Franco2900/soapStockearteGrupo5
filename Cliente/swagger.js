const swaggerJsDoc = require('swagger-jsdoc');

// CONFIGURACIÓN DE LA API
const options = {

  definition: 
  {
    openapi: '3.0.0',

    info: {
      title: 'Mi API',
      version: '1.0.0',
    },

    servers: [
      {
        url: 'http://localhost:7000',
      },
    ],

  },
  
  apis: ['./cliente.js'], // Rutas donde se encuentran los comentarios JSDoc

};

const swaggerSpecifications = swaggerJsDoc(options);

/******************************* EXPORTACIÓN DE LA LÓGICA *******************************/
module.exports = swaggerSpecifications;