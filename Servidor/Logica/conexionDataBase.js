/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const mysql = require('mysql');

var conexion = mysql.createConnection({ // Creo una conexión a la base de datos
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Stockearte'
})

// Función para ejecutar un comando SQL y devolver una promesa
function query(comandoSQL, args) 
{
    return new Promise((resolve, reject) => 
    {
        conexion.query(comandoSQL, args, (error, resultados) => 
        {
            if (error) return reject(error);
            resolve(resultados);
        });
    });
}

/************************************* FUNCIONES ÚTILES ***************************************/
async function chequearExistenciaUsuario(usuario)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT usuario 
            FROM usuario 
            WHERE usuario = '${usuario}'
        ) AS existeUsuario`, {}
    );

    return Boolean(resultados[0].existeUsuario);
}


async function chequearExistenciaTienda(codigo)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT codigo 
            FROM tienda 
            WHERE codigo = '${codigo}'
        ) AS existeTienda`, {}
    );

    return Boolean(resultados[0].existeTienda);
}


async function chequearExistenciaProducto(codigo)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT codigo 
            FROM producto 
            WHERE codigo = '${codigo}'
        ) AS existeProducto`, {}
    );

    return Boolean(resultados[0].existeProducto);
}


async function chequearCasaCentral(usuario)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT usuario.usuario
            FROM usuario 
            INNER JOIN tienda 
            ON usuario.tienda_codigo = tienda.codigo 
            WHERE tienda.central = 1 AND usuario.usuario = '${usuario}'
        ) AS usuarioEsDeCasaCentral`, {}
    );

    return Boolean(resultados[0].usuarioEsDeCasaCentral);
}


async function chequearEsUsuarioValido(usuario)
{
    var respuesta = false;

    var existeUsuarioQueSolicita = await chequearExistenciaUsuario(usuario);
    var usuarioEsDeCasaCentral   = await chequearCasaCentral(usuario); 

    if (!existeUsuarioQueSolicita) 
    {
        var mensajeDeError = `ERROR: No existe el usuario que solicita los datos: ${usuario}`;
        console.log('************************************************************');
        console.log(mensajeDeError);
        respuesta = mensajeDeError;
    }
    if (!usuarioEsDeCasaCentral)
    {
        var mensajeDeError = `ERROR: El usuario ${usuario} no pertenece a la casa central`;
        console.log('************************************************************');
        console.log(mensajeDeError);
        respuesta = mensajeDeError;
    }

    if(existeUsuarioQueSolicita && usuarioEsDeCasaCentral) respuesta = true;

    return respuesta;
}

async function chequearTiendaBloqueada(codigo)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT codigo 
            FROM tienda
            WHERE codigo = '${codigo}' AND habilitado=0
        ) AS tiendaBloqueada`, {}
    );

    return Boolean(resultados[0].tiendaBloqueada);
}

async function chequearUsuarioBloqueado(usuario)
{
    var resultados = await query(
        `SELECT EXISTS (
            SELECT usuario 
            FROM usuario
            WHERE usuario = '${usuario}' AND habilitado=0
        ) AS tiendaBloqueada`, {}
    );

    return Boolean(resultados[0].tiendaBloqueada);
}

/*********************************** EXPORTACIÓN DE LA LÓGICA ***********************************/
//exports.conectarseALaBaseDeDatos = conectarseALaBaseDeDatos
exports.query = query
exports.chequearExistenciaUsuario = chequearExistenciaUsuario
exports.chequearExistenciaTienda = chequearExistenciaTienda
exports.chequearExistenciaProducto = chequearExistenciaProducto
exports.chequearCasaCentral = chequearCasaCentral
exports.chequearEsUsuarioValido = chequearEsUsuarioValido
exports.chequearTiendaBloqueada = chequearTiendaBloqueada
exports.chequearUsuarioBloqueado = chequearUsuarioBloqueado