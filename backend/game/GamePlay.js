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
                player.disabled = true
                player.time = 0
                player.timeFormat = '0:00'
                player.percent = 0

            }
        })
        roomObject.totalPeopleWhoSubmittedChoice += 1
        console.log('Player Submitted choice!');
    }

    const playGame = ({code, playerName}) => {
        socket.join(code)
        let roomObject = roomArrayMap.get(code)
        roomObject.playerDetails.find(player => {
            if(player.name === playerName){
                if(player.realChoice > 0)
                    io.to(socket.id).emit('choice', player.choice)
                if(player.disabled === true)
                    io.to(socket.id).emit('disabled-status', player.disabled)
                const time = player.time
                const timeFormat = player.timeFormat
                const timePercent = player.percent 
                io.to(socket.id).emit('time-values', {time, timeFormat, timePercent})
            }
        })

        io.to(socket.id).emit('new-timer', roomObject.timer)
        io.to(socket.id).emit('pause-status', roomObject.paused)
    }

    const timeDetails = ({timeVal, timePercentValue, timeFormatValue, code, playerName }) => {
        let roomObject = roomArrayMap.get(code)
        roomObject.playerDetails.find(player => {
            if(player.name === playerName){
                player.time = timeVal
                player.timeFormat = timeFormatValue
                player.percent = timePercentValue
            }
        })
    }

    const hostTimeDetails = ({timeVal, timePercentValue, timeFormatValue, code }) => {
        let roomObject = roomArrayMap.get(code)
        roomObject.hostTime = timeVal
        roomObject.hostPercent = timePercentValue
        roomObject.hostTimeFormat = timeFormatValue
    }

    const pause = (code) => {
        io.in(code).emit('pause')
        console.log(code);
        roomArrayMap.get(code).paused = true
        roomArrayMap.get(code).disabled = true
        for(const player of roomArrayMap.get(code).playerDetails)
        {
            player.disabled = true
        }
    }

    const resume = (code) => {
        io.in(code).emit('resume')
        roomArrayMap.get(code).disabled = false
        roomArrayMap.get(code).paused = false
        for(const player of roomArrayMap.get(code).playerDetails)
        {
            player.disabled = false
        }
    }

    const playGameAsHost = (code) => {
        let roomObject = roomArrayMap.get(code)
        const time = roomObject.hostTime
        const timeFormat = roomObject.hostTimeFormat
        const timePercent = roomObject.hostPercent
        io.to(socket.id).emit('time-values', {time, timeFormat, timePercent})  
        io.to(socket.id).emit('new-timer', roomObject.timer)
        io.to(socket.id).emit('pause-status', roomObject.paused)
        io.to(socket.id).emit('player-values', roomObject.playerDetails)
        if(roomObject.totalPeopleWhoSubmittedChoice === roomObject.players.length)
        {
            roomObject.hostTime = 0
            roomObject.hostTimeFormat = '0:00'
            roomObject.hostPercent = 0
            io.to(socket.id).emit('stop-timer')
        }
    }

    socket.on('join-host', playGameAsHost)
    socket.on('resume', resume)
    socket.on('pause', pause)
    socket.on('player-time-details', timeDetails)
    socket.on('host-time-details', hostTimeDetails)
    socket.on('join-players', playGame)
    socket.on('toggle', toggleChoice)
    socket.on('submit', submitChoice)
}