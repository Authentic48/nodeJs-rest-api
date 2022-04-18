const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const checkAuth = require("../middleware/check-auth");

router.get('/', (req, res, next) => {
    Product.find({})
        .select('name price _id')
        .exec()
        .then(docs => {
            const metaInfo = {
                count: docs.length,
                products: docs.map(product => {
                    return {
                        name: product.name,
                        price: product.price,
                        _id: product._id,
                        url: {
                            request: {
                                type: 'GET',
                                url: `http://localhost:8080/products/${product._id}`
                            }
                        }
                    }
                })
            }
            res.status(200).json({ metaInfo });
        }).catch(err => res.status(500).json({ error: err }))


});

router.post('/', checkAuth, (req, res, next) => {
    const { name, image, description, brand, category, price, countInStock } = req.body;
    
    const product = await Product.create({
        name,
        image,
        description,
        brand,
        category,
        price,
        countInStock,
        user: req.user._id
    })
    return res.status(201).json(product)

});

router.get(`/:productId`, (req, res, next) => {
    const product = await Product.findById(req.params.productId)
    
    if(!product) {
        throw new Error('Product not found')
    }

    return res.status(200).json(product)
});

// Patch method
router.patch(`/:productId`, checkAuth, (req, res, next) => {
    const productId = mongoose.Types.ObjectId(req.params.productId);

    const updatesOps = {};
    for (const ops of req.body) {
        updatesOps[ops.propName] = ops.value;
    }

    Product.updateOne({ "_id": productId }, { $set: updatesOps })
        .exec()
        .then(updatedProduct => {
            res.status(200).json({ updatedProduct });
        }).catch(err => res.status(500).json({ error: err }))

});

// Delete method
router.delete(`/:productId`, checkAuth, (req, res, next) => {
    const productId = mongoose.Types.ObjectId(req.params.productId)
    Product.deleteOne({ "_id": productId })
        .exec()
        .then(delProductStatus => {
            res.status(200).json({
                msg: `Products delted`,
                delProductStatus
            });
        })
        .catch(err => res.status(400).json({ error: `Something is wrong in deleteing product : ${err}` }));

});


module.exports = router;