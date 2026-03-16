import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SENG2021 Order API',
            version: '1.0.0',
            description: 'API Documentation for the Order Service',
        },
        servers: [
            {
                url: 'https://seng2021-api-mirror.vercel.app', 
                description: 'Vercel Production Server'
            },
            {
                url: 'http://localhost:3000',
                description: 'Local Development'
            },
        ],
        components: {
            schemas: {
                // This matches the schema you provided earlier
                PartyInput: {
                    type: 'object',
                    required: [
                        'streetNo', 'streetName', 'postCode', 'suburbName', 'stateName',
                        'phoneNo', 'telefax', 'email',
                        'firstName', 'surname', 'jobTitle',
                    ],
                    properties: {
                        streetNo:   { type: 'string', example: '1' },
                        streetName: { type: 'string', example: 'Main Street' },
                        postCode:   { type: 'string', example: '2000' },
                        suburbName: { type: 'string', example: 'Sydney' },
                        stateName:  { type: 'string', example: 'NSW' },
                        phoneNo:    { type: 'string', example: '0400000000' },
                        telefax:    { type: 'string', example: '0200000000' },
                        email:      { type: 'string', format: 'email', example: 'contact@example.com' },
                        firstName:  { type: 'string', example: 'Jason' },
                        surname:    { type: 'string', example: 'Dharmawan' },
                        jobTitle:   { type: 'string', example: 'Billionaire' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Invalid order data provided' },
                        type:    { type: 'string', example: 'VALIDATION_ERROR' },
                        details: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['buyerId is required', 'itemId is required'],
                        },
                    },
                },
            },
        },
    },
    // The "Ultimate Lock-In" Pathing
    apis: [
        path.join(process.cwd(), 'src/routes/*.ts'),
        path.join(process.cwd(), 'routes/*.ts'),
        path.join(process.cwd(), 'dist/routes/*.js'),
        './src/routes/*.ts',
        './routes/*.ts'
    ],
});
