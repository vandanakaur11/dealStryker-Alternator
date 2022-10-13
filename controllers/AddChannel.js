const Channel = require(".././models/Channel");
const Offer = require(".././models/Offer");
const User = require(".././models/User");
const Bid = require(".././models/Bid");
var mongoose = require("mongoose");

module.exports = async (req, res) => {
    const {body: {
            user
        }} = req;

    let offerID = user.offerId;
    let email = user.email;
    let name = user.name;

    console.log(user);

    // check if email (potential buyer) is connected with Offer
    // if so then create the channel and respond with the id

    let userInfo = await User.find({email}).limit(1);

    var stri = offerID;
    var mongoObjectId0 = mongoose.Types.ObjectId(stri);

    let offerInfo = await Offer.find({_id: mongoObjectId0}).limit(1);
    // console.log(offerInfo);
    let BidInfo = await Bid.find({_id: offerInfo[0].parentBidId}).limit(1);

    if (offerInfo[0] == "" || offerInfo[0] == undefined) {
        console.log("CHCEKCING THE OFFER INFO", offerInfo);
        res.send("err");
    } else { // make channel
        Channel.findOne({offerRef: offerInfo[0].id}).then((channel) => {
            if (channel && Object.keys(channel).length) {
                console.log("ALREADY FOUND");
                res.send("success!");
            } else {
                var timezo = Math.floor(Date.now());
                console.log("CHCEKCING THE OFFER INFO", offerInfo);
                let Members = offerInfo[0].members;

                // offerInfo: String,
                // requestInfo: String,

                Members.push(userInfo[0]._id);
                // add the potential buyer

                // color manufacturer year car model - BJH
                var requestVehicleString = BidInfo[0] ?. color + " " + BidInfo[0] ?. manufacturer + " " + BidInfo[0] ?. year + " " + BidInfo[0] ?. car + " " + BidInfo[0] ?. model;

                const doc = new Channel({
                    offerRef: offerInfo[0]._id,
                    buyerName: BidInfo[0] ?. name,
                    dealerName: offerInfo[0].dealerName,
                    members: Members,
                    lastActive: timezo,
                    offerInfo: offerInfo[0].price, // will be displayed to channel info
                    requestInfo: requestVehicleString, // will be displayed to channel info
                    otdPost: false,
                    otdRequest: false
                });

                doc.save();
                res.send("success!");
            }
        });
    }
};
