import type { BuyerCustomerParty, SellerSupplierParty } from "./UBLUniversal.ts";

export interface OrderCancel {
    cancelDate: Date;
    cancelationNote: String;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}

// This function parses a JSON UBL file, so that the database can read it 
export function createOrderCancelInterface(order: string): OrderCancel {
  return JSON.parse(order);
}

// this function converts a Typescript interface to JSON, so that the API can send it to the client
export function createOrderCancelJSON(order: OrderCancel): string {
  return JSON.stringify(order);
}