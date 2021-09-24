const { roomArrayMap, PassWord } = require("./GameVariables");

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();


module.exports = (io, socket) => {
  
    const joinSettings = () => {
        
        let gameCode = genRanHex(6)
        while(PassWord.includes(gameCode))
        {
            gameCode = genRanHex(6)
        }
        PassWord.push(gameCode)
        roomArrayMap.set(gameCode , {
            players : [],
            timer : 120,
            playerDetails : [],
            paused : false,
            hostDisabled : false,
            roundNumber : 1,
            hostTime : 120,
            hosTimeFormat : '0:00',
            hostPercent : 0,
            totalPeopleWhoSubmittedChoice : 0

        })
        io.to(socket.id).emit('code', gameCode)
        console.log('The Host has created the game!');
    }

    const refreshHandler = () => {
        let gameCode = genRanHex(6)
        while(PassWord.includes(gameCode))
        {
            gameCode = genRanHex(6)
        }
        roomArrayMap.set(gameCode , {
            players : [],
            timer : 120,
            playerDetails : [],
            paused : false,
            hostDisabled : false,
            roundNumber : 1,
            hostTime : 120,
            hosTimeFormat : '0:00',
            hostPercent : 0,
            totalPeopleWhoSubmittedChoice : 0
        })
        io.to(socket.id).emit('refresh-code', gameCode)
    }

    const setTimer = ({timer, gameCode}) => {
        console.log(gameCode);
        console.log(timer);
        let roomObject = roomArrayMap.get(gameCode)
        roomObject.timer = timer
        roomObject.hostTime = timer
    }

    const authenticate = ({inputCode, playerName}) => {
        if(roomArrayMap.get(inputCode))
        {
            let roomObject = roomArrayMap.get(inputCode)
            if(roomObject.players.includes(playerName)){
                io.to(socket.id).emit('change', {message : 'This player already exists. Please Enter with a different name'})
            }
            else{
                roomObject.players.push(playerName)
                roomObject.playerDetails.push({
                    name : playerName,
                    toggle : 0,
                    choice : 0,
                    realChoice : 0,
                    disabled : false,
                    time : 120,
                    timeFormat : '0:00',
                    timePercent : 0
                })
                io.to(socket.id).emit('authenticated', 1)
            }
        }
        else
            io.to(socket.id).emit('authenticated', 0)
    }

    socket.on('authenticate', authenticate)
    socket.on('set-timer', setTimer)
    socket.on('settings', joinSettings)
    socket.on('refresh', refreshHandler)
}