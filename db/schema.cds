namespace fulldemo;
using { cuid } from '@sap/cds/common';

@assert.unique: { customerNumber: [customerNumber] }
entity Customers : cuid {
  name: String(100);
  email: String(100);
  customerNumber: Integer @mandatory;
  totalPurchaseValue: Integer;
  totalRewardPoints: Integer;
  totalRedeemedRewardPoints: Integer;
  purchases: Association to many Purchases on purchases.associatedCustomer = $self;
  redemptions: Association to many Redemptions on redemptions.associatedCustomer = $self;
}

@assert.unique: { name: [name] }
entity Products : cuid {
  name: String(100) @mandatory;
  description: String(500);
  price: Integer;
  purchases: Association to many Purchases on purchases.selectedProduct = $self;
}

entity Purchases : cuid {
  purchaseValue: Integer;
  rewardPoints: Integer;
  selectedProduct: Association to Products;
  associatedCustomer: Association to Customers;
}

entity Redemptions : cuid {
  redeemedAmount: Integer;
  associatedCustomer: Association to Customers;
}

