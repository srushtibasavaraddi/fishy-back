const { roomArrayMap } = require("./GameVariables")

module.exports = (io, socket) => {
    const toggleChoice = ({num, playerName, code}) => {
        let roomObject = roomArrayMap.get(code)
        roomObject.playerDetails.find(player => {
            if(player.name === playerName){
                player.toggle = num
                player.choice = num
                player.realChoice = 0
            }
        })
    }

    const submitChoice = ({choice, playerName, code}) => {
        let roomObject = roomArrayMap.get(code)
        roomObject.playerDetails.find(player => {
            if(player.name === playerName){
                player.toggle = 0
                player.choice = choice
                player.realChoice = choice
            }
        })
        roomObject.time = 0
        roomObject.percent = 0
        roomObject.timeFormat = '0:00'
        console.log('Player Submitted choice!');
    }

    const playGame = ({code, playerName}) => {
        socket.join(code)
        let roomObject = roomArrayMap.get(code)
        roomObject.playerDetails.find(player => {
            if(player.name === playerName){
                if(player.realChoice > 0)
                    io.to(socket.id).emit('choice', player.choice)
            }
        })
        const time = roomObject.time
        const timeFormat = roomObject.timeFormat
        const timePercent = roomObject.percent
        io.to(socket.id).emit('time-values', {time, timeFormat, timePercent})
        io.to(socket.id).emit('new-timer', roomObject.timer)
        io.to(socket.id).emit('pause-status', roomObject.paused)
        io.to(socket.id).emit('disabled-status', roomObject.disabled)
    }

    const timeDetails = ({timeVal, timePercentValue, timeFormatValue, code }) => {
        let roomObject = roomArrayMap.get(code)
        roomObject.time = timeVal
        roomObject.percent = timePercentValue
        roomObject.timeFormat = timeFormatValue
    }

    const pause = (code) => {
        io.in(code).emit('pause')
        roomArrayMap.get(code).paused = true
        roomArrayMap.get(code).disabled = true
    }

    const resume = (code) => {
        io.in(code).emit('resume')
        roomArrayMap.get(code).disabled = false
        roomArrayMap.get(code).paused = false
    }

    socket.on('resume', resume)
    socket.on('pause', pause)
    socket.on('time-details', timeDetails)
    socket.on('join-players', playGame)
    socket.on('toggle', toggleChoice)
    socket.on('submit', submitChoice)
}