/**
 * The custom logic attached to the Purchases entity to validate the purchase value before creating or updating a purchase to ensure it meets business rules.
 * @Before(event = { "CREATE","UPDATE" }, entity = "fulldemoSrv.Purchases")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 */
module.exports = async function(request) {
    const { Purchases, Products } = cds.entities;

    // Extract the data from the request
    const { purchaseValue, selectedProduct_ID } = request.data;

    // Ensure purchaseValue and selectedProduct_ID are defined
    if (purchaseValue === undefined || selectedProduct_ID === undefined) {
        return request.error(400, 'Purchase value and selected product must be provided.');
    }

    // Retrieve the product to validate the purchase value
    const product = await SELECT.one.from(Products).where({ ID: selectedProduct_ID });

    // Ensure the product exists
    if (!product) {
        return request.error(404, 'Selected product not found.');
    }

    // Business rule: Purchase value should not be less than the product price
    if (purchaseValue < product.price) {
        return request.error(400, `Purchase value cannot be less than the product price of ${product.price}.`);
    }

    // Additional business rules can be added here
};
