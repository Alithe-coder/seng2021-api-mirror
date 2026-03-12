
// this is a Controller file which recieves the requests from Router file, and it responsible
// for executing code depending on what it receives. its essentially the backend functionality
// for api endpoints

import express from 'express';
import { prisma } from '../db.ts';

// this will be the sort of skeleton code for the rest of the controllers
// POST /api/v1/orders - Create
export const createOrder = async (req: express.Request, res: express.Response) => {
    // receive the data from terminal: req.body
    const dataReceived = req.body;
    console.log(dataReceived);

    const newOrder = await prisma.order.create({
        data: {
            buyerName: req.body.buyerName,
            item: req.body.item,
            quantity: req.body.quantity
        }
    })

    res.status(201).json(newOrder);
};

export const createSellerParty = async (req: express.Request, res: express.Response) => {
    const dataReceived = req.body;
    console.log(dataReceived);

    const newSeller = await prisma.SellerSupplierParty.create({
        data: {
            address: {
                street: req.body.streetNo,
                streetName: req.body.streetName,
                postCode: req.body.postCode,
                suburbName: req.body.suburbName,
                stateName: req.body.stateName,
            },
            contact: {
                phoneNo: req.body.phoneNo,
                telefax: req.body.telefax,
                email: req.body.email
            },
            person: {
                firstName: req.body.firstName,
                surname: req.body.surname,
                jobTitle: req.body.jobTitle
            }
        }
    })
    res.status(201).json(newSeller);
}

// GET /api/v1/orders - List orders using filters
export const listOrders = (req: express.Request, res: express.Response) => {
    const filters = req.query;
    res.status(200).json({ message: "List orders", filters: filters });
};


// GET /api/v1/orders/:orderId - Retreive
export const getOrderById = (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
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