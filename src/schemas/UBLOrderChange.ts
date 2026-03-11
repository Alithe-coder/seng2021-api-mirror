import type { Item, BuyerCustomerParty, Address, Person, SellerSupplierParty } from "./UBLUniversal.ts";
import type { Order } from './UBLOrder.ts'


export interface OrderChange {
    order: Order;
    changeReason: String;
    changeDescription: String;
}