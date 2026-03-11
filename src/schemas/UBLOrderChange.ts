import type { Order } from './UBLOrder.ts'


export interface OrderChange {
    order: Order;
    changeReason: String;
    changeDescription: String;
}

// This function parses a JSON UBL file, so that the database can read it 
export function createOrderChangeInterface(order: string): OrderChange {
  return JSON.parse(order);
}

// this function converts a Typescript interface to JSON, so that the API can send it to the client
export function createOrderChangeJSON(order: OrderChange): string {
  return JSON.stringify(order);
}