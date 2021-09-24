const { roomArrayMap } = require("./GameVariables")

module.exports = (io, socket) => {
    
    const viewOptions = (code) => {
        let roomObject = roomArrayMap.get(code)
        io.to(socket.id).emit('updated-players',roomObject.playerDetails)
    }

    socket.on('options', viewOptions)
}