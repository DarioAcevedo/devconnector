//Packages
const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const {check, validationResult, body} = require('express-validator');


//Modules
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { response } = require('express');

// @route GET api/profile/me
//@desc get current user profile
// access Private

router.get('/me', async (req, res) => {
    try {
        const profile = await (await Profile.findOne({ user : req.user.id })).populate('user', ['name','avatar']);
        if(!profile){
            return res.status(400).json({msg : 'There is no profile for this user'});
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @route POST api/profile
//@desc Create or update a user profile
// access Private
router.post('/',[auth, [
        check('status', 'status is required').not().isEmpty(),
        check('skills', 'Skills is required').notEmpty()
    ]
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        instagram,
        twitter,
        linkedin
    } = req.body
    //build profile object

    profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills) {
        profileFields.skills.split(',').map(skill => skill.trim());
    }
    profile.social = {};
    if(youtube) profileFields.social.youtube = youtube;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(twitter) profileFields.social.twitter = twitter;
    if(facebook) profileFields.social.facebook = facebook;

    try {
        let profile = await Profile.findOne({ user : req.user.id });
        //Update profile
        if(user){
            profile = await Profile.findByIdAndUpdate(
                { user : req.user.id }, 
                { $set : profileFields }, 
                { new : true }
                );
                return res.json(profile);
        }
        // Create profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @route GET api/profile
//@desc get all profiles
// access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles)
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});
// @route GET api/profile/user/: user_id
//@desc get a profile by userID
// access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.params.user_id }).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({ msg : 'Profile not found' });
        return res.json(profiles);
    } catch (err) {
        console.log(err.message);
        // If there is no usrid sent
        if(err.kind == 'ObjectId') return res.status(400).json({ msg : 'Profile not found' });
        return res.status(500).send('Server error');
    }
});

// @route DELETE api/profile
//@desc Delete profile, user and posts
// access Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove users posts

        // Remove user profile
        await Profile.findOneAndDelete({ user : req.user.id });
        //Remove user
        await User.findOneAndDelete({ _id : req.user.id });

        return res.json('User deleted');

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

// @route PUT api/profile/experience
//@desc Add an experience op the array
// access Private
 router.put('/experience', [auth, [
     check('company', 'Company is required').not().isEmpty(),
     check('title', 'Title is required').not().isEmpty(),
     check('from', 'From is required').not().isEmpty()
    ]
], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return res.status(400).json( { errors : errors.array() });
        const {
            title,
            company,
            from,
            to,
            current,
            location,
            description
        } = req.body

        const newExp = {
            title,
            company,
            from,
            to,
            current,
            location,
            description
        }

        try {

            const profile = await Profile.findOne({ user : req.user.id });
            profile.experience.unshift(newExp);

            await profile.save();
            return res.json(profile);

        } catch (err) {
            console.log(err.message);
            return res.status(500).send('Server error');
        }
});

// @route DELETE api/profile/experience/:exp_id
//@desc Delete an experience from profile
// access Private

router.delete('/experience/:exp_id', auth, async (req, res) =>{
    try {
        const profile = await Profile.findOne( { user : req.user.id });

        //Remove index from profile
        const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);

        await profile.save();
        return res.json(profile);

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

// @route PUT api/profile/education
//@desc Add an education on the array
// access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofStudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
   ]
], 
   async (req, res) => {
       const errors = validationResult(req);
       if(!errors.isEmpty()) return res.status(400).json( { errors : errors.array() });
       const {
           school,
           degree,
           fieldofStudy,
           from,
           to,
           current,
           description
       } = req.body

       const newEdu = {
        school,
        degree,
        fieldofStudy,
        from,
        to,
        current,
        description
       }

       try {

           const profile = await Profile.findOne({ user : req.user.id });
           profile.education.unshift(newEdu);

           await profile.save();
           return res.json(profile);

       } catch (err) {
           console.log(err.message);
           return res.status(500).send('Server error');
       }
});

// @route DELETE api/profile/education/:edu_id
//@desc Delete an experience from profile
// access Private

router.delete('/education/:edu_id', auth, async (req, res) =>{
   try {
       const profile = await Profile.findOne( { user : req.user.id });

       //Remove index from profile
       const removeIndex = profile.education
       .map(item => item.id)
       .indexOf(req.params.edu_id);
       profile.education.splice(removeIndex, 1);

       await profile.save();
       return res.json(profile);

   } catch (err) {
       console.log(err.message);
       return res.status(500).send('Server error');
   }
});

// @route GET api/profile/github/:username
//@desc Get user repos from Github
// access Public
router.get('/github/:username', async (req,res) =>{
    try {
        const options = { 
        uri : `https://api.github.com/users/${req.params.username}/repos?per_page=5&
        sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
        method : 'GET',
        headers : { 'user-agent' : 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.log(error);
            if(response.statusCode !== 200){
                return res.status(404).json({ msg : 'No Github profile found' });
            }
            res.json(JSON.parse(body));
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server error')
    }
});



module.exports = router;