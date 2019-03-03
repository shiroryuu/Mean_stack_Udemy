const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/posts');

const app = express();

mongoose.connect("mongodb+srv://arvind:KLussPsy1uxzxbA1@cluster0-foncb.mongodb.net/node-angular?retryWrites=true")
.then(()=>{
  console.log("connected to db");
})
.catch(() => {
  console.log("connection failed!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); //optional

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
});


app.get('/api/posts/:id',(req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if (post) {
      res.status(200).json({post});
    } else {
      res.status(404).json({message: "Post not found !!"});
    }
  })
});

app.post('/api/posts',(req,res,next) => {
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

app.get('/api/posts',(req,res,next) =>{
  Post.find().then((results)=>{
    res.status(200).json({
      "message": "Message was delivered successfully",
      "posts": results
    });
  });
});

app.put('/api/posts/:id',(req,res,next)=>{
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

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id:req.params.id}).then(result =>{
    console.log(result);
  });
  res.status(200).json({
    message: "Post deleted"
  });
});

module.exports = app;
