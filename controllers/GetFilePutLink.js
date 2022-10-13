// get link to send to AWS
const Channel = require('../models/Channel')
const User = require('../models/User')
const config = require('config')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: config.get('s3AccessKey'),
  secretAccessKey: config.get('s3SecretKey'),
})

module.exports = async (req, res) => {
  const {
    body: { user },
  } = req

  let ChannelId = req?.params?.channelId || false
  console.log('REQ BODU', user)
  if (
    !user.email ||
    !user.channel ||
    !user.fileName ||
    !ChannelId ||
    !user.contentType
  ) {
    return res.status(400).json({
      err:
        'Email, Channel, fileName, channelId & contentType are all required.',
    })
  }

  let email = user.email
  let FileName = user.fileName
  let contentType = user.contentType
  let users = await User.find({ email: email }).limit(1)
  let userInfo = users[0]
  let realChannelCheck = await Channel.find({
    _id: ChannelId,
    members: userInfo._id,
  }).limit(1)

  if (realChannelCheck === undefined) {
    // not a real channel or have access!
    res.json({ Error: 'no access' })
  } else {
    // Real channel and they have access!

    var timezo = Math.floor(Date.now() / 1000) // time in milliseconds

    Channel.findOneAndUpdate(
      { _id: ChannelId },
      { $set: { lastActive: timezo } },
    ) // updates Channel's lastActive value for "listChannel" requests

    var key = ChannelId + '-' + userInfo._id + '-' + timezo + '-' + FileName
    s3.getSignedUrl(
      'putObject',
      { Bucket: 'happyducks', ContentType: contentType, Key: key },
      (err, url) => {
        s3.getSignedUrl(
          'getObject',
          { Bucket: 'happyducks', Key: key, Expires: 604800 },
          (err, data) => {
            console.log('ERR', err)
            res.send({ PutUrl: url, data })
          },
        )
      },
    )
  }
}
