const express = require('express')

const app = express()
const colors = require('colors')
const cors = require('cors')

app.use(cors())
app.use(express.json())

const io = require('socket.io')(9000, {
    cors: {
      origin: ['http://localhost:3000'],
    },
  })

const GameSetup = require('./game/GameSetup')
const GamePlay = require('./game/GamePlay')
const GameScores = require('./game/GameScores')

const onConnection = (socket) => {
    GameSetup(io, socket)
    GamePlay(io, socket)
    GameScores(io, socket)
}

io.on('connection', onConnection)

const PORT = process.env.PORT || 5000;

const MODE = process.env.NODE_ENV || 'development'

app.get('/', (req, res) => {
  res.send('Hello World from the server!')
})

app.listen(
    PORT,
    console.log(
      `Server running on port ${PORT} in ${MODE.blue.bold + ' mode'.yellow.bold} `.yellow.bold
    )
  );
  