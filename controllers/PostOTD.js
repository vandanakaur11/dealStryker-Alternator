// Add the Out The Door Request
const io = require('../socket.js').getio()
const Channel = require('.././models/Channel')
const User = require('.././models/User')
const Chat = require('.././models/Chat')

module.exports = async (req, res) => {
    const {body: {
            user
        }} = req

    let ChannelId = req.params && req.params.channelId

    if (!user.email || !user.name || !user.role || !user.otdPrice || !req.params.channelId) {
        return res.status(422).json({err: 'Email, Name, ChannelId, & isFile are all required.'})
    }

    let email = user.email
    let name = user.name
    let role = user.role
    let msg = user.otdPrice
    let vin = user.vin

    let users = await User.find({email: email}).limit(1)
    let userInfo = users[0]
    let realChannelCheck = await Channel.find({
        _id: ChannelId, members: userInfo._id, otdPost: false, // if true it will fail with the access check
    }).limit(1)

    if (realChannelCheck === undefined) { // not a real channel or have access!
        res.status(200).send({error: 'no access'})
    } else { // Real channel and they have access!

        var timezo = Math.floor(Date.now()) // time in milliseconds

        Channel.findOneAndUpdate({
            _id: ChannelId,   
        }, {
            $set: {
                otdPost: true,
                otdRequest: true, // even if it is already set to true, will make sure it stays true. - Reason is, it is easier to just overwrite it than making conditions for it. - Bradley
                lastActive: timezo
            }
        },)
        // updates Channel's lastActive value for "listChannel" requests

        // for normal chats
        const doc = new Chat({
            userId: userInfo._id,
            role: role,
            channelID: ChannelId,
            displayName: name,
            text: "<b>OTD Price:</b> <br>"+msg + "<br><b>Vin Number:</b><br> " + vin,
            sent: timezo,
            otd: true,
            readBy: [userInfo._id.toString()]
        })

        doc.save()

        // first see if user is valid, check email to user id, then see if they are invited to channel
        // if so then they can send message, also grab their display names

        io.to(ChannelId).emit('MESSAGES___', {
            userId: userInfo._id,
            role: role,
            channelID: ChannelId,
            displayName: name,
            text: "<b>OTD Price:</b> <br>"+msg + "<br><b>Vin Number:</b><br>\n " + vin,
            otd: true,
            sent: timezo,
            readBy: [userInfo._id.toString()]

        })
        
        res.status(200).send({success: true})

    }
}
