const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    //if it's group chat it can have multiple users
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        //will be id and that is reference to the user model
        ref: "User",
      },
    ],

    //latest message to display upfront in frontend
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

    //if there is groupAdmin
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
