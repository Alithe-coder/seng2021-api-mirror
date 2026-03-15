// index.ts is the main file which will run everytime the Node server starts. ALl 
import 'dotenv/config';
import express from 'express';
import orderRoutes from './routes/orderRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts'

const app = express();
app.set('json spaces', 2);
const port = 3000;

// we need to ensure that our server can actuall read JSON
app.use(express.json());

// we need to use /api/v1/orders everytime we are to do with orders
app.use('/api/v1/orders', orderRoutes);

// health check to see how the server is going 
app.get('/api/v1/health', (req: express.Request, res: express.Response) => {
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

// this MUST be after any routes
app.use(errorHandler);

// when server is running
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});