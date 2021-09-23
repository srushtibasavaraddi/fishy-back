const { roomArrayMap } = require("./GameVariables")

module.exports = (io,socket) => {
    const joinLobby = (gameCode) => {
        socket.join(gameCode)
        const roomObject = roomArrayMap.get(gameCode)
        io.in(gameCode).emit('players', roomObject.players)
    }

    const startGame = (gameCode) => {
        io.to(gameCode).emit('start')
    }

    socket.on('start-game', startGame)
    socket.on('join-lobby', joinLobby)
}