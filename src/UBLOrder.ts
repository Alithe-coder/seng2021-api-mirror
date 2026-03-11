
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

function createOrder(ublOrderString: string): Order {
  //const testJsonString = '{"orderId":"ORD-1001","orderDate":"2026-03-11T10:30:00Z","UBLVersion":"2.1","buyer":{"buyerId":"BUY-001","owner":{"personId":"P-100","firstName":"Alice","surname":"Smith","phoneNo":61412345678,"jobTitle":"Procurement Manager","contactinfo":{"contactId":"C-200","phoneNo":61412345678,"telefax":61298765432,"email":"alice.smith@example.com"}},"buyerAddress":{"AddressId":"ADDR-1","streetNo":42,"streetName":"George Street","postCode":2000,"suburbName":"Sydney","stateName":"NSW"}},"item":[{"sellerId":"SELL-900","itemDescription":"Laptop computer with 16GB RAM","itemName":"Laptop","itemPrice":1500},{"sellerId":"SELL-901","itemDescription":"Wireless optical mouse","itemName":"Mouse","itemPrice":45}]}'
  // a sample string to test. Will be removed in a later pull request
  return JSON.parse(ublOrderString);
}