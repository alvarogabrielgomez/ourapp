module.exports = function (firebaseInstances) {
    var RestResponse = require('../models/RestResponse.model'),
        Purchases = require('../models/Purchase.model'),
        ENUM = require('../helpers/enum.helpers')
    purchases = new Purchases(firebaseInstances.db);

    var developmentMode = process.env.NODE_ENV == 'production' ? false : true;

    class PurchasesController {

        async create(req, res) {
            try {
                var now = new Date();
                const newPurchase = {
                    types: req.body.types,
                    author: req.body.author,
                    value: parseFloat(req.body.value),
                    description: req.body.description,
                    date: firebaseInstances.admin.firestore.Timestamp.fromDate(now)
                };
                var newPurchaseResponse = await purchases.create(newPurchase);
                newPurchase.date = now;
                return res.status(200).send(new RestResponse().okMessage(ENUM.SUCCESS_SAVING_DATABASE, newPurchase));
            } catch (onError) {
                console.log("Error PurchasesController.create", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_SAVING_DATABASE));
            }
        }
        async getAllCurrentMonth(req, res) {
            try {
                let purchases = [];
                let query = await purchases.fetchCurrentMonth();
                let docs = query.docs;
                docs.forEach(doc => {
                    var time = doc.data().date;
                    var date = time.toDate();
                    const selectedItem = {
                        id: doc.id,
                        description: doc.data().description,
                        author: doc.data().author,
                        value: doc.data().value,
                        types: doc.data().types,
                        date: date,
                    };
                    purchases.push(selectedItem);
                });
                return res.status(200).send(new RestResponse().ok(purchases));
            } catch (onError) {
                console.log("Error PurchasesController.getAllCurrentMonth", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async getItem(req, res) {
            try {
                let doc = await purchases.fetchItem(req.params.item_id);
                var time = doc.data().date;
                var date = time.toDate();
                const selectedItem = {
                    id: doc.id,
                    description: doc.data().description,
                    author: doc.data().author,
                    value: doc.data().value,
                    types: doc.data().types,
                    date: date,
                };
                return res.status(200).send(new RestResponse().ok(selectedItem));
            } catch (onError) {
                console.log("Error PurchasesController.getItem", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async delete(req, res) {
            try {
                const document = await purchases.delete(req.params.item_id);
                return res.status(200).send(new RestResponse().ok(ENUM.SUCCESS_SAVING_DATABASE));
            } catch (onError) {
                console.log("Error PurchasesController.delete", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_DELETING_DATABASE));
            }
        }

        async update(req, res) {
            try {
                const putPurchase = {
                    types: req.body.types,
                    updateAuthor: req.body.author,
                    value: parseFloat(req.body.value),
                    description: req.body.description,
                    updateDate: firebaseInstances.admin.firestore.Timestamp.fromDate(now),
                    date: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
                };
                const document = await purchases.update(putPurchase);
                return res.status(200).send(new RestResponse().ok(ENUM.SUCCESS_UPDATING_DATABASE));
            } catch (onError) {
                console.log("Error PurchasesController.update", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_UPDATING_DATABASE));
            }
        }

    }

    return new PurchasesController();
};