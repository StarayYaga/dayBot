require('dotenv').config()

const env = process.env

module.exports = {
    "botKey": env.botToken,
    "masterAdminID": env.masterAdmin,
    "dayConfigPath": env.dayConfig,
    "adminIDPath": env.adminConfig,
    'chat_id': env.chatId,
    'timeOut': env.timeOut
}