var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// 1° FORMA DE CONFIGURAR LA API, SIN AUTO-GEN(erator)
// CONFIGURACIÓN DE LA API
/*const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI    = require('swagger-ui-express');

const swaggerSpecifications = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Titulo de la API",
      version: "1.0.0"
    },

    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ]
  },

  apis: [".routes/api.js"]
}
// Todas las especificaciones de swagger:  https://swagger.io/specification/
const swaggerDoc = swaggerJsDoc(swaggerSpecifications);

app.use('/api', require('./routes/api') );
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc) );*/

// También hay que configurar cada uno de los endpoints (lo cual es complicado y toma mucho tiempo)
// FIN DE LA CONFIGURACIÓN DE LA API




// 2° FORMA DE CONFIGURAR LA API, CON AUTO-GEN(erator)
// CONFIGURACIÓN DE LA API
const swaggerJsDoc = require('./swaggerDoc.json');
const swaggerUI    = require('swagger-ui-express');

app.use('/api', require('./routes/apiRest') );
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc) );

// No hay que configurar ningún endpoints, auto-gen lo hace de forma automatica
// FIN DE LA CONFIGURACIÓN DE LA API


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index') );
app.use('/users', require('./routes/users') );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
