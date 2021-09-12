import React, { useState, useEffect, useContext } from "react";
import FlashCard from "../../../components/Flashcard/Flashcard";
import "./Scoreboard.css";
import Scores from "../../../components/Scores/Scores";
import { SocketContext } from "../../../context/SocketContext";

const Scoreboard = () => {
  const socket = useContext(SocketContext);

  const [scoreData, setScores] = useState([]);
  const [playerData, setPlayers] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    socket.emit("join-scores");
    if (sessionStorage.getItem("curr-scores")) {
      setScores(JSON.parse(sessionStorage.getItem("curr-scores")));
      if (sessionStorage.getItem("curr-player-with-scores")) {
        setPlayers(
          JSON.parse(sessionStorage.getItem("curr-player-with-scores"))
        );
      }
      if (sessionStorage.getItem("show")) {
        setShow(JSON.parse(sessionStorage.getItem("show")));
      }
    }
    socket.on("scores", ({ scores, players }) => {
      console.log(scores, players);
      setScores(scores);
      setPlayers(players);
      sessionStorage.setItem("curr-scores", JSON.stringify(scores));
      sessionStorage.setItem("scores", JSON.stringify(scores));

      sessionStorage.getItem(
        "curr-player-with-scores",
        JSON.stringify(players)
      );
      sessionStorage.getItem("player-with-scores", JSON.stringify(players));
    });
    socket.on("set-visible", () => {
      setShow(!show);
      sessionStorage.setItem("show", JSON.stringify(!show));
    });
    socket.on("new-round", () => {
      sessionStorage.removeItem("time");
      sessionStorage.removeItem("choice");
      sessionStorage.removeItem("show");
      sessionStorage.removeItem("active");
      sessionStorage.removeItem("disabled");
      sessionStorage.removeItem("timeC");
      sessionStorage.removeItem("time-format");
      sessionStorage.removeItem("updated-players");
      sessionStorage.removeItem("curr-scores");
      sessionStorage.removeItem("curr-player-with-scores");

      window.location.href = `/round/${scoreData.length + 1}`;
    });
    socket.on("end-game", () => {
      sessionStorage.clear()
      
      window.location.href = `/gameover`});
  }, [socket, show, scoreData.length]);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Scores`} />
      </div>
      <div className="tables flex flex-row justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto overflow-y-auto">
        {scoreData ? (
          <Scores show={show} scores={scoreData} players={playerData} />
        ) : null}
      </div>
    </div>
  );
};

export default Scoreboard;
