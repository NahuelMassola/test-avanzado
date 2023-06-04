const swaggerJsSDoc = require('swagger-jsdoc');

const option = {
    definition:{
    openapi: '3.0.0',
    info:{
        title:'Documentacion Funcionamiento de la API',
        description:'Api Ecommerce', version:'1.0.0'
    }
    },
    apis: [`./src/api-docs/**/*.yml`]
}

const swaggerSpec = swaggerJsSDoc(option)

module.exports = swaggerSpec

