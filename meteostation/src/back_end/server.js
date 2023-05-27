const express = require('express')
require('./db/mongoose')
const path = require('path')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Meteostation = require('./models/meteostation')
const Notification = require('./models/notification')

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
            throw new Error('Meteostation with this email is already set.')
        }
        // Create a new user with the provided name, email, and password
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
        const { name, date_from, date_to, temperature_below, temperature_above } = req.body;

        
        const new_notification = new Notification({ name, date_from, date_to, temperature_below, temperature_above });

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

        if (!recipe.img){
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
})

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})