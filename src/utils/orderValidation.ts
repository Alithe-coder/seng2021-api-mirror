

// this file is a backend data validation - it checks whether
// the input data isnt garbage. we can have multiple validaitionErrors

import { z } from 'zod';



// using the example schema: TO BE REPLACES
/*
model Order {
  id        String   @id @default(uuid())
  buyerName String
  item      String
  quantity  Int
  status    String   @default("DRAFT")
  createdAt DateTime @default(now())
}
*/

const orderSchema = z.object({
    buyerName: z.string({message: "buyerName is required"}),
    item: z.string({message: "item is required"}),

    quantity: z.number({message: "quantity is required"})
        .int("quantity must be integer")
        .positive("quantity must be greater than 0"),

    // ensure that status is enum
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
        }))
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



// helper functions
// // check if any values are missing from request
// function requireField(value: any, fieldName: string, errors: validationError[]) {
//     if (!value) {
//         errors.push({ field: fieldName, issue: 'required' });
//     }
// }
// function checkDate(dateString: any, fieldName: string, errors: validationError[] ) {
//     // use some simple regex; 4 digits - 2 digits - 2 digts
//     if (dateString && !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//         errors.push({ field: fieldName, issue: 'format must be YYYY-MM-DD' });
//     }
// };

// function checkAddress(address: any, prefix: string, errors: validationError[]) {
//     if (!address) {
//         errors.push({ field: prefix, issue: 'required' });
//         return; // if no address, just stop
//     }
//     // make sure all the address info is there
//     requireField(address.line1, `${prefix}.line1`, errors);
//     requireField(address.city, `${prefix}.city`, errors);
//     requireField(address.postcode, `${prefix}.postcode`, errors);
//     requireField(address.countryCode, `${prefix}.countryCode`, errors);
// }