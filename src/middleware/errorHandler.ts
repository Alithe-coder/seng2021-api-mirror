
import express from 'express';

/** 
 * this document will server as the global tool for handliong errors.
 * How to use:
 * 
 * 1. ensure that 'next' is in function argument inside of controller; (req, res, next)
 * 2. instantiate new error; const err = new Error("<message>");
 * 3. assign a type to error; err.type = "NOT_FOUND"
 * 4. PLEASE add details; err.details = [{ field: "quantity", issue: "must be > 0" }];
 * 5. ❗IMPORTANT: call return next(err) - this ensure flow of program
 * 
 * see // GET /api/v1/orders/:orderId - Retreive for example
 * */ 

// define interface for error
export interface AppError extends Error {
    type?: string;
    status?: number;
    // use unkown instead of any - is safer apparently
    details?: unknown[];
    // all settings are ? optional because status 500 is defauly error
}

export const errorHandler = (
    err: AppError, req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction) => { // we need next to actually ensure the program continues running
    // assume error status is 500 (internal server error)
    let status = err.status || 500;
    let code = "INTERNAL_SERVER_ERROR";
    const message = err.message || "An unexpected error occured";
    const details: unknown[] = err.details || [];

    // error mapping
    if (err.type === "BAD_REQUEST") {
        status = 400;
        code = "BAD_REQUEST";
    }

    else if (err.type == "NOT_FOUND") {
        status = 404;
        code = "NOT_FOUND";
    }

    else if (err.type == "CONFLICT") {
        status = 409;
        code = "CONFLICT";
    }
    else if (err.type == "VALIDATION_ERROR") {
        status = 422;
        code = "VALIDATION_ERROR";
    }
    else if (err.type == "SERVICE_UNAVAILABLE") {
        status = 503;
        code = "SERVICE_UNAVAILABLE";
    }
    
    // send the error as a json objet containing appropriate fields
    res.status(status).json({
        error: code,
        message: message,
        details: details
    });
}