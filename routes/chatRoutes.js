const express = require("express");
const { accessChat } = require("../controllers/chat");
const { authCheck } = require("../middlewares/userAuth");
const router = express.Router();

//accessing a single chat

router.post("/chat", authCheck, accessChat);
// router.get("/chats", fetchChats);
// router.post("/groupChats", authCheck, createGroupChat);
// router.put("/chatGroup/:id", authCheck, renameGroupChat);
// router.put("/chatGroup/:id", authCheck, addToGroupChat);

module.exports = router;