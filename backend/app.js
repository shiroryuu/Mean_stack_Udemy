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
    "GET,POST,PATCH,DELETE,OPTIONS");
  next();
});


app.post('/api/posts',(req,res,next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // console.log(post);
  post.save();

  res.status(201).json({
    "message": "Post was addedd Successfully"
  });

});
app.get('/api/posts',(req,res,next) =>{
  const posts = [
    {
      "id": "1324124214",
      "title": "Hello who is this",
      "content": "Hey this is MEAN course!"
    },
    {
      "id": "13243124gdss",
      "title": "What is Mean stack",
      "content": "MEAN stands for Mongo Angular Express Node"
    }
  ];
  // res.json(posts);
  res.status('200').json({
    "message": "Message was delivered successfully",
    "posts": posts
  });
});

module.exports = app;
