const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const checkAuth = require("../middleware/check-auth");



router.get('/', checkAuth, (req, res, next) => {
    const orders = await Order.find({
        user: req.user.id,
      }).populate('product');
    return res.status(200).send(orders);
});

router.post('/', checkAuth, (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    console.log(`${orderItems}`);

    if (orderItems && orderItems.length === 0) {
        throw new Error('Oops you forgot to select a product')
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    })

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

});

router.get(`/:orderId`, checkAuth, (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate('product');

    if (!order) {
      throw new Error('Order not found!');
    }

    if (order.user.id !== req.user.id) {
        throw new Error('Not authorized');
    }

    return res.status(200).send(order);
});


// Delete method
router.delete(`/:orderId`, checkAuth, (req, res, next) => {
    const order = await Order.findById(req.params.orderId).populate('product');

    if (!order) {
      throw new Error('Order not found!');
    }

    if (order.user.id !== req.user.id) {
        throw new Error('Not authorized');
    }

    order.remove();

    return res.status(204).send('Order deleted successfully');
});


module.exports = router;