const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date_from: {
        type: Date,
        required: true,
    },
    date_to: {
        type: Date,
        required: true,
    },
    temperature_below: {
        type: Number,
        required: true,
    },
    temperature_above: {
        type: Number,
        required: true,
    },

}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification