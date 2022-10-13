// post chat, save then emit
const io = require("../socket.js").getio();
const Channel = require(".././models/Channel");
const User = require(".././models/User");
const Chat = require(".././models/Chat");

module.exports = async (req, res) => {
  const {
    body: { user },
  } = req;

  let ChannelId = req.params && req.params.channelId;

  if (
    !user.email ||
    !user.name ||
    !user.role ||
    // !user.isFile ||
    !req.params.channelId
  ) {
    return res.status(422).json({ err: "Email, Name, ChannelId, & isFile are all required." });
  }

  let msg = user.text;
  let email = user.email;
  let name = user.name;
  let role = user.role;
  let isFile = user.isFile || false;
  let fileName = user.fileName;
  let fileURL = user.fileURL;

  let users = await User.find({ email: email }).limit(1);
  let userInfo = users[0];
  let realChannelCheck = await Channel.find({ _id: ChannelId, members: userInfo._id }).limit(1);

  if (realChannelCheck === undefined) {
    // not a real channel or have access!
    res.status(200).send({ error: "no access" });
  } else {
    // Real channel and they have access!

    var timezo = Date.now(); // time in milliseconds
    console.log(timezo);

    Channel.findOneAndUpdate(
      {
        _id: ChannelId,
      },
      {
        lastActive: timezo,
      },
      (error, channel) => {
        console.log(channel);
      }
    ); // updates Channel's lastActive value for "listChannel" requests

    if (!isFile) {
      // for normal chats

      const doc = new Chat({
        userId: userInfo._id,
        role: role,
        channelID: ChannelId,
        displayName: name,
        text: msg,
        sent: timezo,
        otd: false,
        readBy: [userInfo._id.toString()],
      });

      doc.save();

      // first see if user is valid, check email to user id, then see if they are invited to channel
      // if so then they can send message, also grab their display names

      io.to(ChannelId).emit("MESSAGES___", {
        userId: userInfo._id,
        role: role,
        channelID: ChannelId,
        displayName: name,
        text: msg,
        otd: false,
        sent: timezo,
        readBy: [userInfo._id.toString()],
      });
      io.emit("HEY");
      res.status(200).send({ success: true });
    } else {
      // for chats with files

      const doc = new Chat({
        userId: userInfo._id,
        role: role,
        channelID: ChannelId,
        displayName: name,
        text: fileName,
        file: fileURL,
        sent: timezo,
        readBy: [userInfo._id.toString()],
      });

      doc.save();

      // first see if user is valid, check email to user id, then see if they are invited to channel
      // if so then they can send message, also grab their display names

      io.to(ChannelId).emit("MESSAGES___", {
        userId: userInfo._id,
        role: role,
        channelID: ChannelId,
        displayName: name,
        text: fileName,
        file: fileURL,
        otd: false,
        sent: timezo,
        readBy: [userInfo._id.toString()],
      });
      res.status(200).send({ success: true });
    }
  }
};