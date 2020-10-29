module.exports = function(firebaseInstances){
    var RestResponse = require('../models/RestResponse.model'),
    PagoCuentaFija = require('../models/PagoCuentaFija.model'),
    CuentaFija = require('../models/CuentaFija.model'),
    ENUM = require('../helpers/enum.helpers'),
    pagoCuentaFija = new PagoCuentaFija(firebaseInstances.db),
    cuentaFija = new CuentaFija(firebaseInstances.db),
    var developmentMode = process.env.NODE_ENV == 'production' ? false : true;

    class PagosCuentasFijasController{
        async create (req, res){
            try{
                var now = new Date();
                var incrementValues = await cuentaFija.getIncrementValueOfCuentasFijas(req.body.idCuentaFija, req.body.value);
                var dateNow = firebaseInstances.admin.firestore.Timestamp.fromDate(now);
                var datePago = firebaseInstancesadmin.firestore.Timestamp.fromDate(new Date(req.body.date));

                var newPagoCuentaFija = {
                    idCuentaFija: req.body.idCuentaFija,
                    value: req.body.value,
                    increment: incrementValues,
                    date: datePago,
                    updateDate: dateNow
                };
                var newPagoCuentaFijaResponse = await pagoCuentaFija.create(newPagoCuentaFija);

                var updatingCuentaFija = await cuentaFija.update(req.body.idCuentaFija, {
                    value: req.body.value,
                    increment: incrementValues,
                    updateDate: dateNow // update date
                });

                return res.status(200).send(new RestResponse().okMessage(ENUM.SUCCESS_SAVING_DATABASE, newPagoCuentaFija));
            } catch(onError){
                console.log("Error PagosCuentasFijasController.create", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_SAVING_DATABASE));
            }
        }

        async update(req, res){
            try{
                var now = new Date();
                const putPagoCuentaFija = {
                    idCuentaFija: req.body.idCuentaFija,
                    value: parseFloat(req.body.value),
                    date: admin.firestore.Timestamp.fromDate(new Date(req.body.date)),
                    updateDate: firebaseInstances.admin.firestore.Timestamp.fromDate(now)
                };
                var pagoCuentaFijaResponse = await pagoCuentaFija.update(req.params.item_id, putPagoCuentaFija);
                return res.status(200).send(new RestResponse().okMessage(ENUM.SUCCESS_UPDATING_DATABASE, putPagoCuentaFija));

            } catch(onError){
                console.log("Error PagosCuentasFijasController.update", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_UPDATING_DATABASE));
            }
        }

        async getAll(req, res){
            try{
                let pagosCuentasFijas = [];
                let query = await pagoCuentaFija.fetchAll();
                let docs = query.docs;
                docs.forEach(doc => {
                    var time = doc.data().date;
                    var date = time.toDate();
                    var timeUpdate = doc.data().updateDate;
                    var updateDate = timeUpdate.toDate();

                    const items = {
                        id: doc.id,
                        idCuentaFija: doc.data().idCuentaFija,
                        value: doc.data().value,
                        increment: doc.data().increment,
                        date: date,
                        updateDate: updateDate,
                    };
                    pagosCuentasFijas.push(items);
                });
                return res.status(200).send(new RestResponse().ok(pagosCuentasFijas));

            } catch(onError){
                console.log("Error PagosCuentasFijasController.getAll", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async getItem(req, res){
            try{
                let doc = await pagoCuentaFija.fetchItem();

                var time = doc.data().date;
                var date = time.toDate();
                var timeUpdate = doc.data().updateDate;
                var updateDate = timeUpdate.toDate();

                const pagoCuentaFija = {
                    id: doc.id,
                    idCuentaFija: doc.data().idCuentaFija,
                    value: doc.data().value,
                    increment: doc.data().increment,
                    date: date,
                    updateDate: updateDate,
                };
        
                return res.status(200).send(new RestResponse().ok(pagoCuentaFija));

            } catch(onError){
                console.log("Error PagosCuentasFijasController.getItem", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        async getItemWhereIDCuentasFijas(req, res){
            try{
                let doc = await pagoCuentaFija.fetchItemWhereIDCuentaFija(req.params.id_cuenta_fija);
                let pagosCuentasFijas = [];

                docs.forEach(doc => {
                    var time = doc.data().date;
                    var date = time.toDate();
                    var timeUpdate = doc.data().updateDate;
                    var updateDate = timeUpdate.toDate();

                    const items = {
                        id: doc.id,
                        idCuentaFija: doc.data().idCuentaFija,
                        value: doc.data().value,
                        increment: doc.data().increment,
                        date: date,
                        updateDate: updateDate,
                    };
                    pagosCuentasFijas.push(items);
                });

                return res.status(200).send(new RestResponse().ok(pagosCuentasFijas));

            } catch(onError){
                console.log("Error PagosCuentasFijasController.getItemWhereIDCuentasFijas", onError);
                return res.status(500).send(new RestResponse().serverError(ENUM.ERROR_READING_DATABASE));
            }
        }

        



    }

    return new PagosCuentasFijasController();

};