import app from './app.ts';

const port = 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});