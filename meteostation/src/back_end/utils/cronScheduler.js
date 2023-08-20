const cron = require('node-cron')
require('../db/mongoose')
const User = require('../models/user')
const Notification = require('../models/notification')
const Measure = require('../models/meassure')
const Meteostation = require('../models/meteostation')
const emailSender = require('../utils/emailSender') 


function min_max_temp(measures) {
    if (measures.length === 0) {
        return [null, null]
    }

    let min_temp = measures[0].temp
    let max_temp = measures[0].temp

    for (const item of measures) {
        if (item.temp < min_temp) {
            min_temp = item.temp
        }
        if (item.temp > max_temp) {
            max_temp = item.temp
        }
    }

    return [min_temp, max_temp]
}

function messageBegin(owner_name, meteostation) {
    return `<p>Dear ${owner_name},</p> <p>we contact you due to your set notification in our application for ${meteostation} meteostation.</p>`
}


cron.schedule('* * * * *', async () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const notificationResponse = await Notification.find({ date_to: { $gt: today }, date_from: { $lt: yesterday } }).exec()
    const meteostationSet = new Set()
    for (const el of notificationResponse) {
        meteostationSet.add(el.name)
    }

    const meteoIdName = []
    for (const item of meteostationSet) {
        const meteo = await Meteostation.findOne({ name: item })
        if (meteo._id) {
            meteoIdName.push({
                name: item,
                id: meteo._id
            })
        }
    }
    const temperatures = []
    for (const item of meteoIdName) {
        const measureRes = await Measure.find({ time: { $gt: yesterday }, meteostation: item.id }).exec()

        const min_max = min_max_temp(measureRes)
        temperatures.push({
            min_temp: min_max[0],
            max_temp: min_max[1],
            meteo: item
        })
    }

    for (const el of notificationResponse) {
        const min_max_meteo = temperatures.find((item) => {
            return item.meteo.name === el.name ? true : false
        })

        const msg = {
            to: '',
            from: 'bazgierpetr@email.cz',
            subject: 'Notification',
            html: '',
        }
        

        if (min_max_meteo.min_temp || min_max_meteo.max_temp) {
            if (el.temperature_below > min_max_meteo.min_temp) {
                const usr = await User.findOne({ _id: el.creator })
                msg.to = usr.email
                msg.html = messageBegin(usr.name, el.name)
                msg.html += `<p>Temperature decrease below ${el.temperature_below} to the ${min_max_meteo.min_temp}.</p>`
            }
            if (el.temperature_above < min_max_meteo.max_temp) {
                if (!msg) {
                    const usr = await User.findOne({ _id: el.creator })
                    msg.to = usr.email
                    msg.html = messageBegin(usr.name, el.name)
                    msg.html += `<p>Temperature increase above ${el.temperature_above} to the ${min_max_meteo.max_temp}.</p>`
                } else {
                    msg += `<p>Temperature increase above ${el.temperature_above} to the ${min_max_meteo.max_temp}.</p>`
                }
            }
        }
        msg.html = msg.html ? msg.html+ '<p>Thank you for using our services.</p> <p>Your MeteoApp.</p>' : ''
        console.log(msg)
        if (msg.to){
            await emailSender(msg)
            msg.to, msg.html = ''
        }
        
    }


})

