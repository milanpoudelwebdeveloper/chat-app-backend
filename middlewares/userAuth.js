const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//this is authorization middleware
exports.authCheck = async (req, res) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decoding id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //now we can find the user by the id
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (e) {
      res.status(401).send("Unauthorized and invalid token");
    }
  }
};
