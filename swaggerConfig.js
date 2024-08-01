const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Cliente&Negócio Satisfy',
      version: '1.0.0', 
      description: 'API RESTful de um Sistema PDV',
    },
    servers: [
      {
        url: 'https://api-cn-satisfy.onrender.com',
        description: 'Servidor de Produção'
      },
      // {
      //   url: 'http://localhost:3000',
      //   description: 'Servidor Local'
      // },
    ],
  },
  apis: ['./swaggerDocs.yaml'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
