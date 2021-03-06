const config = require('config');
const mongoose = require('mongoose');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
var CuentaFija = require('./models/CuentaFija');
var PagoCuentaFija = require('./models/PagoCuentaFija');

var firebaseInstances = {};
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-credentials.json");
admin.initializeApp({
    // credential: admin.credential.cert({
    //     "type": process.env.FIREBASE_TYPE,
    //     "project_id": process.env.FIREBASE_PROJECT_ID,
    //     "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    //     "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    //     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    //     "client_id": process.env.FIREBASE_CLIENT_ID,
    //     "auth_uri": process.env.FIREBASE_AUTH_URI,
    //     "token_uri": process.env.FIREBASE_TOKEN_URI,
    //     "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    //     "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
    // }),
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ourapp-ec834.firebaseio.com"
});
const db = admin.firestore();

firebaseInstances.db = db;
firebaseInstances.admin = admin;
const {
    get
} = require('config');
const {
    diff
} = require('semver');
const app = express();
app.use(cors({
    origin: true
}));
app.set('view engine', 'ejs');

// console.log(`NODE_ENV IS ${process.env.NODE_ENV}`);
console.log(`App Name: ${config.get('name')}`);
console.log(`Package Name: ${process.env.npm_package_name}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail password: ${config.get('mail.password')}`);
console.log(`App mode: ${app.get('env')}`);


class RestResponse {
    constructor(message, success, value) {
        this.message = message,
            this.success = success,
            this.value = value
    }
    ok(valueok) {
        return new RestResponse("", true, valueok);
    }
    okMessage(messageok, valueok) {
        return new RestResponse(messageok, true, valueok);
    }
    badRequest(messagebadrequest) {
        return new RestResponse(messagebadrequest, false);
    }
    serverError(messageServerError) {
        return new RestResponse(messageServerError, false);
    }
}
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(helmet()); // Sending various http headers

/////Routing
// API VERSION 1
require('./routes/v1/index.routes.js')(app, firebaseInstances);


app.get('/api/authors', (req, res) => {
    (async () => {
        try {
            let query = db.collection('Authors');
            let authors = [];
            await query.get().then(data => {
                let docs = data.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                    };
                    authors.push(selectedItem);
                }
            });
            return res.status(200).send(new RestResponse().ok(authors));
        } catch (err) {
            console.log("Error /api/authors", error);
            return res.status(500).send(new RestResponse().serverError("Error al leer de la database"));
        }
    })();
});

app.get('/api/typePurchases', (req, res) => {
    (async () => {
        try {
            let query = db.collection('TypePurchase');
            let typePurchases = [];
            await query.get().then(data => {
                let docs = data.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                    };
                    typePurchases.push(selectedItem);
                }
            });
            return res.status(200).send(new RestResponse().ok(typePurchases));
        } catch (err) {
            console.log("Error /api/typePurchases", error);
            return res.status(500).send(new RestResponse().serverError("Error al leer de la database"));
        }
    })();
});



/////////////////  pagosCuentasFijas

// delete item
app.delete('/api/pagosCuentasFijas/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('PagosCuentasFijas').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send(new RestResponse().ok("deleted"));
        } catch (error) {
            console.log("Error delete /api/pagosCuentasFijas/:item_id", error);
            return res.status(500).send(new RestResponse().serverError("Error al leer de la database"));
        }
    })();
});


function getDateNow() {
    var date = admin.firestore.Timestamp.fromDate(new Date());
    return date;
}

async function getIncrementValueOfCuentasFijas(idCuentaFija, actualValue) {
    var incrementValue = {
        sign: "",
        value: 0
    };
    try {
        const document = db.collection('CuentasFijas').doc(idCuentaFija);

        var response = await document.get();
        var lastValue = 0.00;

        lastValue = parseFloat(parseFloat(response.data().value).toFixed(2));

        var diffValue = parseFloat(parseFloat(parseFloat(actualValue.toFixed(2)) - lastValue).toFixed(2));
        var signValue = Math.sign(diffValue) == 0 ? "zero" : Math.sign(diffValue) > 0 ? "positive" : "negative";
        incrementValue.sign = signValue;
        incrementValue.value = Math.abs(diffValue);

        return incrementValue;
    } catch (error) {
        console.log("Error getIncrementValueOfCuentasFijas", error);
        return incrementValue;
    }
}


app.use(express.static('public'));

console.log("After");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));