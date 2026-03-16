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
                url: 'http://localhost:3000',
            },
        ],
        tags: [
            { name: 'Orders',  description: 'Order creation and management' },
            { name: 'Items',   description: 'Item creation and listing' },
            { name: 'Parties', description: 'Buyer and seller party creation' },
        ],
        components: {
            schemas: {
                // ── Reusable party input (buyer and seller share the same fields) ──
                PartyInput: {
                    type: 'object',
                    required: [
                        'streetNo', 'streetName', 'postCode', 'suburbName', 'stateName',
                        'phoneNo', 'telefax', 'email',
                        'firstName', 'surname', 'jobTitle',
                    ],
                    properties: {
                        // Address
                        streetNo:   { type: 'string', example: '1' },
                        streetName: { type: 'string', example: 'Main Street' },
                        postCode:   { type: 'string', example: '2000' },
                        suburbName: { type: 'string', example: 'Sydney' },
                        stateName:  { type: 'string', example: 'NSW' },
                        // Contact
                        phoneNo:    { type: 'string', example: '0400000000' },
                        telefax:    { type: 'string', example: '0200000000' },
                        email:      { type: 'string', format: 'email', example: 'contact@example.com' },
                        // Person
                        firstName:  { type: 'string', example: 'Jason' },
                        surname:    { type: 'string', example: 'Dharmawan' },
                        jobTitle:   { type: 'string', example: 'Billionare' },
                    },
                },

                // ── Error response shape returned by errorHandler middleware ──
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
    apis: [
        path.join(process.cwd(), 'src/routes/*.ts'),
        path.join(process.cwd(), 'routes/*.ts'),
        path.join(process.cwd(), 'dist/routes/*.js'),
        './routes/*.ts',
        './src/routes/*.ts'
    ],
});
