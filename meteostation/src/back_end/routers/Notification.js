const express = require('express')
require('../db/mongoose')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Notification = require('../models/notification')

const router = new express.Router()

router.post('/api/register-notification', async (req, res) => {
    try {

        // Verify JWT
        const token = JSON.parse(req.headers.authorization.split(' ')[1]);
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        // Check if user exists
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const { name, date_from, date_to, temperature_below, temperature_above } = req.body;

        console.log(name, user._id)
        const noti_name = await Notification.findOne({
            name,
            creator: user._id
        })
        if (noti_name) {
            return res.status(404).json({ error: 'Notification with this name is already created.' });
        }

        const new_notification = new Notification({ name, date_from, date_to, temperature_below, temperature_above, creator: user._id });

        // Save the user to the database
        await new_notification.save();

        res.json({ msg: "Notification succesfully created." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/api/get-notifications', async (req, res) => {
    try {

        // Verify JWT
        const token = JSON.parse(req.headers.authorization.split(' ')[1]);
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        // Check if user exists
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const notifications = await Notification.find({ creator: user._id })
        res.json({ msg: 'OK', notifications })

    } catch (e) {
        res.status(404).json({ error: e })
    }

})

router.delete('/api/delete-notification', async (req, res) => {
    try {
        // Verify JWT
        const token = JSON.parse(req.headers.authorization.split(' ')[1]);
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        // Check if user exists
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name } = req.body
        const result = await Notification.deleteOne({ name, creator: user._id });
        if (result.deletedCount === 1) {
            res.json({ msg: 'Succesfully deleted notification.' })
        } else {
            res.json({ msg: 'Notification has not been deleted - we went in trouble, sorry.' })
        }
    } catch (error) {
        res.status(404).json(error)
    }
})

module.exports = router