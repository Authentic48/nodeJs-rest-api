const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { body } = require('express-validator');
const checkAuth = require("../middleware/check-auth");
const errorHandler = require('../middleware/error-middleware');
const validationResult = require('express-validator');


const router = express.Router();

// signup 
router.post(
    '/signup',
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
  async  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error('User already exist');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword
    })

    const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET_KEY
      );

    res.status(201).json({
            id: user._id,
            email: user.email,
            token: userJwt
    })

  }
);




//Login
// router.post('/login', (req, res) => {

//     User.find({ email: req.body.email })
//         .exec()
//         .then(user => {
//             if (user.length < 1) {
//                 return res.status(404).json({
//                     message: 'Auth Failed'
//                 });
//             }

//             bcrypt.compare(req.body.password, user[0].password, (err, resPassCompare) => {
//                 if (!resPassCompare || err) {
//                     return res.status(401).json({
//                         message: 'Auth Failed'
//                     });
//                 }

//                 if (resPassCompare) {
//                     const token = jwt.sign({
//                         email: user[0].email,
//                         userId: user[0]._id
//                     }, JWT_KEY, {
//                         expiresIn: "1h"
//                     });
//                     return res.status(200).json({
//                         message: 'Auth Succefull',
//                         token
//                     });
//                 }
//             });
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             })
//         })



// });



// router.delete('/:userId', checkAuth, (req, res) => {
//     const userId = mongoose.Types.ObjectId(req.params.userId)

//     User.deleteOne({ "_id": userId })
//         .exec()
//         .then(deletedUserStatus => {
//             res.status(200).json({
//                 msg: 'User Deleted Succesfully...',
//                 deletedUserStatus
//             })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// })



module.exports = router;