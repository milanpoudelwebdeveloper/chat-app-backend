const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addUsersToGroup,
  removeUsers,
  leaveGroup,
} = require("../controllers/chat");
const { authCheck } = require("../middlewares/userAuth");
const router = express.Router();

//accessing a single chat

router.post("/chat", authCheck, accessChat);
router.get("/chats", authCheck, fetchChats);
router.post("/groupChats", authCheck, createGroupChat);
router.put("/chatGroup/rename", authCheck, renameGroup);
router.put("/chatGroup/addusers", authCheck, addUsersToGroup);
router.put("/chatGroup/removeUsers", authCheck, removeUsers);
router.put("/chatGroup/leaveGroup", authCheck, leaveGroup);

module.exports = router;
