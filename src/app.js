const express = require('express');
const morgan = require('morgan');
const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/user')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const { errorHandler, notFound } = require('./middleware/error-middleware')

const app = express();


// DB Connection 
connectDB()


// Built in middeware in express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging middleware
app.use(morgan('dev'))

// Routes
// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Error Middlewares
app.use(errorHandler)
app.use(notFound)


const PORT = process.env.PORT || 5000 


app.listen(PORT, console.log(`App is running in ${process.env.NODE_ENV} on port ${PORT}`.blue.underline))
module.exports = app;
