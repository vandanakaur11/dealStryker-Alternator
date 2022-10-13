// post user to be added to chat
const Channel = require(".././models/Channel");
const User = require(".././models/User");
const Offer = require(".././models/Offer");

module.exports = async (req, res) => {
    const {body: {
            user
        }} = req;

    let ChannelId = req.params.channelId; // example is /channelID123

    if (!user.email || !user.newUserId || !req.params.channelId) {
        return res.sendStatus(422).json({err: "Email, newUserId and Channel ID are all required."});
    }

    let email = user.email; // user that is requesting to add another user to chat
    let newUserId = user.newUserID;
    // user that will be added to chat


    // first send to see if current user is in the chat
    // if so then add new user

    let userInfo = await User.find({email: email}).limit(1); // find userID
    let ChannelDetails = await Channel.find({_id: ChannelId, members: userInfo._id}).limit(1);

    if (ChannelDetails === undefined) { // if true then no channel or no access

        res.json({Error: "no access"})

    } else {
        // if false then permission & channel exists

        // update channel
        let OfferID = ChannelDetails.offerReq; // find offerID
        let channelMembers = ChannelDetails.members; // members of the channel (Array)
        let newMembersArray = channelMembers.push(newUserId);

        Channel.findOneAndUpdate({
            _id: ChannelId
        }, {
            $set: {
                members: newMembersArray
            }
        }); // updates Channel's members

        Offer.findOneAndUpdate({
            _id: OfferID
        }, {
            $set: {
                members: newMembersArray
            }
        }); // updates Offer's members

        res.send("Success!");
    }

};
