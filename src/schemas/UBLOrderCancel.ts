import type { BuyerCustomerParty, SellerSupplierParty } from "./UBLUniversal.ts";

export interface OrderCancel {
    cancelDate: Date;
    cancelationNote: String;
    buyer: BuyerCustomerParty;
    seller: SellerSupplierParty;
}