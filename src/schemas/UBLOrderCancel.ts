import type { BuyerCustomerParty, SellerSupplierParty } from "./UBLUniversal.ts";

export interface OrderCancel {
    orderDate: Date;
    cancelationNote: String;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}