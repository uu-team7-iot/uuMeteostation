const express = require('express')
require('./db/mongoose')
const mongoose = require('mongoose')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Meteostation = require('./models/meteostation')
const Notification = require('./models/notification')
const Meassure = require('./models/meassure')

const secretKey = 'my-secret-key';

const app = express()

const PORT = process.env.PORT || 3000;

// setting up a storage and instance of multer

app.use(express.json())
app.use(express.static(path.join(__dirname, '../../build')));


app.post('/api/register-user', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usr_registered = await User.findOne({ email })
        if (usr_registered) {
            throw new Error('User with this email already registered.')
        }
        // Create a new user with the provided name, email, and password
        const user = new User({ name, email, password });

        // Save the user to the database
        await user.save();

        const payload = {
            name,
            email,
            password
        };

        // Generate and sign the token
        const token = jwt.sign(payload, secretKey);

        // Return the token in the response
        res.json({ msg: "User sucessfuly created.", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.post('/api/register-meteo', async (req, res) => {
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

app.post('/api/register-notification', async (req, res) => {
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


app.post('/api/login-user', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email, password })

        if (!user) {
            throw new Error('No user with given credentials found.')
        }

        const payload = {
            name: user.name,
            email: user.email,
            password: user.password
        };

        // Generate and sign the token
        const token = jwt.sign(payload, secretKey);

        // Return the token in the response
        res.json({ msg: "User sucessfuly logged.", token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})


app.get('/api/get-image', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ name: 'Sun Rise' })

        if (!recipe) {
            return res.status(404).send('Recipe not found')
        }

        if (!recipe.img) {
            return res.status(404).send('Recipe has no img')
        }

        // Set the Content-Type header to the image MIME type
        res.setHeader('Content-Type', recipe.img.contentType)

        // Send the image binary data to the client
        res.send(recipe.img.data)

    } catch (error) {
        console.log(error)
        res.status(400).send({ error })
    }
})

app.get('/api/decode-token', (req, res) => {
    if (!req.body.token) {
        throw new Error('No token provided.')
    }

    const decoded = jwt.verify(req.body.token, secretKey);

    res.send(decoded)
})

app.get('/api/get-notifications', async (req, res) => {
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

app.delete('/api/delete-notification', async (req, res) => {
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

app.get('/api/meteostations/suggest', async (req, res) => {
    const search = req.query.search;
    const meteostations = await Meteostation.find({
        name: { $regex: `^${search}`, $options: 'i' },
    });
    res.json(meteostations);
});

// Define a route for generating a JWT
app.get('/api/generate-token', (req, res) => {
    // Define the payload to be included in the token
    const payload = {
        userId: 1234,
        email: 'user@example.com'
    };

    // Generate and sign the token
    const token = jwt.sign(payload, secretKey);

    // Return the token in the response
    res.json({ token });
});

// Define a route to handle temperature post
app.post('/api/register-meassure', async (req, res) => {
    try {
        const { measurements } = req.body;
        console.log(measurements)
        const meteo_id = req.header('gatewayId')
        console.log(meteo_id)

        const meteo = await Meteostation.findById(meteo_id)

        if (!meteo) {
            return res.status(404).json({ msg: 'No meteo with given id' })
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

app.get('/api/get-meassure-last/:meteo_id', async (req, res) => {
    try {
        const { meteo_id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(meteo_id)) {
            return res.status(400).json({ message: 'Invalid meteo_id' });
        }
        const measurement = await Meassure.findOne(
            { meteostation: new mongoose.Types.ObjectId(meteo_id) }
            ).sort({ time: -1 });
        if (!measurement) {
            res.status(400).json({error: 'No measure found'})
        }
        res.json(measurement);
    } catch (error) {
        res.status(500).json({ error: true, message: 'Error retrieving last measurement' });
    }
});


app.post('/api/get-meassures', async (req, res) => {


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


app.get('/api/meteo-info/:meteo_name', async (req, res) => {
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
})

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})