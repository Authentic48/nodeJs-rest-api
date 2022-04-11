const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/user')
const uri = 'mongodb://localhost:27017/rest-api'

// conncet to database
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true })



// Built in middeware in express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging middleware
app.use(morgan('dev'))

//Add heders
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', '*');
    if (req.method === 'OPTIONS') {
        req.header('Access-Control-Allow-Methods', 'POST,PUT,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
})


// Routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

//Fallback routes

app.use((req, res, next) => {
    const error = new Error(`Not found your route :${req.hostname}, what you are looking for...`);
    error.status = 404;
    next(error);
});

// Trigger changes
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        msg: error.message
    });
});

module.exports = app;
