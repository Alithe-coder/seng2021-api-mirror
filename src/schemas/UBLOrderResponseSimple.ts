import type { BuyerCustomerParty, Address, Person, SellerSupplierParty } from "./UBLUniversal.ts";


export interface OrderResponseSimple {
    orderDate: Date;
    acceptedIndicator: boolean;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}