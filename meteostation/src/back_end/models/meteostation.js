const mongoose = require('mongoose')

const meteostationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        required: true,
        trim: true
    },
    access_key: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Meteostation = mongoose.model('Meteostation', meteostationSchema)

module.exports = Meteostation