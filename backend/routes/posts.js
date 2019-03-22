const express = require("express");
const multer = require("multer");

const Post = require('../models/posts');
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  // destination: "backend/images/"
  destination: (req,file,cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    // console.log(isValid);
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req,file,cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+ext);
  }
});

const router = express.Router();

router.get("/:id",(req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found !!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
});

router.post("", checkAuth, multer({storage: storage}).single("image") ,(req,res,next) => {
  // const post = req.body;
  const url = req.protocol+"://"+req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+"/images/"+req.file.filename,
    creator: req.userData.userId
  });
  // console.log(post);
  post.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Post was addedd Successfully",
      postID: result._id,
      post: {
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath,
        creator: result.creator
      }
    });
  })
  .catch(error =>{
    res.status(500).json({
      message: "Failed to add post"
    })
  });
});

router.get("",(req,res,next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page; // + is used for converting into int
  const pageQuery = Post.find();
  let posts;

  if (pageSize && currentPage){
    pageQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  pageQuery.then((results)=>{
    posts = results;
    return Post.count();
  }).then(count=>{
    res.status(200).json({
      "message": "Message was delivered successfully",
      "posts": posts,
      "postsCount": count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
});

router.put("/:id", checkAuth,
multer({storage: storage}).single("image"),
(req,res,next)=>{
  let imagePath = req.body.imagePath;
  if (req.file){
    const url = req.protocol+"://"+req.get("host");
    imagePath = url+"/images/"+req.file.filename;
  }
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id:req.params.id, creator:req.userData.userId },post).then(
    result=>{
      console.log(result);
      if(result.nModified > 0){
        res.status(200).json({message: "update successfull"});
      } else {
        res.status(401).json({message:"unauthorized!"});
      }
  })
  .catch(error=>{
    res.status(500).json({
      message: "couldn't update post!"
    });
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({_id:req.params.id, creator:req.userData.userId}).then(result =>{
    console.log(result);
    if(result.n>0){
      res.status(200).json({
        message: "Post deleted"
      });
    } else {
      res.status(401).json({
        message: "unauthorized"
      });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
});

module.exports = router;
