// get history of chats

const io = require("../socket.js").getio();

// post chat, save then emit
const Channel = require(".././models/Channel");
const User = require(".././models/User");
const Chat = require(".././models/Chat");

module.exports = async (req, res) => {
  // const {
  //   queryn: { user },
  // } = req;
  let user = JSON.parse(req.query.user);
  console.log("USERR", JSON.parse(req.query.user));
  let email = user?.email;
  let ChannelId = user?.channel;
  // console.log(user?.channel);

  if (!user?.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!user?.channel) {
    return res.status(422).json({
      errors: {
        channel: "is required",
      },
    });
  }

  let users = await User.find({ email: email }).limit(1);
  let userInfo = users[0] || {};
  console.log(userInfo._id);

  let realChannelCheck = await Channel.find({
    _id: ChannelId,
    members: userInfo._id,
  }).limit(1);

  if (realChannelCheck === undefined) {
    // not a real channel or have access!
    res.json({ Error: "no access" });
  } else {
    // Real channel and they have access!
    let updatedChannel = await Chat.updateMany(
      { channelID: ChannelId },
      { $addToSet: { readBy: [userInfo._id.toString()] } }
    );
    let reqChatHistory = await Chat.find({ channelID: ChannelId }).sort({
      sent: -1,
    });
    res.send(reqChatHistory); // lastly show channels
  }
};
