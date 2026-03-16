// index.ts
import 'dotenv/config';
import express from 'express';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { authenticateToken } from './middleware/auth';

const app = express();

// --- VERCEL STATIC ASSET FIX ---
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const JS_URL = [
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.min.js"
];
// -------------------------------

app.use(express.json());

// 1. REDIRECT root to API Docs
app.get('/', (req, res) => res.redirect('/api-docs'));

// 2. API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', authenticateToken, orderRoutes);

// 3. Swagger UI with BOTH CSS and JS CDN links
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
    customCssUrl: CSS_URL,
    customJs: JS_URL 
}));

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log(`Local server on 3000`));
}

export default app;
