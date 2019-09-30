const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');

router.get('/', verify, (req, res) => {
    res.json({
        example: {
            name: 'Test',
            desc: 'Hello World'
        }
    });
});

module.exports = router;