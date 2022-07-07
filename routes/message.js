const express = require("express");
const { allMessages, sendMessage } = require("../controllers/message");
const { authCheck } = require("../middlewares/userAuth");
const router = express.Router();

router.get("/messages/:chatId", authCheck, allMessages);

router.post("/message", authCheck, sendMessage);

module.exports = router;
