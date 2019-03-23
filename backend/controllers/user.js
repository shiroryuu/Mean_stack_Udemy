const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt =require("jsonwebtoken");

exports.createUser = (req,res,next)=>{
  bcrypt.hash(req.body.password, 10)
    .then(hash=>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then(result=>{
          res.status(201).json({
            message: "user created !!",
            result
          });
      })
      .catch(err=>{
        res.status(500).json({
            message: "User Already Exist!"
        });
      });
    });
}

exports.userLogin = (req,res,next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user=>{
    if (!user) {
      return res.status(404).json({ message: "No users"});
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result=>{
    if (!result){
      return res.status(401).json({message: "Invalid Credentials!"});
    }
    const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
      "V9h5Zt8m5AlItRIYtH9TJmGfsm6suncr4phS87wabJB4C7cPtA80oe",
      { expiresIn: "1h" });
    // console.log(token);
    res.status(200).json({
      token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  })
  .catch(err=>{
    return res.status(401).json({message: "Invalid authentication credentials"});
  });
}
