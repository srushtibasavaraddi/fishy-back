import React, { useContext, useState, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useParams } from "react-router";
import FlashCard from "../../components/Flashcard/Flashcard";
import Button from "../../components/Button";
import { Link } from "react-router-dom";

const Lobby = () => {
  const roomCode = useParams();
  const socket = useContext(SocketContext);
  const [players, setPlayers] = useState([]);
  let status = Number(sessionStorage.getItem("status"));
  const clickHandler = () => {
    let room = Number(roomCode.id);
    socket.emit("game-start", { room });
  };

  useEffect(() => {
    console.log(socket.id);
    let isMounted = true;
    console.log(status);
    if (isMounted) {
      if (status === 0) {
        let room = Number(roomCode.id);
        let playerName = sessionStorage.getItem("playerName");
        socket.emit("join", { playerName, room });
      }
      socket.on("players", playerData => {
        console.log("Hi");
        setPlayers(playerData);
        sessionStorage.setItem("players", JSON.stringify(playerData));
      });
      socket.on('error', ({message}) => {
        alert(message)
        window.location.href = '/game'
      })
      
      socket.on("Game-start", () => {
        sessionStorage.setItem("room", roomCode.id);
        window.location.href = "/round/1";
      });
    }

    return () => {
      isMounted = false;
      setPlayers([]);
    };
  }, [roomCode.id, socket, status]);

  return (
    <div className="flex flex-col items-center justify-center h-full pt-2">
      <div className="xs-mobile:ml-15">
        <FlashCard text={"Players"} />
      </div>
      <ul className="list-none inline-flex self-center">
        {players.map((player, index) => (
          <li key={index} className={"inline-block mt-4 p-4 xs-mobile:p-2"}>
            <FlashCard text={player.playerName} />
          </li>
        ))}
      </ul>
      {status === 1 ? (
        <Link
          to={{
            pathname: `/round/${1}`,
            state: {
              value: { players },
            },
          }}
        >
          <Button
            display={"bg-btn-bg-primary bg-center text-warning btn-lg"}
            text={"Start Game"}
            clickHandler={clickHandler}
          />
        </Link>
      ) : null}
    </div>
  );
};

export default Lobby;
