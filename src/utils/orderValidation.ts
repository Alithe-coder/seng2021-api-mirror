

// this file is a backend data validation - it checks whether
// the input data isnt garbage. we can have multiple validaitionErrors

import { z } from 'zod';

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
    
    // const errors : validationError[] = [];

    // // 1. check issue date format
    // requireField(body.issueDate, 'issueDate', errors);
    // checkDate(body.issueDate, 'issueDate', errors);

    // // 2. check buyer
    // // 3. check seller check lines

    // // return a list of errors
    // return errors;
}

// validate data for PUT

// validate data for GET