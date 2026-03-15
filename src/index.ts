// index.ts
import 'dotenv/config';
import express from 'express';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler'
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { authenticateToken } from './middleware/auth';

const app = express();
app.set('json spaces', 2);
const port = 3000;

// Vercel fix for Swagger UI styles
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

app.use(express.json());

// 1. REDIRECT root to API Docs so you don't see "Cannot GET /"
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// 2. API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', authenticateToken, orderRoutes);

// 3. Health Check
app.get('/api/v1/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({
        status: {
            indicator: "UP",
            description: "Server is running on Vercel"
        },
        services: {
            "vercel": "connected",
        },
        version: "1.0",
        uptimeSeconds: Math.floor(process.uptime())
    })
});

// 4. Swagger UI with CDN CSS fix
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
    customCssUrl: CSS_URL 
}));

// 5. Error Handler (MUST be after routes)
app.use(errorHandler);

// 6. Only listen locally (Vercel ignores this and uses the export below)
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server listening locally on port ${port}...`);
    });
}

// 7. REQUIRED for Vercel
export default app;
