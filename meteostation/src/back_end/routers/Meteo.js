const express = require('express')
require('../db/mongoose')
const mongoose = require('mongoose')
const Meteostation = require('../models/meteostation')


const router = new express.Router()

router.post('/api/register-meteo', async (req, res) => {
    try {
        const { name, locality } = req.body;

        const name_registered = await Meteostation.findOne({ name })
        if (name_registered) {
            throw new Error('Meteostation with this name is already set.')
        }
        // Create a new meteo with the provided information
        const new_meteo = new Meteostation({ name, locality });

        // Save the user to the database
        await new_meteo.save();

        res.json({ msg: "Meteostation succesfully created." });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get('/api/meteostations/suggest', async (req, res) => {
    const search = req.query.search;
    const meteostations = await Meteostation.find({
        name: { $regex: `^${search}`, $options: 'i' },
    });
    res.json(meteostations);
});

router.get('/api/meteo-info/:meteo_name', async (req, res) => {
    try {
        const meteo = await Meteostation.findOne({ name: req.params.meteo_name })
        if (meteo) {
            return res.json(meteo)
        }
        res.json({ error: 'Cant find meteo station with given name' })
    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router