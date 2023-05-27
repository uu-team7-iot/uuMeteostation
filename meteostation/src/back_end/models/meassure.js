const mongoose = require('mongoose')

const meassureSchema = new mongoose.Schema({
    temp: {
        type: Number,
        required: true,
    },
    meteostation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Meteostation'
    },
    time: {
        type: Date,
        required: true
    }
})

const Meassure = mongoose.model('Meassure', meassureSchema)

module.exports = Meassure