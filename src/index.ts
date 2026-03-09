
// index.ts is the main file which will run everytime the Node server starts. ALl 

import express from 'express';
import orderRoutes from './routes/orderRoutes.ts';

const app = express();
const port = 3000;

// we need to use /api/v1/orders everytime we are to do with orders
app.use('/api/v1/orders', orderRoutes);

// health check to see how the server is going 
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({status : "healthy 🫀   "})
});


// when server is running
app.listen(port, () => {
    console.log(`listening...`);
});