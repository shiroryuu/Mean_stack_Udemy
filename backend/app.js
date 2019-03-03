const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require("./routes/posts");

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

app.use("/api/posts",postRoutes);
module.exports = app;
