// need offer model for data concerning members
const mongoose = require('mongoose')

const { Schema } = mongoose

const OfferSchema = new Schema({
  _id: Schema.Types.ObjectId,
  parentBidId: String,
  dealerId: String,
  members: [String],
  dealerName: String,
  dealershipId: String,
  biddedBy: String,
  price: String,
  address: String,
  isAccepted: Boolean,
  isClosed: Boolean,
})

module.exports = mongoose.model('Offer', OfferSchema)
