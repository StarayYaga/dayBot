const datesWRRD = require("./json.controller")
const config = require("../config")


module.exports = class DateController {
    constructor(){
        this.date = new Date()
        this.dateNow = this.date.toLocaleDateString()
        this.dates = new datesWRRD(config.dayConfigPath)
        this.data = []
        // this.dateNow = "13.05.2030"
    }
    check (){
        const dates = this.dates.getAllDates()
        for (let date of dates){
            const string = date.date.split('.')
            const day = string[0]
            const month = string[1]
            if (day  == this.dateNow.split(".")[0]){
                if (month  == this.dateNow.split(".")[1]){
                    this.data.push(date.text)
                    continue
                }
            }

            if (Number(day) - Number(this.dateNow.split(".")[0]) == 3){
                if (month  == this.dateNow.split(".")[1]){
                    this.data.push('Скоро '+date.event+"!\nОсталось 3 дня!")
                    continue
                }
            }
            if (Number(day) - Number(this.dateNow.split(".")[0]) == 1){
                if (month  == this.dateNow.split(".")[1]){
                    this.data.push('Скоро '+date.event+"!\nОстался один день!")
                }
            }
        }
        return this.data
    }
}

// function test (){
//     const date = new DateController()
//     console.log(date.check())
// }

// test()
