let {
  players,
  roomSize,
  quitGameStatus,
  numberChosen,
  roundNumber,
  scores,
  MAX_ROUNDS,
  password,
} = require("./GameVariables");

module.exports = (io, socket) => {
  //Quit the game
  const quitGame = () => {
    players = [];
    quitGameStatus = true;
    scores = [[]];

    console.log(`Quitting game...`);

    players.length = 0;
    roundNumber = 1;
    numberChosen = 0;
    io.to("Players").emit("quitGame");
    io.to("Results").emit("quitGame");
  };

  //Join the room, allow only if less than 5 clients
  const joinRoom = ({ playerName, room }) => {
    if (io.sockets.adapter.rooms.get(room)) {
      roomSize = io.sockets.adapter.rooms.get(room).size;
    } else {
      roomSize = 0;
    }
    if (roomSize < 5) {
      socket.join(room);
      if (playerName) {
        players.push({
          playerName: playerName,
          choice: 0,
          toggle: 0,
          eye: false,
        });
      } else if (quitGameStatus === true) {
        players = [];
        password = password.filter(p => p !== room);
      } else {
        console.log(quitGameStatus);
      }
      io.in(room).emit("players", players);
      if (io.sockets.adapter.rooms.get(room).size === 1) {
        console.log(`The host has created the room!`);
        password.push(room);
      }
      console.log(io.sockets.adapter.rooms.get(room).size);
      quitGameStatus = false;
    } else {
      socket.emit("error", {
        message:
          "Max Players have joined, please wait till the next game starts.",
      });
    }
  };

  //Start the game(Host)
  const startGame = ({ room }) => {
    io.to(room).emit("Game-start");
  };

  const getScores = () => {
    let choices = [];
    choices[1] = 0;
    choices[2] = 0;
    let numberFish = [];
    numberFish[1] = 0;
    numberFish[2] = 0;

    for (const player of players) {
      if (Number(player.choice) === 1) {
        choices[1] += 1;
      } else if (Number(player.choice) === 2) {
        choices[2] += 1;
      }
    }
    if (choices[1] === 4 && choices[2] === 0) {
      numberFish[1] = 25;
      numberFish[2] = 0;
    } else if (choices[1] === 3 && choices[2] === 1) {
      numberFish[1] = 0;
      numberFish[2] = 75;
    } else if (choices[1] === 2 && choices[2] === 2) {
      numberFish[1] = -12.5;
      numberFish[2] = 50;
    } else if (choices[1] === 1 && choices[2] === 3) {
      numberFish[1] = -25;
      numberFish[2] = 25;
    } else if (choices[1] === 0 && choices[2] === 4) {
      numberFish[1] = 0;
      numberFish[2] = -25;
    }
    if (roundNumber === 5) {
      numberFish = numberFish.map(n => n * 3);
    } else if (roundNumber === 8) {
      numberFish = numberFish.map(n => n * 5);
    } else if (roundNumber === 10) {
      numberFish = numberFish.map(n => n * 10);
    }
    scores[roundNumber - 1] = [];
    for (const player of players) {
      player.score = numberFish[Number(player.choice)];
      scores[roundNumber - 1].push(player.score);
    }
    console.log(`Sending data!`);
    io.to(socket.id).emit("scores", { scores, players });
    setTimeout(() => {
      io.to("Scores").emit("scores", { scores, players });
      console.log(`Data sent to player`);
    }, 4000);
  };

  //Start the next round(Host)
  const nextRound = () => {
    for (const player of players) {
      player.choice = 0;
      player.toggle = 0;
      player.eye = false;
      player.score = 0;
    }
    roundNumber += 1;
    console.log(roundNumber);
    if (roundNumber < MAX_ROUNDS) {
      io.to("Scores").emit("new-round", roundNumber);
    } else {
      io.to("Host").emit("end-game");
      io.in("Scores").emit("end-game");
    }
  };

  //Reset the player object for the beginning of the next round
  const showScores = () => {
    for (const player of players) {
      player.choice = 0;
      player.toggle = 0;
      player.eye = false;
      player.score = 0;
    }
  };

  //Add the toggled fish to the player object
  const selectFish = ({ num, playerName, code }) => {
    players.find((player, i) => {
      if (player.playerName === playerName) {
        players[i] = {
          playerName: playerName,
          choice: num,
          toggle: num,
          eye: false,
        };
        return true; // stop searching
      }
    });
    console.log(players);
    io.to("Host").emit("toggled", players);
  };

  //Add the selected fish to the player object
  const addChoice = ({ choice, playerName }) => {
    console.log("Emit once");
    players.find((player, i) => {
      if (player.playerName === playerName) {
        players[i] = {
          playerName: playerName,
          choice: choice,
          toggle: 0,
          eye: false,
        };
        return true; // stop searching
      }
    });
    numberChosen += 1;
    console.log(numberChosen);
    if (numberChosen === players.length) {
      io.to("Host").emit("stop-timer");
      numberChosen = 0;
    }
    io.to("Host").emit("chosen", players);
  };

  //Show the results at the end of the round
  const openEye = playerName => {
    for (var i in players) {
      if (players[i].playerName === playerName) {
        players[i].eye = !players[i].eye;
        break; //Stop this loop, we found it!
      }
    }
    io.to(socket.id).emit("updated-players", players);
    io.to("Results").emit("updated-players", players);
  };

  //Skip a round
  const skipRound = () => {
    scores[roundNumber - 1] = [];
    let i = 0;
    while (i < players.length) {
      scores[roundNumber - 1].push(0);
      i++;
    }

    for (const player of players) {
      player.choice = 0;
      player.toggle = 0;
      player.eye = false;
      player.score = 0;
    }
    roundNumber += 1;
    if (roundNumber < MAX_ROUNDS) {
      io.to(socket.id).emit("skipped", roundNumber);
      console.log(roundNumber);

      io.to("Players").emit("skipped", roundNumber);
    } else {
      io.to(socket.id).emit("end-game");
      io.to("Players").emit("end-game");
    }
  };

  const authenticateRoomEntry = room => {
    if (password.includes(Number(room))) {
      console.log("Fire");
      io.to(socket.id).emit("authenticated", 1);
    } else {
      io.to(socket.id).emit("authenticated", 5);
      //io.to(socket.id).emit('authenticated', 0)
    }
  };
  //Socket listeners
  socket.on("skip-round", skipRound);
  socket.on("show", openEye);
  socket.on("choice", addChoice);
  socket.on("joined-scores", showScores);
  socket.on("next-round", nextRound);
  socket.on("quitGame", quitGame);
  socket.on("join", joinRoom);
  socket.on("game-start", startGame);
  socket.on("get-scores", getScores);
  socket.on("toggle", selectFish);
  socket.on("authenticate", authenticateRoomEntry);
};
