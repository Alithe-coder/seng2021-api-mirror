
// this file will ensure that correct data is inputted
// when registering a user account

import {z} from 'zod';
import type { validationError } from './orderValidation.ts';

// follow very similar structure to ordervalidation

const authSchema = z.object({
    email: z.string({message: "email is required"}).email("Must be a valid email format"),
    password: z.string({message: "password is required"}).min(6, "Password must be at least 6 characters long"),
    name: z.string().optional()
});

export function validateAuth(body: unknown): validationError[] {
    const result = authSchema.safeParse(body);
    if (!result.success) {
        return result.error?.issues.map(issues => ({
            field: issues.path.join('.'),
            issue: issues.message
        })) || [];
    }
    return [];
}