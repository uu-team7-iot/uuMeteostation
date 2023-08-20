const express = require('express')
require('./db/mongoose')
const userRoutes = require('./routes/User');
const meteostationRoutes = require('./routes/Meteo');
const notificationRoutes = require('./routes/Notification');
const measureRoutes = require('./routes/Measure');
const path = require('path')
require ('./utils/cronScheduler')

const app = express()

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static(path.join(__dirname, '../../build')));


app.use(userRoutes);
app.use(meteostationRoutes);
app.use(notificationRoutes);
app.use(measureRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
})

app.listen(PORT, () => {
    console.log('Server is up on port ' + PORT)
})