const express = require("express");
const { uploadImage } = require("../controllers/cloudinary");
const { registerUser, loginUser, getAllUsers } = require("../controllers/user");
const { authCheck } = require("../middlewares/userAuth");

const router = express.Router();

router.post("/login", loginUser);

router.post("/register", registerUser);
//this one will be for uploading profile picture or any image
router.post("/uploadImage", uploadImage);

router.get("/allusers", authCheck, getAllUsers);

module.exports = router;
