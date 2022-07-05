const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//single chat access
exports.accessChat = async (req, res) => {
  //we will take userid to create chat, this userId is actually the person we are trying to chat with

  const { userId } = req.body;
  //if the receiver userId is not available then we return
  if (!userId) {
    return res.sendStatus(400);
  }
  //this is one to one chat so groupChat is false
  //trying to find if chats between these users already exist
  var isChat = await Chat.find({
    isGroupChat: false,
    //in chat model we have users
    $and: [
      //should have two users, that is one who is currently logged in and the one the user is trying to
      //send message to(i.e. sender)
      {
        //we already populate req.user._id byu decoding the user jwt
        users: { $elemMatch: { $eq: req.user._id } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    //populating users, sender and receiver and also lastmessage
    .populate("users", "-password")
    .populate("latestMessage")
    .exec();

  console.log(
    "Check the chats before populating lastestMessage.sender",
    isChat
  );

  //after populating isChat, we need to find the info of the sender
  isChat = await User.populate(isChat, {
    //we are trying to find the sender who sent the last message
    path: "latestMessage.sender",
    //what we are tying to select and find is just name pic and email
    select: "name pic email",
  });

  console.log(
    "Now checking the chats after populating latestMessage.sender",
    isChat
  );
  //if chat exists it's length will be greater than 0 cause we are using find
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //if chats doesn't exist between these two users, then we will create a new chat
    //we create new chat with these two users
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      //after creating new chat, we will send the users info excluding password
      const fullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .exec();
      res.status(200).json(fullChat);
    } catch (e) {
      console.log(e);
      res.status(400).send("Something went wrong while setting up chat");
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    //finding from the users array where it matches the current user
    //and we will populate the groupadmin, users, and latestMessage
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    //after populating chats, we should also populate the user that has sent the latest message
    //so what we do its
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while fetching chats");
  }
};

exports.createGroupChat = async (req, res) => {
  const { users, groupName } = req.body;
  if (!users || !groupName) {
    return res.status(400).send("Please provide all the required fields");
  }
  //we will stringify and send from frontend and in backend we will parse it
  let usersArray = JSON.parse(users);
  //we need at least 2 users to start a group chat
  if (usersArray.length < 2) {
    return res.status(400).send("Please provide at least 2 users");
  }
  //we also need to add ourselves in the group chat
  usersArray.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: groupName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    //after creating groupchat we will send it back to the frotend
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .exec();
    res.status(200).json(fullGroupChat);
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while creating group chat");
  }
};

exports.renameGroup = async (req, res) => {
  const { chatId, groupName } = req.body;
  if (chatId && groupName) {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName: groupName,
        },
        {
          new: true,
        }
      )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .exec();
      res.status(200).json(updatedChat);
    } catch (e) {
      console.log(e);
      res.status(400).send("Something went wrong while renaming group");
    }
  }
};

exports.addUsersToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .exec();
    if (!chat) {
      res.status(400).send("Chat not found");
    } else {
      res.status(200).json(chat);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while adding users to group");
  }
};

exports.removeUsers = () => {
  const { chatId, userId } = req.body;
  try {
    const removed = Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .exec();
    if (!removed) {
      return res.status(400).send("Chat not found");
    } else {
      res.status(200).json(removed);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send("Something went wrong while removing user from group");
  }
};
