const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const Notification = require('../models/notification')
const authMiddleware = require('./authMiddleware');

const router = express.Router()

router.post('/api/notifications/register-notification', authMiddleware, async (req, res) => {
    try {

        // Check if user exists
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(200).json({ success: false, msg: 'User not found' });
        }


        const { name, date_from, date_to, temperature_below, temperature_above } = req.body;

        console.log(name, user._id)
        const noti_name = await Notification.findOne({
            name,
            creator: user._id
        })
        if (noti_name) {
            return res.status(200).json({ success: false, msg:'Notification with this name is already created.' });
        }

        const new_notification = new Notification({ name, date_from, date_to, temperature_below, temperature_above, creator: user._id });

        // Save the user to the database
        await new_notification.save();

        res.json({ success: true, msg: "Notification succesfully created." });
    } catch (error) {
        res.status(400).json({ success: false, msg: error.message });
    }
})

router.get('/api/notifications/get-notifications', authMiddleware, async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        const notifications = await Notification.find({ creator: user._id })
        res.json({ success: true, msg: 'Getting all notification for user', notifications })

    } catch (e) {
        res.status(404).json({success: false,  error: e })
    }

})

router.delete('/api/notifications/delete-notification', authMiddleware, async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(200).json({ success: false, msg:  'User not found'});
        }

        const { name } = req.body
        const result = await Notification.deleteOne({ name, creator: user._id });
        if (result.deletedCount === 1) {
            res.json({ success: true, msg: 'Succesfully deleted notification.' })
        } else {
            res.json({ success: false, msg: 'Notification has not been deleted - we went in trouble, sorry.' })
        }
    } catch (error) {
        res.status(404).json({success: false, msg: error.message})
    }
})

module.exports = router