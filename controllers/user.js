const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

  const newUser = {
    name,
    email,
    password,
    pic,
  };

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  const user = await User.create(newUser);
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      res.status(200).send("Logged in successfully");
    } else {
      res.status(400).send("Incorrect password");
    }
  } else {
    res.status(401).send("User with that email doesn't exist");
  }
};
