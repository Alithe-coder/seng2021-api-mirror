
// this is a Controller file which recieves the requests from Router file, and it responsible
// for executing code depending on what it receives. its essentially the backend functionality
// for api endpoints

import express from 'express';
import { prisma } from '../db.ts';
// this will be the sort of skeleton code for the rest of the controllers
// POST /api/v1/orders - Create
/*
export const createOrder = async (req: express.Request, res: express.Response) => {
    // receive the data from terminal: req.body
    const dataReceived = req.body;
    console.log(dataReceived);

    const newOrder = await prisma.order.create({
        data : {
            orderDate: new Date(),
            

        }
    })

    res.status(200).json({message: "not avaialbe"});
};
*/

// TODO allow listing by prices ascending, decreasing etc
export const listAllItems = async (req: express.Request, res: express.Response) => {
    const allItems = await prisma.item.findMany();
    res.status(200).json(allItems);
}

export const createSellerParty = async (req: express.Request, res: express.Response) => {
    const dataReceived = req.body;
    console.log(dataReceived);
    /*
    */

    const newSeller = await prisma.sellerCustomerParty.create({
        data: {
            address: {
                create: {
                    streetNo: Number(req.body.streetNo),
                    streetName: req.body.streetName,
                    postCode: Number(req.body.postCode),
                    suburbName: req.body.suburbName,
                    stateName: req.body.stateName,
                }
            },
            contact: {
                create: {
                    phoneNo: req.body.phoneNo,
                    telefax: req.body.telefax,
                    email: req.body.email
                }
            },
            person: {
                create: {
                    firstName: req.body.firstName,
                    surname: req.body.surname,
                    jobTitle: req.body.jobTitle
                }
            },
        },
        include: {
            address: true,
            contact: true,
            person: true,
        }
    });

    res.status(201).json("newSeller");
}
export const createOrder = async (req: express.Request, res: express.Response) => {
    const itemExists = await prisma.item.count({
        where: {
            id: req.body.itemId,
        },
    });
    const buyerExists = await prisma.buyerCustomerParty.count({
        where: {
            id: req.body.buyerId
        },
    });
    if (itemExists == 0 || buyerExists == 0) {
        res.status(404).json("ERROR: element not found");
        return;
    }
    const newOrder = await prisma.order.create({
        data: {
            orderDate: new Date(),
            buyerId: req.body.buyerId,
            itemId:  req.body.itemId,
        },
    });
    res.status(201).json(newOrder)
}

export const createItem = async (req: express.Request, res: express.Response) => {
    const newItem = await prisma.item.create({
        data: {
            description: req.body.description,
            name: req.body.name,
            price: parseFloat(req.body.price),
            sellerId: req.body.sellerId,
        },
    });

    res.status(201).json(newItem);
}

export const createBuyerParty = async (req: express.Request, res: express.Response) => {
    const dataReceived = req.body;
    console.log(dataReceived);


    const newBuyer = await prisma.buyerCustomerParty.create({
        data: {
            address: {
                create: {
                    streetNo: Number(req.body.streetNo),
                    streetName: req.body.streetName,
                    postCode: Number(req.body.postCode),
                    suburbName: req.body.suburbName,
                    stateName: req.body.stateName,
                }
            },
            contact: {
                create: {
                    phoneNo: req.body.phoneNo,
                    telefax: req.body.telefax,
                    email: req.body.email
                }
            },
            person: {
                create: {
                    firstName: req.body.firstName,
                    surname: req.body.surname,
                    jobTitle: req.body.jobTitle
                }
            }
        },
        include: {
            address: true,
            contact: true,
            person: true
        }
    });

    res.status(201).json("newSeller");
}

// GET /api/v1/orders - List orders using filters
export const listOrders = (req: express.Request, res: express.Response) => {
    const filters = req.query;
    res.status(200).json({ message: "List orders", filters: filters });
};


// GET /api/v1/orders/:orderId - Retreive
export const getOrderById = (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    res.status(200).json({ message: `Order to be retrieved ${orderId}` });
};

// PUT /api/v1/orders/:orderId - update
export const updateOrder = (req: express.Request, res: express.Response) => {
    const { orderId } = req.params;
    res.status(200).json({ message: `Order to be retrieved ${orderId}` });
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