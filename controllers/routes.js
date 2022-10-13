const AddChat = require("./AddChat")
const RequestOTD = require("./RequestOTD")
const PostOTD = require("./PostOTD")
const AddChatUser = require("./AddChatUser")
const HistoryChat = require("./HistoryChat")
const ListChannels = require("./ListChannels")
const GetFilePutLink = require("./GetFilePutLink")
const AddChannel = require("./AddChannel")
const GetTeam = require("./GetTeam")

const router = require("express").Router();

// post a channel!
router.post("/add-channel", AddChannel);
// have been tested!

// post a chat
router.post("/add-chat/:channelId", AddChat);

// post the Out The Door request
router.post("/request-chat-otd/:channelId", RequestOTD);

// post the Out The Door
router.post("/post-chat-otd/:channelId", PostOTD);

// post a user to be added to chat
router.post("/add-chat-user/:channelId", AddChatUser);

// get team ids so they can be added to chat
router.get("/get-team/:email", GetTeam);
// have been tested but no sorting yet

// get history from chat
router.get("/history-chat", HistoryChat);

// get channels from using members array!
router.get("/list-channels/:email", ListChannels);
// have been tested!

// get link for put file to AWS
router.post("/get-filelink/:channelId", GetFilePutLink);
// have been tested!

// get response to see if api is active
router.get("/", function (req, res) {
    res.send("This application was made w/ love & coffee.");
});

module.exports = router;
