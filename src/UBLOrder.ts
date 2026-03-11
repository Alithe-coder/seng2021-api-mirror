
export interface Item {
  sellerId: string;
  itemDescription: String;
  itemName: String;
  itemPrice: number;
}

export interface BuyerCustomerParty {
  buyerId: string;
  owner: Person
  buyerAddress: Address;
}
export interface Address {
  AddressId: String;
  streetNo: number;
  streetName: String;
  postCode: number;
  suburbName: string;
  stateName: string;
}


export interface Order {
  orderId: String;
  orderDate: Date;
  UBLVersion: String;
  buyer: BuyerCustomerParty;
  item: Item[];
}

export interface SellerSupplierParty {
  companyId: String;
  sellerAddress: Address;
  seller: Person;
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

// This function parses a JSON UBL file, so that the database can read it 
function createOrderInterface(ublOrderString: string): Order {
  return JSON.parse(ublOrderString);
}