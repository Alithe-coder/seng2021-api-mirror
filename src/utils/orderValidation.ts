// this file is a backend data validation - it checks whether
// the input data isnt garbage. we can have multiple validaitionErrors

import { z } from 'zod';


// ORDER CREATION

const orderSchema = z.object({
    buyerId: z.string({message: "buyerName is required and must be a valid string"}),
    itemId: z.string({message: "itemId is required and must be a valid string"}),
    status: z.enum(["DRAFT", "SUBMITTED", "CANCELLED"]).optional()
});

export interface validationError {
    field: string;
    issue: string;
}

// validate data for POST
export function validateCreateOrder (body: unknown) : validationError[] {
    // check input against what we defined above
    const result = orderSchema.safeParse(body);

    if (!result.success) {
        return result.error.issues.map(issue => ({
            field: issue.path.join('.'), // tells us which field failes
            issue: issue.message // custom errors we wrote above
        }));
    }

    return [];
}

// ITEM CREATION
const itemSchema = z.object({
    description: z.string({ message: "description is required and must be a string" }),
    name: z.string({ message: "name is required and must be a string" }),
    price: z.number({ message: "price is required and must be a number" }).positive("price must be greate then 0"),
    sellerId: z.string({ message: "sellerId is required and must be a valid string" })
});

export function validateCreateItem (body: unknown) : validationError[] {
    // check input against what we defined above
    const result = itemSchema.safeParse(body);

    if (!result.success) {
        return result.error.issues.map(issue => ({
            field: issue.path.join('.'), // tells us which field failes
            issue: issue.message // custom errors we wrote above
        }));
    }

    return [];
}

// validate data for PUT

// validate data for GET