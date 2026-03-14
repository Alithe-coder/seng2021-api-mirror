import swaggerJsDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SENG2021 WORD API',
            version: '1.0.0',
            description: 'API Documentation for the Order Service',
        },
        servers: [
            {
                url: 'https://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
});