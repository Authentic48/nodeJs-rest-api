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
    const product = new Product({
        name: req.body.name,
        price: req.body.price,

    });
    console.log(req.body.name, req.body.price);

    product.save()
        .then(product => {
            res.status(200).json({
                msg: `Product Created...`,
                product
            });

        }).catch(err => res.status(500).json({ error: err }))

});

router.get(`/:productId`, (req, res, next) => {
    const productId = mongoose.Types.ObjectId(req.params.productId)
    Product.findById(productId)
        .exec()
        .then(product => {
            if (product) {
                res.status(200).json({ product });
            } else {
                res.status(400).json({ msg: 'Product does not exist ' });
            }
        }).catch(err => res.status(500).json({ error: err }))
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