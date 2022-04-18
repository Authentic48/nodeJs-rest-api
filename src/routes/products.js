const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const checkAuth = require("../middleware/check-auth");

router.get('/', (req, res, next) => {
    const products = await Product.find({})
    return res.status(201).json(products)
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
    const { name, image, description, brand, category, price, countInStock } = req.body;
    const product = await Product.findById(req.params.productId)

    if (!product) {
        throw new Error('Product Not Found')
    }

    product.name = name || product.name
    product.image = image || product.image
    product.description = description || product.description
    product.brand = description || product.brand
    product.category = category || product.category
    product.price = price || product.price
    product.countInStock = countInStock || product.countInStock

    const updatedProduct = await product.save();
    res.json(updatedProduct)
});

// Delete method
router.delete(`/:productId`, checkAuth, (req, res, next) => {
    const product = await Product.findById(req.params.id) 

    if (!product) {
        throw new Error('Product not found')
    } 

    product.remove();
    res.status(200).json({ message: "Product has Been deleted" })
});


module.exports = router;