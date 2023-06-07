const {writeFileSync, readFileSync, existsSync, promises} = require('fs')
const util = require('util');
const config = require("../config")

class dayConfig {
    path= ''

    constructor(pathOf){
        this.path = String(pathOf)
        const exis = existsSync(this.path)
        if (!exis){
            writeFileSync(this.path, "[]")
            console.log("Config created!");
        }
    }

    getAllDates(){
        const data = readFileSync(this.path, {encoding:"utf-8"}, "binary")
        // if (data == []){
        //     return 100
        // }
        return JSON.parse(data)
    }

    writeDates(data){
        const read = JSON.parse(readFileSync(this.path, {encoding:"utf-8"}, "binary"))
        read.push(data)
        const write = writeFileSync(this.path, JSON.stringify(read))
    }
}

module.exports = dayConfig