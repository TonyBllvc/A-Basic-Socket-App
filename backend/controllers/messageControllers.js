const Message = require("../models/messageModel")
const User = require("../models/userModels")
const Chat = require("../models/chatModels")

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body

    if (!content || !chatId) {
        console.log('Invalid data passed into request')
        return res.sendStatus(400)
    }

    // take in data
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat_owner: chatId
    }

    try {        // parse data into data base first
        var message = await Message.create(newMessage)

        // add 'picture' after directly name
        // i.e. ('sender', 'name picture')
        messaging = await message.populate('sender', 'name')
        messaging = await message.populate('chat')
        messaging = await User.populate(message, {
            path: 'chat_owner.users',

            // add 'picture' after directly name
            // i.e. ('name picture email')
            select: 'name email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: messaging,
        })

        res.status(200).json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

module.exports = sendMessage