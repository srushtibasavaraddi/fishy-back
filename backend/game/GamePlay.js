let {timer, bonusRoundArr} = require('./GameVariables')

module.exports = (io, socket) => {
    //Join the host room
    const hostGameRoom = () => {
        socket.join('Host')
        io.to('Host').emit('timer',timer)
    }

    //Join the player room
    const playerGameRoom = () => {
        socket.join('Players')
        io.to('Players').emit('timer',timer)
    }

    //Set the timer value
    const setGameTimer = (newTimerVal) => {
        console.log(newTimerVal)
        timer = newTimerVal
    }

    //Set the bonus rounds value
    const setBonusRounds = (bonusRoundString) => {
        console.log(bonusRoundString.current)
        bonusRoundArr = bonusRoundString
    }

    //Redirect the player to the results page
    const showOptions = () => {
        io.to('Players').emit('showChoices')
    }

    //The player joins the results room
    const newRoom = () => {
        socket.join('Results')
    }
    
    //Socket listeners
    socket.on('set-timer', setGameTimer)
    socket.on('game', hostGameRoom)
    socket.on('options', showOptions )
    socket.on('new-room', newRoom)
    socket.on('join-players', playerGameRoom)
    socket.on('set-bonus-round', setBonusRounds)
}