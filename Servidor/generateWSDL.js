const xmlbuilder = require('xmlbuilder');
const fs = require('fs');


// Generar WSDL dinámicamente
const wsdl = xmlbuilder.create('wsdl:definitions', { encoding: 'UTF-8' })
  .att('targetNamespace', 'http://tempuri.org/')
  .att('xmlns:s', 'http://www.w3.org/2001/XMLSchema')
  .att('xmlns:soap12', 'http://schemas.xmlsoap.org/wsdl/soap12/')
  .att('xmlns:http', 'http://schemas.xmlsoap.org/wsdl/http/')
  .att('xmlns:mime', 'http://schemas.xmlsoap.org/wsdl/mime/')
  .att('xmlns:tns', 'http://tempuri.org/')
  .att('xmlns:soap', 'http://schemas.xmlsoap.org/wsdl/soap/')
  .att('xmlns:tm', 'http://microsoft.com/wsdl/mime/textMatching/')
  .att('xmlns:soapenc', 'http://schemas.xmlsoap.org/soap/encoding/')
  .att('xmlns:wsdl', 'http://schemas.xmlsoap.org/wsdl/')
  
  // Definición de los tipos
  .com('Definicion de los tipos')
  .ele('wsdl:types')
    .ele('s:schema', { elementFormDefault: 'qualified', targetNamespace: 'http://tempuri.org/' })
      .ele('s:element', { name: 'catalogoPDFRequest' })
        .ele('s:complexType')
          .ele('s:sequence')
            .ele('s:element', {name: 'nombre', type: 's:string' }).up()
            .ele('s:element', {name: 'cantidad', type: 's:int' }).up()
          .up()
        .up()
      .up()
      .ele('s:element', { name: 'catalogoPDFResponse' })
        .ele('s:complexType')
          .ele('s:sequence')
            .ele('s:element', {name:'respuesta',type:'s:string'}).up()
          .up()
        .up()
      .up()
    .up()
  .up()

  // Definición de los mensajes
  .com('Definicion de los mensajes')
  .ele('wsdl:message', { name: 'catalogoPDFIn' })
    .ele('wsdl:part', { name: 'parameters', element: 'tns:catalogoPDFRequest' }).up()
  .up()
  .ele('wsdl:message', { name: 'catalogoPDFOut' })
    .ele('wsdl:part', { name: 'parameters', element: 'tns:catalogoPDFResponse' }).up()
  .up()

  // Definición de portType
  .com('Definicion de portType - operaciones disponibles y mensajes involucrados')
  .ele('wsdl:portType', { name: 'catalogoPDFPort' })
    .ele('wsdl:operation', { name: 'crearCatalogo' })
      .ele('wsdl:documentation', "Funcion para crear Catalogo en PDF").up()
      .ele('wsdl:input', { message: 'tns:catalogoPDFIn' }).up()
      .ele('wsdl:output', { message: 'tns:catalogoPDFOut' }).up()
    .up()
  .up()

  // Definición del binding SOAP
  .com('Definicion del binding SOAP - estilo de cada operacion y la codificacion para cada mensaje')
  .ele('wsdl:binding', { name: 'crearCatalogoServiceBinding', type: 'tns:catalogoPDFPort' })
    .ele('soap:binding', { transport: 'http://schemas.xmlsoap.org/soap/http' }).up()
    .ele('wsdl:operation', { name: 'crearCatalogo' })
      .ele('soap:operation', { soapAction: 'crearCatalogo', style: 'document' }).up()
      .ele('wsdl:input')
        .ele('soap:body', { use: 'literal' }).up()
      .up()
      .ele('wsdl:output')
        .ele('soap:body', { use: 'literal' }).up()
      .up()
    .up()
  .up()

  // Definición del binding SOAP 1.2
  .com('Definicion del binding SOAP 1.2')
  .ele('wsdl:binding', { name: 'crearCatalogoService12Binding', type: 'tns:catalogoPDFPort' })
    .ele('soap12:binding', { transport: 'http://schemas.xmlsoap.org/soap/http' }).up()
    .ele('wsdl:operation', { name: 'crearCatalogo' })
      .ele('soap12:operation', { soapAction: 'crearCatalogo', style: 'document' }).up()
      .ele('wsdl:input')
        .ele('soap12:body', { use: 'literal' }).up()
      .up()
      .ele('wsdl:output')
        .ele('soap12:body', { use: 'literal' }).up()
      .up()
    .up()
  .up()

  // Definición del servicio
  .com('Definicion del servicio')
  .ele('wsdl:service', { name: 'catalogoService' })
    .ele('wsdl:port', { name: 'catalogoServiceSoapPort', binding: 'tns:crearCatalogoServiceBinding' })
      .ele('soap:address', { location: 'http://localhost:8000/wsdl' }).up()
    .up()
    .ele('wsdl:port', { name: 'catalogoServiceSoap12Port', binding: 'tns:crearCatalogoService12Binding' })
      .ele('soap12:address', { location: 'http://localhost:8000/wsdl' }).up()
    .up()
  .up()
  .end({ pretty: true });

// Guardar el WSDL generado en un archivo

fs.writeFile('service.wsdl', wsdl, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Archivo WSDL guardado como service.wsdl');
  });
