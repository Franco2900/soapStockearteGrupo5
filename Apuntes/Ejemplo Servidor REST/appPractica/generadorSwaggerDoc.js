// Al ejecutar este archivo desde CMD con Node.js, se creará automaticamente toda la documentación de la API
const swaggerAutogen = require('swagger-autogen')();
const path = require('path');

const swaggerSpecifications = {
  
  info: {
    title: 'My API',
    description: 'Description'
  },

  host: 'localhost:3000/api',
  schemes: ['http']
};

const archivoGenerado = './swaggerDoc.json';
const routes = ['./routes/apiRest.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(archivoGenerado, routes, swaggerSpecifications);