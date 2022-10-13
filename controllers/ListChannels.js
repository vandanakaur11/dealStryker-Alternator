// get Channels

const Channel = require('.././models/Channel')
const User = require('.././models/User')
const Chat = require('../models/Chat')

module.exports = async (req, res) => {
  let email = req.params.email

  if (!req.params.email) {
    return res.sendStatus(422).json({
      errors: {
        email: 'is required',
      },
    })
  }

  let userInfo = await User.find({ email }).limit(1)
  //   console.log(userInfo[0]._id.toString());

  // let reqChannels = await Channel.find({
  //   members: {
  //     $in: userInfo[0]._id.toString(),
  //   },
  // }).sort({ lastActive: -1 });
  // let unreadMessage = await Chat.find({
  //   readBy: {
  //     $ne: userInfo[0]._id.toString(),
  //   },
  // }).sort({ lastActive: -1 });

  console.log('ID', userInfo[0]?._id?.toString())

  let data = await Channel.aggregate([
    {
      $match: {
        members: {
          $in: [userInfo[0]?._id?.toString()],
        },
      },
    },
    {
      $lookup: {
        from: 'offers',
        localField: 'offerRef',
        foreignField: '_id',
        as: 'offer',
      },
    },
    { $sort: { lastActive: -1 } },
    {
      $lookup: {
        from: 'chats',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              readBy: { $ne: userInfo[0]?._id?.toString() },
              $expr: {
                $and: [
                  {
                    $eq: [
                      { $toObjectId: '$channelID' },
                      { $toObjectId: '$$id' },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'unRead',
      },
    },
    {
      $addFields: { unRead: { $size: { $ifNull: ['$unRead', []] } } },
    },
  ]).exec()
  // console.log(reqChannels)
  res.send(data) // lastly show channels
}
