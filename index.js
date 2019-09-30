const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// import routes
const authRoute = require('./routes/auth');
const exampleRoute = require('./routes/example');

dotenv.config();

// connect to DB
mongoose.connect(
    process.env.DB_URI,
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => console.log('DB connected..')
);


// middleware
app.use(express.json());

// route middleware
app.use('/api/user', authRoute);
app.use('/api/example', exampleRoute);

app.listen(5000, () => console.log('Server running'));