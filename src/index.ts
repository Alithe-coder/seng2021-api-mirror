
import express from 'express';

const app = express();
const port = 3000;

// we need to use /api/v1/orders everytiume
app.use('/api/v1/orders', orderRoutes);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({status : "Recieved"})
});

app.listen(port, () => {
    console.log(`listening...`);
});