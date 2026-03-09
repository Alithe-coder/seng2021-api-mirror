
import { Request, Response } from 'express';

// POST
export const createOrder = (req: Request, res: Response) => {
    res.status(201).json({ message: "TESTING: Create order" });
};
