const express = require('express')
require('../db/mongoose')
const mongoose = require('mongoose')
const Meteostation = require('../models/meteostation')
const Meassure = require('../models/meassure')

const router = express.Router()

router.post('/api/measure/register-meassure', async (req, res) => {
    try {
        const { measurements } = req.body;
        console.log(measurements)
        const meteo_id = req.header('gatewayId')
        const meteo_access_key = req.header('accessKey')
        console.log(meteo_id)
        console.log(meteo_access_key)

        const meteo = await Meteostation.findOne({_id: meteo_id, access_key: meteo_access_key})

        if (!meteo) {
            return res.status(404).json({ msg: 'No meteo with given id and access_key' })
        }

        for (const measureData of measurements) {
            const { temp, timestamp } = measureData;

            const report = new Meassure({
                temp,
                meteostation: new mongoose.Types.ObjectId(meteo_id),
                time: timestamp,
            });

            await report.save();
        }

        return res.json({ msg: 'done' });

    } catch (error) {
        console.log(error)
        return res.status(404).json({ error })
    }
})

router.get('/api/measure/get-last-measure/:meteo_id', async (req, res) => {
    try {
        const { meteo_id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(meteo_id)) {
            return res.status(400).json({ message: 'Invalid meteo_id' });
        }
        const measurement = await Meassure.findOne(
            { meteostation: new mongoose.Types.ObjectId(meteo_id) }
            ).sort({ time: -1 });
        if (!measurement) {
            return res.status(400).json({error: 'No measure found'})
        }
        res.json(measurement);
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Error retrieving last measurement' });
    }
});


router.post('/api/measure/get-meassures', async (req, res) => {


    function formatDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 to get the correct month since it is zero-based
        var day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }

      function formatTime(date) {
        var hours = String(date.getHours()).padStart(2, "0");
        var minutes = String(date.getMinutes()).padStart(2, "0");
        var seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      }


    try {
        const granularity_arr = ['10_minutes', '30_minutes', '1_hour', '6_hours', '1_day']
        const { meteo_id, granularity, from_date, to_date } = req.body;
        console.log(meteo_id, granularity, from_date, to_date)
        if (!mongoose.Types.ObjectId.isValid(meteo_id)) {
            return res.status(400).json({ message: 'Invalid meteo_id.' });
        }
        if (!granularity_arr.includes(granularity)) {
            return res.status(400).json({ message: 'Invalid granularity value.' });
        }
        const fromDate = new Date(from_date)
        const toDate = new Date(to_date)
        console.log(fromDate, toDate)

        const measurements = await Meassure.find({
            meteostation: new mongoose.Types.ObjectId(meteo_id),
            time: { $gte: fromDate, $lte: toDate }
        }).sort('time');

        let granularity_num = 10

        switch (granularity) {
            case '10_minutes':
                granularity_num = 10;
                break;
            case '30_minutes':
                granularity_num = 30;
                break;
            case '1_hour':
                granularity_num = 60;
                break;
            case '6_hours':
                granularity_num = 360;
                break;
            case '1_day':
                granularity_num = 1440;
                break;
            default:
                return res.status(500).json({ message: 'Error - invalid granularity.' })
        }

        const reducer = granularity_num / 5

        const totalMeasurements = measurements.length;

        const reducedMeasurements = [];

        for (let i = 0; i < totalMeasurements - reducer; i += reducer) {
            const subset = measurements.slice(i, i + reducer);

            const tempsSum = subset.reduce((sum, measurement) => sum + measurement.temp, 0);
            const averageTemp = tempsSum / subset.length;
            const firstMeasurementDate = formatDate(subset[0].time);
            const firstMeasurementTime = formatTime(subset[0].time);

            reducedMeasurements.push({
                temp: averageTemp,
                time: firstMeasurementTime,
                date: firstMeasurementDate
            });
        }

        res.status(200).json({ reducedMeasurements, message: 'Everything OK.' });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving measurements' });
    }
})

module.exports = router