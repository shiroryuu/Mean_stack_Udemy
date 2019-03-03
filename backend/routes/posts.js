const express = require("express");

const Post = require('../models/posts');

const router = express.Router();

router.get("/:id",(req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found !!"});
    }
  })
});

router.post("",(req,res,next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Post was addedd Successfully",
      postID: result._id
    });
  });
});

router.get("",(req,res,next) =>{
  Post.find().then((results)=>{
    res.status(200).json({
      "message": "Message was delivered successfully",
      "posts": results
    });
  });
});

router.put("/:id",(req,res,next)=>{
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id:req.params.id},post).then((result)=>{
    console.log(result);
    res.status(200).json({message: "update successfull"});
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id:req.params.id}).then(result =>{
    console.log(result);
  });
  res.status(200).json({
    message: "Post deleted"
  });
});

module.exports = router;
