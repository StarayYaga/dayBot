const TelegramBot = require('node-telegram-bot-api');
const config = require('./config')
const jsonCtrl =require("./modules/json.controller")
const dateCtrl = require("./modules/date.controller")


class Main{
    constructor(){
        this.bot = new TelegramBot(config.botKey, {polling: true});
        this.admins = new jsonCtrl(config.adminIDPath).getAllDates()
        this.today = new dateCtrl().check()
        console.log("start");
        this.check()
    }

    check(){
        this.today = new dateCtrl().check()
        for (let date of this.today){
            this.bot.sendMessage(config.chat_id, date)
        }
    }
    main(){
        this.bot.onText(/\/start/, msg=>{
            this.bot.sendMessage(msg.chat.id, "Привет.Я бот, который будет уведомлять тебя о событиях, которые ты мне добавишь(если сможешь).\nОсновные комнады:\n/id - получишь свой id. (он нужен админу)\n/admin - добавит возможность добавлять события (доступно только мастер админу)\n/add - добавит событие и будет следить за ним.\n/check - покажит ближайшие события (в радиусе 2 дней)")
        })
    
        this.bot.onText(/\/add/, (msg) => {
            if (this.admins.includes(String(msg.from.id)) == false){
                this.bot.sendMessage(msg.chat.id, "У тебя нет прав. Ты феминистка!")
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
                this.bot.sendMessage(msg.chat.id, "Записано!")
                this.check()
            } else{
                this.bot.sendMessage(msg.chat.id, "Ты идиот? Тебе пояснить как надо писать? Ща поясню.Введите дату (xx.xx.xxxx), событие, подравление.\nПример:\n\n/add\n20.05.2000\nДР Козла\nС Днем Рождения, Козлина!")
            }
        });
    
    
        this.bot.onText(/\/admin/, (msg) => {
            if (msg.from.id != config.masterAdminID){
                this.bot.sendMessage(msg.chat.id, "У тебя нет прав. Ты феминистка!")
                return 
            }
    
            const id = msg.text.split(" ")[1]
            if (id!= undefined){
                const date = new jsonCtrl(config.adminIDPath)
                date.writeDates(id)
                this.bot.sendMessage(msg.chat.id, "Админ добавлен!")
                this.admins.push(id)
            }else{
                this.bot.sendMessage(msg.chat.id, "Ну ты и тупой. Напиши так\n/admin id_члена")
            }
        });
    
    
        this.bot.onText(/\/id/, msg=>{
            this.bot.sendMessage(msg.chat.id, msg.from.id)
        })
        this.bot.onText(/\/check/, msg=>{
            if (this.admins.includes(String(msg.from.id)) == false){
                this.bot.sendMessage(msg.chat.id, "У тебя нет прав. Ты феминистка!")
                return 
            }
            this.check()
        })
        
    }

}

function main(){
    const startBot = new Main()
    startBot.main()
}
main()
setInterval(main, 43200000)
