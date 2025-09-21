/**
 * The custom logic attached to the Redemptions entity to deduct the redemption amount from the customer's total reward points and add that to their total redeemed points.
 * @On(event = { "redeem" }, entity = "fulldemoSrv.Redemptions")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
  const { Redemptions, Customers } = cds.entities;

  // Extract the redemption details from the request data
  const { associatedCustomer_ID, redeemedAmount } = request.data;

  if (!associatedCustomer_ID || redeemedAmount === undefined) {
    return request.reject(400, 'Invalid redemption data');
  }

  // Fetch the customer details
  const customer = await SELECT.one.from(Customers).where({ ID: associatedCustomer_ID });

  if (!customer) {
    return request.reject(404, 'Customer not found');
  }

  // Check if the customer has enough reward points
  if (customer.totalRewardPoints < redeemedAmount) {
    return request.reject(400, 'Insufficient reward points');
  }

  // Deduct the redeemed amount from the customer's total reward points
  customer.totalRewardPoints -= redeemedAmount;

  // Add the redeemed amount to the customer's total redeemed reward points
  customer.totalRedeemedRewardPoints += redeemedAmount;

  // Update the customer record
  await UPDATE(Customers).set({
    totalRewardPoints: customer.totalRewardPoints,
    totalRedeemedRewardPoints: customer.totalRedeemedRewardPoints
  }).where({ ID: associatedCustomer_ID });
};
