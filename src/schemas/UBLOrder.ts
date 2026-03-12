import type { BuyerCustomerParty, SellerSupplierParty } from "./UBLUniversal.ts";

export interface Item {
  sellerId: string;
  itemDescription: string;
  itemName: string;
  itemPrice: number;
}


export interface Order {
  orderId: string;
  orderDate: Date;
  UBLVersion: string;
  buyer: BuyerCustomerParty;
  seller: SellerSupplierParty;
  item: Item[];
}

// This function parses a JSON UBL file, so that the database can read it 
export function createOrderInterface(order: string): Order {
  return JSON.parse(order);
}

// this function converts a Typescript interface to JSON, so that the API can send it to the client
export function createOrderJSON(order: Order): string {
  return JSON.stringify(order);
}