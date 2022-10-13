const mongoose = require("mongoose");

const {Schema} = mongoose;

const UsersSchema = new Schema({
    email: String,
    hash: String,
    salt: String,
    role: String,
    type: String,
    createdAt: Number,
    dealershipName: String,
    manufacturers: [String],
    name: String,
    zip: String,
    address: String,
    Dealership: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    },
    subuser: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Users'
        }
    ],
    bids: [String],
    googleId: String,
    facebookId: String,
    notificationsType: String,
    unreadLiveBids: [String],
    lastSeenMessages: {
        type: Object,
        default: {}
    }
});

module.exports = mongoose.model("Users", UsersSchema);
