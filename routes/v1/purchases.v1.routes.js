module.exports = function (firebaseInstances) {
    const express = require('express');
    const PurchasesController = require('../../controllers/purchases.controller')(firebaseInstances);
    const v1Purchases = express.Router();

    // Purchases
    v1Purchases
        .post('/', PurchasesController.create)
        .get('/currentMonth', PurchasesController.getAllCurrentMonth)
        .get('/:item_id', PurchasesController.getItem)
        .delete('/:item_id', PurchasesController.delete)
        .put('/:item_id', PurchasesController.update)

    return v1Purchases;
}