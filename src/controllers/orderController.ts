
import express from 'express'

// POST
export const createOrder = (req: express.Request, res: express.Response) => {
    res.status(201).json({ message: "TESTING: Create order" });
};
