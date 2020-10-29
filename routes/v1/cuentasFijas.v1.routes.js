module.exports = function (firebaseInstances) {
    const express = require('express');
    const CuentasFijasController = require('../../controllers/cuentasFijas.controller')(firebaseInstances);
    const v1CuentasFijas = express.Router();

    // Purchases
    v1CuentasFijas
        .post('/', CuentasFijasController.create)
        .get('/', CuentasFijasController.getAll)
        .get('/:item_id', CuentasFijasController.getItem)
        .delete('/:item_id', CuentasFijasController.delete)
        .put('/:item_id', CuentasFijasController.update)

    return v1CuentasFijas;
}