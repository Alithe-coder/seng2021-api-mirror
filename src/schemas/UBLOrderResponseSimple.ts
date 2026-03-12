import type { BuyerCustomerParty, Address, Person, SellerSupplierParty } from "./UBLUniversal.ts";


export interface OrderResponseSimple {
    orderDate: Date;
    acceptedIndicator: boolean;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}

// This function parses a JSON UBL file, so that the database can read it 
export function createOrderResponseSimpleInterface(order: string): OrderResponseSimple {
  return JSON.parse(order);
}

// this function converts a Typescript interface to JSON, so that the API can send it to the client
export function createOrderResponseSimpleJSON(order: OrderResponseSimple): string {
  return JSON.stringify(order);
}