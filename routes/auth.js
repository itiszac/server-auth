const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');

// api/user/register
router.post('/register', async (req, res) => {
    // validation
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if email is in DB
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exists');

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (e) {
        res.status(400).send(e);
    }
});

// api/user/login
router.post('/login', async (req, res) => {
    // validation
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if email is in DB
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email or password is incorrect.');

    // check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Email or password is incorrect.');

    // generate and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET, { expiresIn: '1h'});
    res.header('auth-token', token).send(token);
});

module.exports = router;