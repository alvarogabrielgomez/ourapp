module.exports = function (firebaseInstances) {
    const express = require('express');
    const PagoCuentasFijasController = require('../../controllers/pagosCuentasFijas.controller')(firebaseInstances);
    const v1Purchases = express.Router();

    // Purchases
    v1Purchases
        .post('/', PagoCuentasFijasController.create)
        .get('/currentMonth', PagoCuentasFijasController.getAllCurrentMonth)
        .get('/', PagoCuentasFijasController.getAll)
        .get('/:item_id', PagoCuentasFijasController.getItem)
        .delete('/:item_id', PagoCuentasFijasController.delete)
        .put('/:item_id', PagoCuentasFijasController.update)

    return v1Purchases;
}