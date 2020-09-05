const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    let response = {
        title: "Test API",
        message: "mamaguevo"
    }
    res.send(response);
})

module.exports = router;