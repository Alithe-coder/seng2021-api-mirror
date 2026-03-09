
// this is a Controller file which recieves the requests from Router file, and it responsible
// for executing code depending on what it receives. its essentially the backend functionality
// for api endpoints

import express from 'express'

// create an order
export const createOrder = (req: express.Request, res: express.Response) => {
    // receive the data from terminal: req.body
    const dataReceived = req.body;
    console.log(dataReceived)

    res.status(201).json({ message: "TESTING: Create order", data: dataReceived });
};
