const TelegramBot = require('node-telegram-bot-api');
const config = require('./config')
const jsonCtrl =require("./modules/json.controller")
const dateCtrl = require("./modules/date.controller")


function main(){
    const bot = new TelegramBot(config.botKey, {polling: true});
    const admins = new jsonCtrl(config.adminIDPath).getAllDates()
    const dates = new dateCtrl()
    const today = dates.check()
    for (let date of today){
       bot.sendMessage(config.chat_id, date)
    }

    bot.onText(/\/start/, msg=>{
        bot.sendMessage(msg.chat.id, "Привет.Я бот, который будет уведомлять тебя о событиях, которые ты мне добавишь(если сможешь).\nОсновные комнады:\n/id - получишь свой id. (он нужен админу)\n/admin - добавит возможность добавлять события (доступно только мастер админу)\n/add - добавит событие и будет следить за ним.")
    })

    bot.onText(/\/add/, (msg) => {
        if (admins.includes(String(msg.from.id)) == false){
            bot.sendMessage(msg.chat.id, "У тебя нет прав. Ты феминистка!")
            return 
        }

        const data = msg.text.split("\n")
        if (data[1]!= undefined){
            const rezult = {
                "date":data[1],
                "event": data[2],
                "text": data[3]
            }
            const date = new jsonCtrl(config.dayConfigPath)
            date.writeDates(rezult)
            bot.sendMessage(msg.chat.id, "Записано!")
        } else{
            bot.sendMessage(msg.chat.id, "Ты идиот? Тебе пояснить как надо писать? Ща поясню.Введите дату (xx.xx.xxxx), событие, подравление.\nПример:\n\n/add\n20.05.2000\nДР Козла\nС Днем Рождения, Козлина!")
        }
    });


    bot.onText(/\/admin/, (msg) => {
        if (msg.from.id != config.masterAdminID){
            bot.sendMessage(msg.chat.id, "У тебя нет прав. Ты феминистка!")
            return 
        }

        const id = msg.text.split(" ")[1]
        if (id!= undefined){
            const date = new jsonCtrl(config.adminIDPath)
            date.writeDates(id)
            bot.sendMessage(msg.chat.id, "Админ добавлен!")
        }else{
            bot.sendMessage(msg.chat.id, "Ну ты и тупой. Напиши так\n/admin id_члена")
        }
    });


    bot.onText(/\/id/, msg=>{
        bot.sendMessage(msg.chat.id, msg.from.id)
    })
}

main()

setInterval(main, config.timeOut)