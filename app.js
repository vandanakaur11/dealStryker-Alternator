require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
// Socket.io Setup
// const http = require("http").Server(app);
// const socket = require("socket.io");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// for parsing application/xwww-
//form-urlencoded
const cors = require("cors");
// const whitelist = ["http://localhost:3000", "http://example2.com"];
// const corsOptions = {
//   credentials: true, // This is important.
//   origin: (origin, callback) => {
//     if (whitelist.includes(origin)) return callback(null, true);

//     callback(new Error("Not allowed by CORS"));
//   },
// };
const corsOptions = {
  credentials: true,
  origin: "*",
};

app.use(cors(corsOptions));

require("./models/connection");
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, form-data"
  );
  next();
});

let server = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("App up and running at port ", port);
  }
});

const io = require("./socket.js").init(server);

// handle incoming connections from clients
let user = 0;
io.on("connect", function (socket) {
  user++;
  console.log("USER CONNECTED", user);
  // once a client has connected, we expect to get a ping from it saying what thread they want to join
  socket.on("join", ({ room }, callback) => {
    // room => "thread_id", type: string
    socket.join(room);
    console.log(`user joined Room =>> `, room);
  });

  socket.on("leave", async ({ room }) => {
    try {
      await socket.leave(room);
      console.log(`user left Room =>> `, room);
      console.log("CONNECTED ROOMS=>>", socket.adapter.rooms); // Number of users connected with different threads...
    } catch (e) {
      console.error("Error while leaving room", e);
    }
  });
  socket.on("readMessage", async ({ channelId, userId }) => {
    try {
      let updatedChannel = await Chat.updateMany(
        { channelID: channelId },
        { $addToSet: { readBy: [userId] } }
      );
      console.log(updatedChannel, channelId, userId);
    } catch (e) {
      console.error("Error while leaving room", e);
    }
  });
  socket.on("disconnect", () => {
    console.log("USER CONNECTED", user);
    user = user - 1;
  });
});

const router = require("./controllers/routes.js");
const Chat = require("./models/Chat");
app.use("/", router);
