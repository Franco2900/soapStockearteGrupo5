/************************************ CONFIGURACIÓN DE LA BASE DE DATOS **********************************/
const conexionDataBase = require('../Servidor/Logica/conexionDataBase.js');

/************************************ FUNCIONES DE CARGA DE DATOS **********************************/

async function chequearExistencia(tabla, columna, valor) {
    const resultados = await conexionDataBase.query(`SELECT EXISTS(SELECT ${columna} FROM ${tabla} WHERE ${columna} = ?) AS existe`, [valor]);
    return resultados[0].existe;
}

async function cargarTienda(registro)
{
    var existeTienda = await chequearExistencia('tienda', 'codigo', registro.codigo);

    if(existeTienda) console.log('ERROR: Ya existe la tienda ' + registro.codigo);
    else
    {
        try
        {
            await conexionDataBase.query('INSERT INTO tienda SET ?', registro);
            console.log('Se hizo el alta de la tienda con el codigo: ' + registro.codigo);
        }
        catch(error) {console.log(error);}
    }
}


async function cargarUsuario(registro)
{
    const existeUsuario = await chequearExistencia('usuario', 'usuario', registro.usuario);
    const existeTienda  = await chequearExistencia('tienda', 'codigo', registro.tienda_codigo);

    if(existeUsuario) console.log('ERROR: Ya existe el usuario ' + registro.usuario);
    if(!existeTienda) console.log('ERROR: No existe la tienda');
    
    if(!existeUsuario && existeTienda) // Si no existe el usuario y si existe la tienda
    {
        try
        {
            await conexionDataBase.query('INSERT INTO usuario SET ?', registro);
            console.log('Se hizo el alta del usuario: ' + registro.usuario);
        }
        catch(error) {console.log(error);}
    }
}

async function cargarProducto(registro)
{
    var resultadoProducto = await conexionDataBase.query('SELECT EXISTS(SELECT codigo from producto where codigo = ?) AS existe', [registro.codigoProducto]);
    var existeProducto = resultadoProducto[0].existe;

    if (existeProducto) { //SOLO VA A INSERTAR EN TIENDAS QUE EXISTE PORQUE TIENE QUE SELECCIONAR
        console.log('ERROR: Ya existe el producto ' + registro.codigoProducto);
    }
    else {
        try{ //INSERTO EL PRODUCTO
            await conexionDataBase.query(
                'INSERT INTO producto (codigo, nombre, talle, foto, color) VALUES (?, ?, ?, ?, ?)',
                [registro.codigoProducto, registro.nombre, registro.talle, registro.foto, registro.color]
            );
        } catch(error) {console.log(error);}

        registro.tiendaObject.forEach(async tienda => { //POR CADA TIENDA, INSERTO EN LA TABLA INTERMEDIA
            var resultadoTiendas = await conexionDataBase.query(`SELECT EXISTS(SELECT stock from tienda_x_producto WHERE producto_codigo = ? AND tienda_codigo = ?) AS existe`, [registro.codigoProducto, tienda.codigo]);    
            var existeProductoTienda = resultadoTiendas[0].existe;
    
            
            if(existeProductoTienda) {
                console.log('ERROR: Ya existe el producto en la tienda ' + tienda.codigo);
            } else {
                try{
                    await conexionDataBase.query(
                            'INSERT INTO tienda_x_producto (tienda_codigo, producto_codigo, stock) VALUES (?, ?, ?)',
                            [tienda.codigo, registro.codigoProducto, 0]
                        );
                        
                } catch(error) {console.log(error);}
            }
            
        });

        console.log('Se hizo el alta del producto: ' + registro.codigoProducto);
    }
}


async function cargarOrdenDeCompra(registro)
{
    await conexionDataBase.query('INSERT INTO orden_de_compra SET ?', registro);
    console.log('Se hizo el alta de la orden de compra');
}


async function cargarItem(registro)
{
    await conexionDataBase.query('INSERT INTO item SET ?', registro);
    console.log('Se hizo el alta del item');
}

/************************** DATOS HARDCODEADOS PARA REALIZAR PRUEBAS ****************************/ 
const fs = require('fs');  // Módulo para trabajar con archivos

