const config = require('config');
const mongoose = require('mongoose');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const index = require('./routes/index');

var admin = require("firebase-admin");
// var serviceAccount = require("./firebase-credentials.json");
admin.initializeApp({
    credential: admin.credential.cert({
        "type": process.env.FIREBASE_TYPE,
        "project_id": process.env.FIREBASE_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.FIREBASE_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_AUTH_URI,
        "token_uri": process.env.FIREBASE_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
    }),
    databaseURL: "https://ourapp-ec834.firebaseio.com"
});
const db = admin.firestore();

const {
    get
} = require('config');
const app = express();
app.set('view engine', 'ejs');

// console.log(`NODE_ENV IS ${process.env.NODE_ENV}`);
console.log(`App Name: ${config.get('name')}`);
console.log(`Package Name: ${process.env.npm_package_name}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
// console.log(`Mail password: ${config.get('mail.password')}`);
console.log(`App mode: ${app.get('env')}`);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(helmet()); // Sending various http headers
app.use('/', index); // index
// app.use('/api', api); // api shit

app.get('/api/purchases'), (req, res) => {
    var response = null;
    db.collection('OurApp').doc('Purchases').get().then((doc) => {
        if (!doc.exists) {
            res.send(new Error("No existe"));
        }
        res.send(doc);
    }).catch((err) => {
        res.send(new Error("Error al leer de firebase"));

    });

};

app.post('/api/newPurchase', (req, res) => {
    var response = null;
    try {
        response = submitNewPurchase(req.body.description, req.body.author, parseFloat(req.body.value), req.body.comment);
    } catch (err) {
        response = new Error(err.message);
    }
    res.send("Listo, guardado!");
});

app.use(express.static('public'));


async function submitNewPurchase(description, author, value, comment) {
    const newPurchase = {
        description: description,
        author: author,
        value: value,
        comment: comment
    };
    try {
        await db.collection('Purchases').doc()
            .set(newPurchase);
        console.log("Guardado en Firestore");
        return "Listo, guardado!";

    } catch (err) {
        return err.message;
    }

}




console.log("After");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));