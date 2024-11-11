const express = require('express');
const cors    = require('cors');

const app = express();

const swaggerUi = require('swagger-ui-express');    // Modulo de interfaz de usuario de Swagger
const swaggerSpecifications = require('./swagger'); // Documentación de la API

/******************************************* MIDDLEWARE ***************************************************/
app.use(express.json() );

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecifications) ); // Indico en que debe mostrar la documentación swagger

app.use(cors({
    origin: 'http://localhost:5173', // Permite sólo este origen
    methods: ['GET', 'POST', 'PUT','DELETE' ],        // Métodos permitidos, según tus necesidades
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Accept']
}));

/******************************************* RUTAS ***************************************************/

app.use('/orden', require('./Rutas/orden.js') );
app.use('/filtro', require('./Rutas/filtro.js') );
app.use('/catalogo', require('./Rutas/catalogo.js') );
app.use('/usuario', require('./Rutas/usuario.js') );

/******************************************* INICIO CLIENTE ***************************************************/

// Inicia el cliente en el puerto 7000
app.listen(7000, () => {
    console.log('Cliente ejecutándose en http://localhost:7000');
});