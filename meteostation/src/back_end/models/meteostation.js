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
    }
}, {
    timestamps: true
})

const Meteostation = mongoose.model('Meteostation', meteostationSchema)

module.exports = Meteostation