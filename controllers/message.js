const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while fetching the messages");
  }
};

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!chatId || !content) {
    return res.status(400).send("Invalid data passed into the request");
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    //since we are populating on the instance that is just created, so we have to use execPopulate()
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    //populating users in chat
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //now we will find by Id and update the chat with the latest message
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while sending the message");
  }
};
