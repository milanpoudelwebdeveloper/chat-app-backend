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
    return;
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
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send("Incorrect password");
    }
  } else {
    res.status(401).send("User with that email doesn't exist");
  }
};

exports.getAllUsers = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        //if keyword is present then
        //here $regex helps in matching the patterns of keyword and or helps in finding all the database
        //results that match the keyword we sent in name and email
        $or: [
          { name: { $regex: req.query.keyword, $options: "i" } },
          {
            email: { $regex: req.query.keyword, $options: "i" },
          },
        ],
      }
    : //otherwise we do nothing
      {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .exec();
  res.status(200).json(users);
};
