module.exports = function (firebaseInstances) {
    var RestResponse = require('../models/RestResponse.model'),
        CuentaFija = require('../models/CuentaFija.model'),
        ENUM = require('../helpers/enum.helpers'),
    cuentaFija = new CuentaFija(firebaseInstances.db);

    var developmentMode = process.env.NODE_ENV == 'production' ? false : true;

    class CuentasFijasController {

        async create(req, res) {
            try {
                var now = new Date();
                const dateNow = firebaseInstances.admin.firestore.Timestamp.fromDate(now);
                var incrementValues = {
                    sign: "zero",
                    value: 0
                }
                const newCuentaFija = {
                    name: req.body.name,
                    description: req.body.description,
                    value: req.body.value,
                    increment: incrementValues,
                    dayOfPayment: req.body.dayOfPayment,
                    date: dateNow,
                    updateDate: dateNow,
                }

                if (req.body.id && req.body.id != "") newCuentaFija.id = req.body.id;
                var newCuentaFijaResponse = await cuentaFija.create(newCuentaFija);
                return res.status(200).send(new RestResponse().okMessage(ENUM.SUCCESS_SAVING_DATABASE, newCuentaFija));
            } catch (onError) {
                console.log("Error CuentasFijasController.create", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_SAVING_DATABASE));
            }
        }
        async getAll(req, res) {
            try {
                let cuentasFijas = [];
                let query = await cuentaFija.fetchAll();
                let docs = query.docs;
                docs.forEach(doc => {
                    var time = doc.data().date;
                    var date = time.toDate();
                    var timeUpdate = doc.data().updateDate;
                    var updateDate = timeUpdate.toDate();

                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        value: doc.data().value,
                        increment: doc.data().increment,
                        dayOfPayment: doc.data().dayOfPayment,
                        date: date,
                        updateDate: updateDate,
                    };

                    cuentasFijas.push(selectedItem);
                });
                return res.status(200).send(new RestResponse().ok(cuentasFijas));
            } catch (onError) {
                console.log("Error CuentasFijasController.getAllCurrentMonth", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async getItem(req, res) {
            try {
                let doc = await cuentasFijas.fetchItem(req.params.item_id);
                var time = doc.data().date;
                var date = time.toDate();
                var timeUpdate = doc.data().updateDate;
                var updateDate = timeUpdate.toDate();
                const selectedItem = {
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    value: doc.data().value,
                    increment: doc.data().increment,
                    dayOfPayment: doc.data().dayOfPayment,
                    date: date,
                    updateDate: updateDate,
                };
                return res.status(200).send(new RestResponse().ok(selectedItem));
            } catch (onError) {
                console.log("Error CuentasFijasController.getItem", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async delete(req, res) {
            try {
                const document = await cuentasFijas.delete(req.params.item_id);
                return res.status(200).send(new RestResponse().ok(ENUM.SUCCESS_DELETING_DATABASE));
            } catch (onError) {
                console.log("Error CuentasFijasController.delete", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_DELETING_DATABASE));
            }
        }

        async update(req, res) {
            try {
                const putCuentaFija = {
                    name: req.body.name,
                    description: req.body.description,
                    value: parseFloat(req.body.value),
                    date: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
                    updateDate: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
                };
                const document = await cuentasFijas.update(req.params.item_id, putCuentaFija);
                return res.status(200).send(new RestResponse().ok(ENUM.SUCCESS_UPDATING_DATABASE));
            } catch (onError) {
                console.log("Error PurchasesController.update", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_UPDATING_DATABASE));
            }
        }

    }

    return new CuentasFijasController();
};