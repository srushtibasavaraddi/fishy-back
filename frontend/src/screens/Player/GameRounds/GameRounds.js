import React, {useState, useCallback, useEffect, useContext, useRef} from 'react'
import { useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import FishOptions from '../../../components/FishOptions/FishOptions';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Icons from '../../../components/Icons/Icons';
import Modal from '../../../components/Modal/Modal';
import Timer from '../../../components/Timer/Timer';
import { SocketContext } from '../../../context/SocketContext';
import Fish1 from "../../../images/Fish1-new.png";
import Fish2 from "../../../images/Fish2-new.png";
import './GameRounds.css'


const GameRounds = () => {
    let currentScore = useRef(0)
    let roundScore = useRef([])
    let timeP = useRef(120)
    const roundNo = useParams() 
    const socket = useContext(SocketContext)
    const [time, setTime] = useState(120)
    const [timeC, setTimeC] = useState(false)
    const scores = JSON.parse(sessionStorage.getItem('scores'))
    const players = JSON.parse(sessionStorage.getItem('player-with-scores'))
    const [timeFormat, setTimeFormat] = useState('0:00')
    const [timePercent, setTimePercent] = useState(0)
    const [choice, setChoice] = useState(1)
    const [disabled, setDisabled] = useState(false)
    const [active, setActive] = useState([false, false])
    const [score, showScore] = useState(false)
    let timerID = useRef(null)
    let playerName = sessionStorage.getItem('playerName')
    let code = Number(sessionStorage.getItem('room'))
    
    const setTimer = useCallback((timeValue) => {
        if (timeValue > 0) {
            const min = Math.floor(timeValue / 60);
            const second = Math.floor(timeValue % 60);
            let originalTime = timeP.current
            const percent =
              100 - ((originalTime - timeValue) / originalTime) * 100;
            if (second >= 0 && second <= 9) {
                setTimeFormat(`${min}:0${second}`)
            } else {
                setTimeFormat(`${min}:${second}`)
            }
            setTime(timeValue - 1)
            console.log(timeValue-1)
            console.log(percent)
            setTimePercent(percent)
          } else {
            clearInterval(timerID.current);
            setDisabled(true)
            setTime(0)
            choice === 1? setActive([true, false]) : setActive([false, true])
            socket.emit('choice', {choice, playerName})
            setTimeFormat('0:00')
          }
    }, [choice, playerName, socket])

    const countTime = useCallback(() => {
        
        timerID.current = setInterval(() => setTimer(time), 1000);
    }, [time, setTimer]) 

    useEffect(() => {
        socket.emit('join-players')
        socket.on('showChoices', () => {
            window.location.href = `/player/results/${roundNo.id}`
        })
        
        socket.on('quitGame', () => window.location.href = '/game')
        socket.on('skipped', nextRoundNumber => window.location.href = `/round/${nextRoundNumber}`)
        socket.once('timer', newTime => {
            if(!timeC){
                setTime(newTime)
                setTimeC(true)
                timeP.current = newTime
            }
        })
        countTime()
        return () => {
            clearInterval(timerID.current)
        }

    },[ countTime, socket, timerID, roundNo, playerName, timeC ])
    
    const selectChoice = (num) => {
        num === 1? setActive([true, false]) : setActive([false, true])
        setChoice(num)
        console.log(num);
        socket.emit('toggle', ({num, playerName, code}))
    }

    const submitChoice = (e) => {
        socket.emit('choice', {choice, playerName})
        clearInterval(timerID);
        setTime(0)
        setTimeFormat('0:00')
        setTimePercent(0)
        setDisabled(true)
        choice === 1? setActive([true, false]) : setActive([false, true])
    }

    const captureClick = () => {
        if(disabled){
            console.log(choice);
        }
        else{
            setActive([false, false])
        }
    }

    return (
        <div className = "p-1 mt-1 flex flex-col">
            <div className = "flex flex-col items-center justify-center flex-1 ">
                <FlashCard text = {`Round ${roundNo.id}`} />
                <Timer 
                time = {timeFormat}
                completed = {timePercent}
                />
            </div>
            <div className = "flex mt-2 md:flex-nowrap justify-center items-center overflow-y-hidden" onClickCapture = {() => captureClick()}>
                <div className = {`p-3`}>
                <FishOptions 
                fishes = {Fish1}
                active = {active[0]}
                SelectChoice = {disabled? null : selectChoice}
                id = {1}
                />
                </div>
                <div className = {`p-3`} >
                <FishOptions
                fishes = {Fish2}
                active = {active[1]}
                SelectChoice = {disabled? null : selectChoice}
                id = {2}
                />
                </div>
            </div>
            {disabled? 
            <button className = "text-warning bg-btn-bg-primary btn-lg w-25 self-center disabled:opacity-50 cursor-default" disabled>
                Submit
            </button> : 
            <Button 
            text = {'Submit'}
            clickHandler = {submitChoice}
            display = {'text-warning bg-btn-bg-primary btn-lg w-25 self-center'}
            />}
            <div className="absolute md:top-1/4 md:right-12 xs-mobile:top-20 xs-mobile:right-8">
                <Icons
                    icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
                    clickHandler={() => showScore(!score)}
                    title="Coins"
                />
                <p>{currentScore.current}</p>
            </div>
            {
                score?
                <Modal>
                    <div className = "inline-flex justify-end w-full">
                        <div className = "inline-block self-start mr-auto">
                            <img
                                src={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/coins.png`}
                                alt="coins"
                            />
                        <div className = "ml-auto mr-auto">
                        <p>{currentScore.current}</p>
                        </div>
                        </div>
                    </div>
                    <ul className = "scores">
                        <li className = "titles grid-display">
                            {roundScore.current.map((value, index) => {
                                return(
                                    <p key={index} className="grid-item">
                                        {`# ${index + 1}`}
                                    </p>
                                )
                            })}
                        </li>
                        <li className = "grid-display">
                            {
                                roundScore.current.map((value, index) => {
                                    return (
                                        <p key = {index} className = "grid-display-item">
                                            {value}
                                        </p>
                                    )
                                })
                            }
                        </li>
                    </ul>
                    <Icons
                        icon={`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
                        clickHandler={() => showScore(!score)}
                    />
                </Modal>
                :
                null
            }
        </div>
    )
}

export default GameRounds
