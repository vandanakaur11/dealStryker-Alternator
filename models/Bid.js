const mongoose = require("mongoose");

const {Schema} = mongoose;

const BidSchema = new Schema({
    userId: String,
    name: String,
    manufacturer: String,
    car: String,
    color: String, // "model" - BJH
    model: String, // "trim" - BJH
    vehicleId: String, // No clue wth this is for - BJH
    year: Number,
    financing: String,
    distance: Number,
    zip: Number,
    responses: [String],
    isClosed: Boolean,
    createdAt: Number
});



module.exports = mongoose.model("Bid", BidSchema);
