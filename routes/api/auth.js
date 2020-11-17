const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//Models
const User = require('../../models/User')


// @route GET api/auth
//@desc test
// access public

router.get('/', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
    }catch(err){
        console.log(err.message);
        res.status(500).json('Server error');
    }
});

router.post('/', [
    check('email', "Please include a valid email").isEmail(),
    check('password', "Password is required").exists()
],async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json( { errors : errors.array() } );
    }
    const {email, password } = req.body;
    try{
        //check if the user exist
        let user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ errors : [{ msg : 'Invalid credentials' }]});
        } 
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ errors : [{ msg : 'Invalid credentials' }]});
        }
        
        //Send JWT
        const payload = {
            user : {
                id : user.id
            }
        };

        jwt.sign(payload, 
            config.get('jwtSecret'), 
            { expiresIn : 3600 }, 
            (err, token) => {
            if(err) throw err;
            res.json({token});
        });

    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;