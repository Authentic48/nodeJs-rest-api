const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const JWT_KEY = 'secret';

const checkAuth = require("../middleware/check-auth");




router.post('/signup', (req, res) => {
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    //Hash the password
    bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save()
                .then(userData => {
                    res.status(201).json({
                        message: 'User Created Succesfully...',
                        userData
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
        }
    });
});




//Login
router.post('/login', (req, res) => {

    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(404).json({
                    message: 'Auth Failed'
                });
            }

            bcrypt.compare(req.body.password, user[0].password, (err, resPassCompare) => {
                if (!resPassCompare || err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    });
                }

                if (resPassCompare) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, JWT_KEY, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Succefull',
                        token
                    });
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })



});



router.delete('/:userId', checkAuth, (req, res) => {
    const userId = mongoose.Types.ObjectId(req.params.userId)

    User.deleteOne({ "_id": userId })
        .exec()
        .then(deletedUserStatus => {
            res.status(200).json({
                msg: 'User Deleted Succesfully...',
                deletedUserStatus
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})



module.exports = router;