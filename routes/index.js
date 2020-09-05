const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let response = {
        title: "Test",
        message: "mamaguevo"
    }
    res.render('index', response);
})

module.exports = router;