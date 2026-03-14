export interface BuyerCustomerParty {
  buyerId: string;
  owner: Person
  buyerAddress: Address;
  contactinfo: Contact;
}

export interface Person {
  personId: string;
  firstName: string;
  surname: string;
  phoneNo: number;
  jobTitle: string;
  contactinfo: Contact
  
}

export interface Contact {
  contactId: string;
  phoneNo: number;
  telefax: number;
  email: string;
}

export interface Address {
  AddressId: string;
  streetNo: number;
  streetName: string;
  postCode: number;
  suburbName: string;
  stateName: string;
}

export interface SellerSupplierParty {
  companyId: string;
  sellerAddress: Address;
  seller: Person;
  contactinfo: Contact
}
