
// this is a Controller file which recieves the requests from Router file, and it responsible
// for executing code depending on what it receives. its essentially the backend functionality
// for api endpoints

import express from 'express'

// this will be the sort of skeleton code for the rest of the controllers
// POST /api/v1/orders - Create
export const createOrder = (req: express.Request, res: express.Response) => {
    // receive the data from terminal: req.body
    const dataReceived = req.body;
    console.log(dataReceived)

    res.status(201).json({ message: "TESTING: Create order", data: dataReceived });
};

// GET /api/v1/orders - List orders using filters
export const listOrders = (req: express.Request, res: express.Response) => {
    const filters = req.query;
    res.status(200).json({ message: "List orders", filters: filters });
};


// GET /api/v1/orders/:orderId - Retreive
export const getOrderById = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { orderId } = req.params;

    // test
    if (orderId === "37") {
        const err: any = new Error("No order exists with the provided ID");
        err.type = "NOT_FOUND"; // This tells the middleware to use status 404
        
        return next(err); // Teleport to the Error Handler!
    }

    res.status(200).json({ message: `Order to be retrieved ${orderId}`});
};

// PUT /api/v1/orders/:orderId - update
export const updateOrder = (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    res.status(200).json({ message: `Order to be retrieved ${orderId}`});
};

// DELETE /api/v1/orders/:orderId - Delete
export const deleteOrder = (req: express.Request, res: express.Response) => {
    //const { orderId } = req.params;
    res.status(204).send();
};

// GET /api/v1/orders/:orderId/ubl - Export XML
export const generateUbl = (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    res.status(200).send(`<Order><ID>${orderId}</ID><Status>Skeleton</Status></Order>`);
};