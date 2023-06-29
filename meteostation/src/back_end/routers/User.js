const express = require('express')
require('../db/mongoose')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const router = new express.Router()

const secretKey = 'my-secret-key';

router.post('/api/register-user', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usr_registered = await User.findOne({ email })
        if (usr_registered) {
            throw new Error('User with this email already registered.')
        }
        // Create a new user with the provided name, email, and password
        const user = new User({ name, email, password });

        // Save the user to the database
        await user.save();

        const payload = {
            name,
            email,
            password
        };

        // Generate and sign the token
        const token = jwt.sign(payload, secretKey);

        // Return the token in the response
        res.json({ msg: "User sucessfuly created.", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.post('/api/login-user', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password })

        if (!user) {
            throw new Error('No user with given credentials found.')
        }

        const payload = {
            name: user.name,
            email: user.email,
            password: user.password
        };

        // Generate and sign the token
        const token = jwt.sign(payload, secretKey);

        // Return the token in the response
        res.json({ msg: "User sucessfuly logged.", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

module.exports = router