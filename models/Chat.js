const mongoose = require("mongoose");
const ChatSchema = mongoose.Schema({
    userId: String,
    role: String,
    channelID: String,
    displayName: String,
    text: String,
    file: String,
    readBy: [String],
    otd: Boolean,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 365 * 7
    }, // expires 7 years
    sent: Number
});
module.exports = mongoose.model("Chat", ChatSchema);
