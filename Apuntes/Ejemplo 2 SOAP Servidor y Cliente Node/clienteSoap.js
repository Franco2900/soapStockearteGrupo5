const soap = require('soap');

const url = 'http://localhost:8080/saludar?wsdl';

async function crearClienteSoap(url) 
{
    try 
    {
        const clienteSoap = await soap.createClientAsync(url); // Crear cliente SOAP
        console.log('Cliente SOAP creado exitosamente');
        return clienteSoap; // Retornar el cliente para usarlo más tarde
    } 
    catch (error) 
    {
        console.error('Error al crear el cliente SOAP:', error);
    }
}


async function saludar(cliente, args) 
{
    try 
    {
        const response = await cliente.saludarAsync(args); // Llamar a la función de manera asíncrona

        console.log('Datos enviados por la respuesta del servidor:', response[0]);
        console.log('Saludo: ' + response[0].saludo); // Manejar la respuesta del servidor
        console.log('Saludo cordial: ' + response[0].saludoCordial);
    } 
    catch (error) 
    {
        console.error('Error al hacer la solicitud SOAP:', error);
    }
}


async function main() 
{
    try 
    {
        const cliente = await crearClienteSoap(url);
        await saludar(cliente, { nombre: 'Unlero' }); // Pasar los argumentos como objetos
    } 
    catch (err) 
    {
        console.error('Error:', err);
    }
}

main();
