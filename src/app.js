const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/user')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

const app = express();


// DB Connection 
connectDB()


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
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
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


const PORT = process.env.PORT || 5000 


app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} on port ${PORT}`.blue.underline))
module.exports = app;