async function cargaDatosDePrueba()
{
    console.log('Cargando datos de prueba a la base de datos Stockearte');

    const tiendas = [
        { codigo: "sanji32542", direccion: "Lacoste 1920",           ciudad: "Las Toninas",       provincia: "Buenos Aires", habilitado: false, central: true },
        { codigo: "asdfgh987",  direccion: "Juan Justo 200",         ciudad: "Monte Chingolo",    provincia: "Buenos Aires", habilitado: true,  central: false },
        { codigo: "xcbewu13",   direccion: "Canarias 1850",          ciudad: "Ciudad de Cordoba", provincia: "Cordoba",      habilitado: true,  central: false },
        { codigo: "pqr789xyz",  direccion: "Av. Libertador 3000",    ciudad: "Buenos Aires",      provincia: "Buenos Aires", habilitado: true,  central: false },
        { codigo: "lmno456stu", direccion: "Calle Falsa 123",        ciudad: "La Plata",          provincia: "Buenos Aires", habilitado: false, central: false },
        { codigo: "wxyz123abc", direccion: "Avenida San Martín 456", ciudad: "Rosario",           provincia: "Santa Fe",     habilitado: true,  central: false }
    ];

    for (const tienda of tiendas) {
        await cargarTienda(tienda);
    }
    
    const usuarios = [
        { nombre: 'Pepe',    apellido: 'Argento',   usuario: 'Racing Campeon', password: '1967',            habilitado: true,  tienda_codigo: 'sanji32542' },
        { nombre: 'Moni',    apellido: 'Argento',   usuario: 'La Peluca',      password: 'qwerty',          habilitado: true,  tienda_codigo: 'asdfgh987' },
        { nombre: 'Unlero',  apellido: 'Sistemas',  usuario: 'The One',        password: 'fñnbqio_@748e5a', habilitado: false, tienda_codigo: 'asdfgh987' },
        { nombre: 'Horacio', apellido: 'Hernandez', usuario: 'H-H',            password: '564sdgf',         habilitado: true,  tienda_codigo: 'sanji32542' },
        { nombre: 'Luis',    apellido: 'Gonzalez',  usuario: 'LG',             password: 'dstew23',         habilitado: false, tienda_codigo: 'pqr789xyz' },
        { nombre: 'Jorge',   apellido: 'Perez',     usuario: 'El curioso',     password: 'xznwqw@',         habilitado: true,  tienda_codigo: 'lmno456stu' },
        { nombre: 'Manuel',  apellido: 'Avilar',    usuario: 'Manu',           password: 'liecw',           habilitado: true,  tienda_codigo: 'wxyz123abc' },
        { nombre: 'Lucio',   apellido: 'Lopez',     usuario: 'Cuervo',         password: 'qxurnoñl',        habilitado: true,  tienda_codigo: 'xcbewu13' }
    ];
    
    for (const usuario of usuarios) {
        await cargarUsuario(usuario);
    }
 

    var camisaFoto = fs.readFileSync('camisa.jpg');
    var jeansFoto  = fs.readFileSync('jeans.jpg');
    var remeraFoto = fs.readFileSync('remera.jpg');

    const productos = [
        { nombre: 'Camisa Básica',    codigoProducto: 'CB123', talle: 'M', color: 'Rojo',  tiendaObject: [ {codigo: 'asdfgh987'}, {codigo: 'sanji32542'} ], foto: camisaFoto.toString('base64') },
        { nombre: 'Pantalones Jeans', codigoProducto: 'PJ456', talle: 'L', color: 'Azul',  tiendaObject: [ {codigo: 'wxyz123abc'} ],                        foto: jeansFoto.toString('base64') },
        { nombre: 'Remera',           codigoProducto: 'RLOW2', talle: 'S', color: 'Verde', tiendaObject: [ {codigo: 'xcbewu13'}, {codigo: 'pqr789xyz'} ],   foto: remeraFoto.toString('base64') },
    ]

    for (const producto of productos) {
        await cargarProducto(producto);
    }


    const ordenesDeCompra = [
        { estado: 'ACEPTADA', observaciones: 'Sin observaciones', fecha_de_solicitud: '2023-09-01', fecha_de_recepcion: '2023-09-08', tienda_codigo: 'asdfgh987' },
        { estado: 'ACEPTADA', observaciones: 'Sin observaciones', fecha_de_solicitud: '2024-10-02', fecha_de_recepcion: '2024-10-09', tienda_codigo: 'pqr789xyz' },
        { estado: 'RECIBIDA', observaciones: 'Sin observaciones', fecha_de_solicitud: '2024-11-03', fecha_de_recepcion: '2024-11-10', tienda_codigo: 'wxyz123abc' },
    ]

    for (const ordenDeCompra of ordenesDeCompra) {
        await cargarOrdenDeCompra(ordenDeCompra);
    }

    const items = [
        { producto_codigo: 'CB123', talle: 'M', color: 'Rojo',  cantidad_solicitada: 3, id_orden_de_compra: 1},

        { producto_codigo: 'PJ456', talle: 'L', color: 'Azul',  cantidad_solicitada: 2, id_orden_de_compra: 2},
        { producto_codigo: 'RLOW2', talle: 'S', color: 'Verde', cantidad_solicitada: 6, id_orden_de_compra: 2},

        { producto_codigo: 'CB123', talle: 'M', color: 'Rojo',  cantidad_solicitada: 5, id_orden_de_compra: 3},
        { producto_codigo: 'RLOW2', talle: 'S', color: 'Verde', cantidad_solicitada: 4, id_orden_de_compra: 3},
    ]

    for (const item of items) {
        await cargarItem(item);
    }

}

cargaDatosDePrueba();