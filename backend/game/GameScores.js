module.exports = (io, socket) => {
    //Join the room 'Scores' to see the scores of other teams
    const joinScores = () => {
        socket.join('Scores')
    }
    

    //Redirect the player to the scores page
    const showScorePage = () => {
        io.to('Results').emit('come-to-scores')
    }

    //Set the Round total to be visible
    const setVisible = () => {
        io.to('Scores').emit('set-visible')
    }
    
    //Socket event listeners
    socket.on('join-scores', joinScores)
    socket.on('show-scores', showScorePage)
    socket.on('set-visible', setVisible)
}