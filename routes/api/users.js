const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')

const User = require('../../models/User');

// @route POST api/users
//@desc We are defining post methods
// access public

router.post('/', [
    check('name', "Name is required").not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),
    check('password', "The password must be at least 6 char long").isLength({ min : 6 })
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors : errors.array() } );
    }
    const { name, email, password } = req.body;
    try{
        //check if the user exist
        let user = await User.findOne({ email });
        if(user){
            return res.status(400).json({ errors : [{ msg : 'User already exist' }]});
        } 

        //Get gravatar
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d:  'mm'
        })

        user = new User({
            name,
            user,
            email,
            avatar,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        //Send JWT

        res.send('User registered');
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router; 
