import type { Item, BuyerCustomerParty, Address, Person, SellerSupplierParty } from "./UBLUniversal.ts";

export interface OrderCancel {
    orderDate: Date;
    cancelationNote: String;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}