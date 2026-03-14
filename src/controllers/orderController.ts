
// this is a Controller file which recieves the requests from Router file, and it responsible
// for executing code depending on what it receives. its essentially the backend functionality
// for api endpoints

import express from 'express';
import type { AppError } from '../middleware/errorHandler.ts';
import { prisma } from '../db.ts';
import { validateCreateOrder } from '../utils/orderValidation.ts'

// TODO allow listing by prices ascending, decreasing etc
export const listAllItems = async (req: express.Request, res: express.Response) => {
    const allItems = await prisma.item.findMany();
    res.status(200).json(allItems);
}

export const createSellerParty = async (req: express.Request, res: express.Response) => {
    const dataReceived = req.body;
    console.log(dataReceived);
   

    const newSeller = await prisma.sellerCustomerParty.create({
        data: {
            address: {
                create: {
                    streetNo: req.body.streetNo,
                    streetName: req.body.streetName,
                    postCode: req.body.postCode,
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

    res.status(201).json(newSeller);
}

export const createOrder = async (req: express.Request, res: express.Response, next: express.NextFunction ) => {
    
    // ---input validation---
    const validaitionErrors = validateCreateOrder(req.body);
    
    // if errors occur
    if (validaitionErrors.length > 0) {
        const err: AppError = new Error("Invalid order data provided");
        err.type = "VALIDATION_ERROR";
        err.details = validaitionErrors;

        return next(err);
    }
    
    const { buyerId, itemId } = req.body;

    try {
        const item = await prisma.item.findUnique({ where: { id: itemId } });
        const buyerExists = await prisma.buyerCustomerParty.count({ where: { id: buyerId } });
        
        if (!item || buyerExists === 0) {
            const err: AppError = new Error("Buyer or Item not found");
            err.type = "NOT_FOUND";
            return next(err);
        }

        // create the new order object containg buyerId
        const newOrder = await prisma.order.create({
            data: {
                orderDate: new Date(),
                buyerId: buyerId,
                lines: {
                    create: {
                        itemId: itemId,
                        quantity: 1, // default for now
                        unitPrice: item.price 
                    }
                }
            },
            include: {
                lines: true // returns the lines in the response so you can see them
            }
        });

        res.status(201).json(newOrder);

    } catch (error) {
        next(error);
    }

};

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
                    streetNo: req.body.streetNo,
                    streetName: req.body.streetName,
                    postCode: req.body.postCode,
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

    res.status(201).json(newBuyer);
}

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
        const err: AppError = new Error("No order exists with the provided ID");
        err.type = "NOT_FOUND"; // This tells the middleware to use status 404
        
        return next(err); // Teleport to the Error Handler!
    }

    res.status(200).json({ message: `Order to be retrieved ${orderId}`});
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