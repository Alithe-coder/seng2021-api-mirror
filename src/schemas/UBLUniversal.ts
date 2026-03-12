export interface BuyerCustomerParty {
  buyerId: string;
  owner: Person
  buyerAddress: Address;
}

export interface Person {
  personId: String;
  firstName: string;
  surname: string;
  phoneNo: number;
  jobTitle: String;
  contactinfo: Contact
  
}

export interface Contact {
  contactId: string;
  phoneNo: number;
  telefax: number;
  email: string;
}

export interface Address {
  AddressId: String;
  streetNo: number;
  streetName: String;
  postCode: number;
  suburbName: string;
  stateName: string;
}

export interface SellerSupplierParty {
  companyId: String;
  sellerAddress: Address;
  seller: Person;
}
