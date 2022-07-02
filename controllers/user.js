const generateToken = require("../config/generateToken");
const User = require("../models/userModel");

exports.registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fiels");
  }
  //if user already exists then
  const userExists = await User.findOne({ email }).exec();

  if (userExists) {
    res.status(400).send("The user with that email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  //if user has been created then
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: name,
      email: email,
      pic: pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).send("Creating user failed, please try again");
  }
};
