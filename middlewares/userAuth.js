const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//this is authorization middleware
exports.authCheck = async (req, res, next) => {
  let token;

  console.log("Authorization token is", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("real token is", token);
      //decoding id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("decoded token is", decoded);

      //now we can find the user by the id
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      console.log(e);
      res.status(401).send("Something went wrong");
    }
  }
};
