import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import FlashCard from "../../../components/Flashcard/Flashcard";
import Timer from "../../../components/Timer/Timer";
import { SocketContext } from "../../../context/SocketContext";
import Fish1and2 from "../../../images/Fish1and2.png";
import ShowOptions from "../ShowOptions/ShowOptions";
import DeckIcons from "../../..//components/DeckIcons/DeckIcons";

const Discussion = ({ players }) => {
  const roundNo = useParams();
  const code = sessionStorage.getItem('game-code')
  const timeP = useRef(120);
  const socket = useContext(SocketContext);
  const [time, setTime] = useState(120);
  const [timeFormat, setTimeFormat] = useState("0:00");
  const [timePercent, setTimePercent] = useState(0);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [mode, setMode] = useState(false)
  let timerID = useRef(null);

  const setTimer = useCallback(timeValue => {
    let timeFormatValue = ''
    if (timeValue >= 0) {
      const min = Math.floor(timeValue / 60);
      const second = Math.floor(timeValue % 60);
      let originalTime = timeP.current;
      const percent = 100 - ((originalTime - timeValue) / originalTime) * 100;
      if (second >= 0 && second <= 9) {
        timeFormatValue = (`${min}:0${second}`)
      } else {
        timeFormatValue = (`${min}:${second}`)
      }
      setTime(timeValue - 1);
      setTimePercent(percent);
      const timeVal = timeValue - 1
      const timePercentValue = percent
      socket.emit('host-time-details',{timeVal, timePercentValue, timeFormatValue, code})

    } else {
      clearInterval(timerID);
      setTime(0);
      setTimeFormat("0:00");
      const timeVal = 0, timePercentValue = 0, timeFormatValue = '0:00'
      socket.emit('host-time-details',{timeVal, timePercentValue, timeFormatValue, code})
    }
  }, [code, socket]);

  const countTime = useCallback(() => {
    if(!mode)
      timerID.current = setInterval(() => setTimer(time), 1000);
    else
      clearInterval(timerID.current)
  }, [time, setTimer, mode]);

  const pauseButton = () => {
    socket.emit('pause', sessionStorage.getItem('game-code'))
    setMode(true)
  }

  const resumeButton = () => {
    socket.emit('resume', sessionStorage.getItem('game-code'))
    setMode(false)
  }

  useEffect(() => {
    socket.emit("join-host", code);
    socket.on("toggled", playerData => {
      setPlayerInfo(playerData);
    });
    socket.on("chosen", playerData => {
      setPlayerInfo(playerData);
    });
    socket.on('time-values', ({time, timeFormat, timePercent}) => {
      setTime(time)
      setTimePercent(timePercent)
      setTimeFormat(timeFormat)
    })
    socket.on("stop-timer", () => {
      setTimeFormat("0:00");
      setTimePercent(0);
      setTime(0);
      setDisabled(false);
    });
    socket.on('new-timer', newTimer => timeP.current = newTimer)

    socket.on('pause-status', bool => setMode(bool))
    socket.on('player-values', players => setPlayerInfo(players))

    countTime();

    return () => {
      clearInterval(timerID.current);
    };
  }, [countTime, timerID, socket, time, code]);

  return (
    <div className="p-1 mt-1 flex flex-col justify-center items-center h-screen">
      <div className="md:w-96 xs-mobile:w-9/12">
        <FlashCard text={`Round ${roundNo.id}`} />
      </div>
      <Timer time={timeFormat} completed={timePercent} />
      
      <div className="flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
        {playerInfo && playerInfo.map(p => (
          <div className="yo p-2" key={Math.random()}>
            <FlashCard text={p.name} />
            <ShowOptions
              fishes={Fish1and2}
              choice={p.choice}
              toggle={p.toggle}
            />
          </div>
        ))}
      </div>
      <div className="results">
        {disabled ? (
          <button
            className="bg-btn-bg-primary p-3 text-warning btn-lg disabled:opacity-60 cursor-default"
            disabled
          >
            Results
          </button>
        ) : (
          <Link
            to={{
              pathname: `/host/results/${roundNo.id}`,
              state: {
                value: { playerInfo },
              },
            }}
          >
            <Button
              text={"Results"}
              display={"bg-btn-bg-primary p-3 bg-center text-warning btn-lg"}
            />
          </Link>
        )}
        {!mode?
      <Button
              text={"Pause"}
              display={"bg-btn-bg-primary p-3 bg-center text-warning btn-lg ml-5"}
              clickHandler = {pauseButton}
            />
      :
      <Button
              text={"Resume"}
              display={"bg-btn-bg-primary p-3 bg-center text-warning btn-lg ml-5"}
              clickHandler = {resumeButton}
            />
      }
      </div>
      
      <div className="flex items-end justify-between h-full w-full">
        <DeckIcons />
      </div>
    </div>
  );
};

export default Discussion;
