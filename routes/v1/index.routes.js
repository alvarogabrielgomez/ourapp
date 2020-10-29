module.exports = function (app, firebaseInstances) {
    let apiVersion = "v1";
    let endPoint = `/api/${apiVersion}`;

    app.use(`${endPoint}/purchases`, require(`./purchases.${apiVersion}.routes`)(firebaseInstances));
    app.use(`${endPoint}/cuentasFijas`, require(`./cuentasFijas.${apiVersion}.routes`)(firebaseInstances));
    app.use(`${endPoint}/pagosCuentasFijas`, require(`./pagosCuentasFijas.${apiVersion}.routes`)(firebaseInstances));
    // app.use('/api/v1', [AuthStore.authenticate], require('../routes/auth.routes'));
    // app.use('/api/v1/admin', [AuthStore.authenticate, AuthStore.isAdmin], require('../routes/admin.routes'));
};