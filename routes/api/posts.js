const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

//Models

const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route POST api/posts
//@desc create a new post
// access private

router.post('/', [auth, [
    check('text', 'Text should not be empty').not().isEmpty()
]] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        });
        post = await newPost.save();
        return res.json(post)

    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

// @route GET api/posts
//@desc get all posts
// access private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date : -1 });
        return res.json(posts);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});

// @route GET api/posts/:id
//@desc get a post by id
// access private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ msg : "Post not found" });
        }
        return res.json(posts);
    } catch (err) {
        if(err.kind === 'ObjectID' ){
            return res.status(404).json({ msg : "Post not found" });
        }
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});
// @route DELETE api/posts/:id
//@desc delete a post
// access private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if(post.user !== req.user.id){
            return res.status(401).json({ msg : 'Unauthorized' });
        }
        await post.remove();
        return res.json({ msg : 'Post removed' });
        
    } catch (error) {
        if(err.kind === 'ObjectID' ){
            return res.status(404).json({ msg : "Post not found" });
        }
        console.log(err.message);
        return res.status(500).send('Server error');
    }
});



module.exports = router;