/**
 * The custom logic attached to the Purchases entity to calculate reward points based on the purchase value and update the related customer's total purchase value and total reward points.
 * @After(event = { "READ" }, entity = "fulldemoSrv.Purchases")
 * @param {(Object|Object[])} results - For the After phase only: the results of the event processing
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(results, request) {
    if (!results) return;

    const { Customers } = cds.entities;

    // Ensure results is an array
    const purchases = Array.isArray(results) ? results : [results];

    for (const purchase of purchases) {
        if (!purchase.associatedCustomer_ID || !purchase.purchaseValue) continue;

        // Calculate reward points based on purchase value
        const rewardPoints = purchase.purchaseValue * 0.1; // Example: 10% of purchase value

        // Update the purchase with calculated reward points
        purchase.rewardPoints = rewardPoints;

        // Fetch the related customer
        const customer = await SELECT.one.from(Customers).where({ ID: purchase.associatedCustomer_ID });

        if (customer) {
            // Update the customer's total purchase value and total reward points
            const updatedCustomer = {
                totalPurchaseValue: (customer.totalPurchaseValue || 0) + purchase.purchaseValue,
                totalRewardPoints: (customer.totalRewardPoints || 0) + rewardPoints
            };

            await UPDATE(Customers).set(updatedCustomer).where({ ID: purchase.associatedCustomer_ID });
        }
    }
}
