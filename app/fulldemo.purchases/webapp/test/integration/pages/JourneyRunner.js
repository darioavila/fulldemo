sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"fulldemo/purchases/test/integration/pages/PurchasesList",
	"fulldemo/purchases/test/integration/pages/PurchasesObjectPage"
], function (JourneyRunner, PurchasesList, PurchasesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('fulldemo/purchases') + '/test/flpSandbox.html#fulldemopurchases-tile',
        pages: {
			onThePurchasesList: PurchasesList,
			onThePurchasesObjectPage: PurchasesObjectPage
        },
        async: true
    });

    return runner;
});

