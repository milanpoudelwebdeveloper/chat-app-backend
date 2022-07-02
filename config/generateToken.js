const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  //signing new token with unique id, a secret that we give ourselves
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
