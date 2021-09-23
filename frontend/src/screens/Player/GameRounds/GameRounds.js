import React, {
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import Button from "../../../components/Button";
import DeckIcons from "../../../components/DeckIcons/DeckIcons";
import FishOptions from "../../../components/FishOptions/FishOptions";
import FlashCard from "../../../components/Flashcard/Flashcard";
import Icons from "../../../components/Icons/Icons";
import Modal from "../../../components/Modal/Modal";
import Timer from "../../../components/Timer/Timer";
import { SocketContext } from "../../../context/SocketContext";
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import "./GameRounds.css";

const GameRounds = ({players}) => {
  let timeP = useRef(120);
  const roundNo = useParams();
  let multiplier = useRef(0)
  const socket = useContext(SocketContext);
  const [time, setTime] = useState(120);
  const [timeC, setTimeC] = useState(false);
  const [timeFormat, setTimeFormat] = useState("0:00");
  const [timePercent, setTimePercent] = useState(0);
  const [choice, setChoice] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [active, setActive] = useState([false, false]);
  const [score, showScore] = useState(false);
  const [indivScore, setIndivScore] = useState([]);
  const [pause, setPause] = useState(false)
  let timerID = useRef(null);
  let playerName = sessionStorage.getItem("playerName");
  let code = Number(sessionStorage.getItem("room"));

  const setTimer = useCallback(
    timeValue => {
      if (timeValue > 0) {
        const min = Math.floor(timeValue / 60);
        const second = Math.floor(timeValue % 60);
        let originalTime = timeP.current;
        const percent = 100 - ((originalTime - timeValue) / originalTime) * 100;
        if (second >= 0 && second <= 9) {
          setTimeFormat(`${min}:0${second}`);
        } else {
          setTimeFormat(`${min}:${second}`);
        }
        setTime(timeValue - 1);
        sessionStorage.setItem("time", timeValue - 1);
        sessionStorage.setItem("percent", percent);
        setTimePercent(percent);
      } else {
        clearInterval(timerID.current);
        if (!disabled) {
          socket.emit("choice", { choice, playerName });
        }
        setDisabled(true);
        setTime(0);
        sessionStorage.setItem("time", 0);
        Number(choice) === 1
          ? setActive([true, false])
          : setActive([false, true]);
        Number(choice) === 1
          ? sessionStorage.setItem("active", JSON.stringify([true, false]))
          : sessionStorage.setItem("active", JSON.stringify([false, true]));
        sessionStorage.setItem("choice", choice);
        setTimeFormat("0:00");
        sessionStorage.setItem("time-format", "0:00");
      }
    },
    [choice, playerName, socket, disabled]
  );

  const countTime = useCallback(() => {
    if(!pause)
      timerID.current = setInterval(() => setTimer(time), 1000);
    else
      clearInterval(timerID.current)
  }, [time, setTimer, pause]);

  useEffect(() => {
    socket.emit("join-players");
    socket.on("showChoices", () => {
      window.location.href = `/player/results/${roundNo.id}`;
    });
    if (sessionStorage.getItem("time")) {
      setTime(sessionStorage.getItem("time"));
      if (sessionStorage.getItem("choice")) {
        setChoice(sessionStorage.getItem("choice"));
      }
      if (sessionStorage.getItem("time-format")) {
        setTimeFormat(sessionStorage.getItem("time-format"));
      }
      if (sessionStorage.getItem("timeC")) {
        setTimeC(true);
      }
      if (sessionStorage.getItem("active")) {
        setActive(JSON.parse(sessionStorage.getItem("active")));
      }
    }
    socket.on("quitGame", () => (window.location.href = "/game"));
    socket.once("timer", newTime => {
      if (!timeC) {
        setTime(newTime);
        setTimeC(true);
        sessionStorage.setItem("timeC", true);
        timeP.current = newTime;
      }
    });
    countTime();

    return () => {
      clearInterval(timerID.current);
    };
  }, [countTime, socket, timerID, roundNo, playerName, timeC, time]);

  useEffect(() => {
    socket.on("skipped", nextRoundNumber => {
      console.log(nextRoundNumber);
      sessionStorage.removeItem("choice");
      sessionStorage.removeItem("timeC");
      sessionStorage.removeItem("time-format");
      sessionStorage.removeItem("time");
      sessionStorage.removeItem("active");
      sessionStorage.removeItem("percent");
      if (sessionStorage.getItem("scores")) {
        let scores = JSON.parse(sessionStorage.getItem("scores"));
        scores.push([0, 0, 0, 0]);
        sessionStorage.setItem("scores", JSON.stringify(scores));
      } else {
        sessionStorage.setItem("scores", JSON.stringify([[0, 0, 0, 0]]));
      }
      window.location.href = `/player/scores`;
    });
    socket.on('pause', () => {
      setPause(true)
    })
    socket.on('resume', () => {
      setPause(false)
    })
  }, [socket, time]);

  useEffect(() => {
    if (
      sessionStorage.getItem("index") &&
      sessionStorage.getItem("indivScores") && sessionStorage.getItem('scores')
    ) {
      const scores = JSON.parse(sessionStorage.getItem("scores"));
      const indivScores = JSON.parse(sessionStorage.getItem("indivScores"));
      const playerIndex = JSON.parse(sessionStorage.getItem("index"));
      indivScores.push(scores[scores.length - 1][playerIndex]);
      setIndivScore(indivScores);
      sessionStorage.setItem("indivScores", JSON.stringify(indivScores));
    } else {
      let playerIndex = 0;
      for (let i = 0; i < players.length; i++) {
        if (players[i].playerName === playerName) {
          playerIndex = i;
          break;
        }
      }
      sessionStorage.setItem("index", JSON.stringify(playerIndex));
      sessionStorage.setItem("indivScores", JSON.stringify([]));
    }
  }, [playerName, players]);

  const selectChoice = num => {
    num === 1 ? setActive([true, false]) : setActive([false, true]);
    setChoice(num);
    console.log(num);
    socket.emit("toggle", { num, playerName, code });
  };

  const submitChoice = e => {
    socket.emit("choice", { choice, playerName });
    clearInterval(timerID);
    setTime(0);
    sessionStorage.setItem("time", 0);
    choice === 1
      ? sessionStorage.setItem("active", JSON.stringify([true, false]))
      : sessionStorage.setItem("active", JSON.stringify([false, true]));
    sessionStorage.setItem("choice", choice);
    sessionStorage.setItem("time-format", "0:00");
    sessionStorage.setItem("percent", 0);
    setTimeFormat("0:00");
    setTimePercent(0);
    setDisabled(true);
    Number(choice) === 1 ? setActive([true, false]) : setActive([false, true]);
  };

  const captureClick = () => {
    if (disabled) {
      console.log(choice);
    } else {
      setActive([false, false]);
    }
  };
  if(Number(roundNo.id) === 5){
    multiplier.current = 3
  }
  else if(Number(roundNo.id) === 8){
    multiplier.current = 5
  }
  else if(Number(roundNo.id) === 10){
    multiplier.current = 10
  }
  return (
    <div className="p-1 mt-1 flex flex-col h-screen game">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row md:w-96 xs-mobile:w-9/12">
          <FlashCard text={`Round ${roundNo.id}`} />
          {Number(roundNo.id) === 5 || Number(roundNo.id) === 8 || Number(roundNo.id) === 10? <p className='multiplier text-center p-2 w-16'>x {multiplier.current}</p> : null}
        </div>
        <Timer time={timeFormat} completed={timePercent} />
      </div>
      <div
        className="flex mt-2 md:flex-nowrap justify-center items-center overflow-y-hidden"
        onClickCapture={() => captureClick()}
      >
        <div className={`p-3`}>
          <FishOptions
            fishes={Fish1}
            active={active[0]}
            SelectChoice={disabled ? null : selectChoice}
            id={1}
          />
        </div>
        <div className={`p-3`}>
          <FishOptions
            fishes={Fish2}
            active={active[1]}
            SelectChoice={disabled ? null : selectChoice}
            id={2}
          />
        </div>
      </div>
      {disabled ? (
        <button
          className="text-warning bg-btn-bg-primary btn-lg bg-center w-25 self-center disabled:opacity-50 cursor-default"
          disabled
        >
          Submit
        </button>
      ) : (
        <Button
          text={"Submit"}
          clickHandler={submitChoice}
          display={
            "text-warning bg-btn-bg-primary bg-center btn-lg w-25 self-center"
          }
        />
      )}
      <div className="absolute md:top-1/4 md:right-12 xs-mobile:top-44 xs-mobile:right-8">
        <Icons
          icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
          clickHandler={() => showScore(!score)}
          title="Coins"
        />
        <p
          style={{
            color: `var(--btn-bg-secondary)`,
            textAlign: `center`,
            fontWeight: `700`,
          }}
        >
          {indivScore.reduce((acc, value) => {
            return acc + value;
          }, 0)}
        </p>
      </div>
      {score ? (
        <Modal>
          <div className="inline-flex justify-end w-full relative">
            <div className="inline-flex self-start mr-auto">
              <img
                src={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
                alt="coins"
              />
              <div className="self-end ml-1 mr-auto">
                <p style={{ color: `var(--primary-text)`, fontWeight: `500` }}>
                  {indivScore.reduce((acc, value) => {
                    return acc + value;
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
          <ul className="scores">
            <li className="titles grid-display">
              {indivScore.map((value, index) => {
                return (
                  <p key={index} className="grid-item">
                    {`# ${index + 1}`}
                  </p>
                );
              })}
            </li>
            <li className="grid-display">
              {indivScore.map((value, index) => {
                return (
                  <p key={index} className="grid-display-item">
                    {value}
                  </p>
                );
              })}
            </li>
          </ul>
          <div className="close-btn">
            <Icons
              icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
              title={"Quit"}
              clickHandler={() => showScore(!score)}
            />
          </div>
        </Modal>
      ) : null}
      <DeckIcons />
    </div>
  );
};

export default GameRounds;
