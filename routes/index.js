const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send("Es necesario saber cual usuario es");
})

router.get('/:user', (req, res) => {
    var data = {
        username: null
    }
    switch (parseInt(req.params.user)) {
        case 0:
            data.username = "Alvaro"
            break;
        case 1:
            data.username = "Angela"
            break;
        default:
            res.send("Es necesario saber cual usuario es");
            break;
    }

    res.render('index', data);
})

module.exports = router;