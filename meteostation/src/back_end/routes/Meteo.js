const express = require('express')
require('../db/mongoose')
const User = require('../models/user')
const Meteostation = require('../models/meteostation')
const authMiddleware = require('./authMiddleware');
const randomstring = require("randomstring");

const router = express.Router()

router.post('/api/meteostations/register-meteo', authMiddleware, async (req, res) => {
    try {
        const { name, locality } = req.body;

        const user = await User.findOne({ email: req.user.email })

        if (!user) {
            return res.json({success: false, msg: 'No user with email provided in token'})
        }

        const name_registered = await Meteostation.findOne({ name })
        if (name_registered) {
            return res.status(200).json({success: false, msg: 'Meteostation with this name is already set.'})
        }
        // Create a new meteo with the provided information
        const new_meteo = new Meteostation({ name, locality, owner: user.id,  access_key: randomstring.generate(17)});

        // Save the user to the database
        await new_meteo.save();

        return res.json({ success: true, msg: "Meteostation succesfully created." });
    } catch (error) {
        res.status(400).json({ error: true, msg: error.message });
    }
})

router.get('/api/meteostations/suggest', async (req, res) => {
    const search = req.query.search;
    const meteostations = await Meteostation.find({
        name: { $regex: `^${search}`, $options: 'i' },
    });
    res.json(meteostations);
});

router.get('/api/meteostations/get-by-user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email })

        if (!user) {
            return res.json({success: false, msg: 'No user with email provided in token'})
        }

        const meteostations = await Meteostation.find({ owner: user._id })
        return res.json({ success: true, msg: 'Found meteostations by user', meteostations })

    } catch (error){
        console.log(error)
        return res.status(404).json({success: false, msg: error})
    }
})

router.patch('/api/meteostations/update-meteo', async (req, res) => {
    try{
        const {nameOrg, nameTmp, localityTmp, accessKeyTmp, owner} = req.body
        console.log(nameOrg, nameTmp, localityTmp, accessKeyTmp)
        const changed_doc = await Meteostation.findOneAndReplace({name: nameOrg}, {name: nameTmp, locality: localityTmp, access_key: accessKeyTmp, owner})
        console.log(changed_doc)
        if (changed_doc) {
            return res.status(200).send({success: true, msg: 'Update done successfully.'})
        } else {
            return res.status(200).send({success: false, msg: 'Something went wrong.'})
        }
    } catch (e) {
        return res.status(404).send({success: false, msg: e})
    }
})

router.get('/api/meteostations/meteo-info/:meteo_name', async (req, res) => {
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

router.get('/api/meteostations/all-meteo-names', async (req, res) => {
    try {
        const meteo_names = await Meteostation.find({}).sort({ name: 1 }).select('name').exec();
        if (meteo_names) {
            return res.json(meteo_names)
        }
        res.json({ error: 'No names', msg: 'No meteostations found' })
    } catch (error) {
        res.status(500).json({ error: 'Some error occuried.' })
    }
})

router.delete('/api/meteostations/delete-by-name', async (req, res) => {
    try {
        const {name} = req.body
        console.log(`I got ${name} meteostation to be deleted.`)
        const found_meteo = await Meteostation.findOneAndDelete({name})
        if (found_meteo){
            return res.status(200).send({success: true, msg: `Successfully deleted meteostation ${name}.`})
        } else {
            return res.status(200).send({success: false, msg: `Can not delete meteostation ${name}, try again.`})
        }
    } catch (error) {
        return res.status(404).send({success: false, msg: error})
    }
})

module.exports = router