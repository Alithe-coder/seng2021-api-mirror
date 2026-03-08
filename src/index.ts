
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("testing... api request suceess\n")
});

app.listen(port, () => {
    console.log(`listening...`);
});