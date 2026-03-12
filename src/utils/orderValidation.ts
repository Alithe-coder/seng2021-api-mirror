

// this file is a backend data validation - it checks whether
// the input data isnt garbage. we can have multiple validaitionErrors



export interface validationError {
    field: string;
    issue: string;
}

// helper functions
// check if any values are missing from request
function requireField(value: unknown, fieldName: string, errors: validationError[]) {
    if (!value) {
        errors.push({ field: fieldName, issue: 'required' });
    }
}
function checkDate(dateString: unknown, fieldName: string, errors: validationError[] ) {
    // use some simple regex; 4 digits - 2 digits - 2 digts
    if (dateString && !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        errors.push({ field: fieldName, issue: 'format must be YYYY-MM-DD' });
    }
};

function checkAddress(address: unknown, prefix: string, errors: validationError[]) {
    if (!address) {
        errors.push({ field: fieldName, issue: 'required' });
        return; // if no address, just stop
    }
    // make sure all the address info is there
    checkRequired(address.line1, `${prefix}.line1`, errors);
    checkRequired(address.city, `${prefix}.city`, errors);
    checkRequired(address.postcode, `${prefix}.postcode`, errors);
    checkRequired(address.countryCode, `${prefix}.countryCode`, errors);
}

// validate data for POST
export function validateCreateOrder (body: unknown) : validationError[] {
    const errors : validationError[] = [];

    // 1. check issue date format
    // 2. check buyer
    // 3. check seller check lines
}

// validate data for PUT

// validate data for GET
