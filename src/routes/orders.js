const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/order');
const checkAuth = require("../middleware/check-auth");



router.get('/', checkAuth, (req, res, next) => {
    const orders = await Order.find({
        user: req.user.id,
      }).populate('product');
    return res.send(orders);
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
    const orderId = mongoose.Types.ObjectId(req.params.orderId)
    Order.findById(orderId)
        .exec()
        .then(orderFoundRes => {
            if (orderFoundRes) {
                const order = {
                    name: orderFoundRes.name,
                    quantity: orderFoundRes.quantity,
                    product: orderFoundRes.product,
                    _id: orderFoundRes._id,
                    url: {
                        request: {
                            type: 'GET',
                            url: `http://localhost:8080/products/${orderFoundRes.product}`
                        }
                    }
                }
                res.status(200).json({ order });
            } else {
                res.status(400).json({ msg: 'order does not exist ' });
            }
        }).catch(err => res.status(500).json({ error: err }))
});

// // Patch method
// router.patch(`/:orderId`, (req, res, next) => {
//     const orderId = mongoose.Types.ObjectId(req.params.orderId);

//     const updatesOps = {};
//     for (const ops of req.body) {
//         updatesOps[ops.propName] = ops.value;
//     }

//     Order.updateOne({ "_id": OrderId }, { $set: updatesOps })
//         .exec()
//         .then(updatedOrder => {
//             res.status(200).json({ updatedOrder });
//         }).catch(err => res.status(500).json({ error: err }))

// });

// Delete method
router.delete(`/:orderId`, checkAuth, (req, res, next) => {
    const orderId = mongoose.Types.ObjectId(req.params.orderId)
    Order.deleteOne({ "_id": orderId })
        .exec()
        .then(delOrderStatus => {
            res.status(200).json({
                msg: `Orders delted`,
                delOrderStatus
            });
        })
        .catch(err => res.status(400).json({ error: `Something is wrong in deleteing Order : ${err}` }));

});


module.exports = router;