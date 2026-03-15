import 'dotenv/config';
import express from 'express';
import orderRoutes from './routes/orderRoutes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// we need to ensure that our server can actuall read JSON
app.use(express.json());

// we need to use /api/v1/orders everytime we are to do with orders
app.use('/api/v1/orders', orderRoutes);

// health check to see how the server is going 
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status : {
            indicator: "<placeholder>",
            description: "<placeholder>"
        },
        services: {
            "vercel": "<placeholder>",
        },
        version : "1.0",
        uptimeSeconds: Math.floor(process.uptime())
    })
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;