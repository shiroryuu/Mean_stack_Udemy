const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token,"V9h5Zt8m5AlItRIYtH9TJmGfsm6suncr4phS87wabJB4C7cPtA80oe");
    next();
  } catch (error) {
    res.status(401).json({message: "authentication denied!!", error});
  }
};
