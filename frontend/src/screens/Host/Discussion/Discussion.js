import React, { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import Button from '../../../components/Button';
import FlashCard from '../../../components/Flashcard/Flashcard';
import Timer from '../../../components/Timer/Timer';
import { SocketContext } from '../../../context/SocketContext';
import Fish1and2 from "../../../images/Fish1and2.png";
import ShowOptions from '../ShowOptions/ShowOptions';
import DeckIcons from '../../..//components/DeckIcons/DeckIcons'

const Discussion = ({players}) => {
    const roundNo = useParams() 
    const timeP = useRef(120)
    const socket = useContext(SocketContext)
    const [timeC, setTimeC] = useState(false)
    const [time, setTime] = useState(120)
    const [timeFormat, setTimeFormat] = useState('0:00')
    const [timePercent, setTimePercent] = useState(0)
    const [playerInfo, setPlayerInfo] = useState(players)
    const [disabled, setDisabled] = useState(true)
    let timerID = useRef(null)

    const clickHandler = () => {
      socket.emit('skip-round')
    }
    
    const setTimer = useCallback((timeValue) => {
        if (timeValue >= 0) {
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
            sessionStorage.setItem('time', timeValue - 1)
            sessionStorage.setItem('percent', percent)
            setTimePercent(percent)
          } else {
            clearInterval(timerID);
            setTime(0)
            sessionStorage.setItem('time', 0)
            setTimeFormat('0:00')
            sessionStorage.setItem('time-format', '0:00')
          }
    }, [])

    const countTime = useCallback(() => {
        timerID.current = setInterval(() => setTimer(time), 1000);
    }, [time, setTimer]) 

    useEffect(() => {
      socket.emit('game')
      socket.on('toggled', playerData => {
        sessionStorage.setItem('player-option', JSON.stringify(playerData))
        setPlayerInfo(playerData)})
      socket.on('chosen', playerData => {
        sessionStorage.setItem('player-option', JSON.stringify(playerData))
        setPlayerInfo(playerData)})
      socket.on('stop-timer', () => {
        setTimeFormat('0:00')
        setTimePercent(0)
        setTime(0)
        sessionStorage.setItem('time', 0)
        sessionStorage.setItem('time-format', '0:00')
        sessionStorage.setItem('percent', 0)
        setDisabled(false)
      })
      if(sessionStorage.getItem('time')){
        setTime(sessionStorage.getItem('time'))
        if(sessionStorage.getItem('time-format')){
          setTimeFormat(sessionStorage.getItem('time-format'))
        }
        if(sessionStorage.getItem('percent')){
          setTimePercent(sessionStorage.getItem('percent'))
        }
        if(sessionStorage.getItem('timeC')){
          setTimeC(true)
        }
        if(sessionStorage.getItem('player-option')){
          setPlayerInfo(JSON.parse(sessionStorage.getItem('player-option')))
        }
      }
      socket.on('skipped', nextRoundNumber =>{ 
        sessionStorage.removeItem('time')
        sessionStorage.removeItem('time-format')
        sessionStorage.removeItem('percent')
        sessionStorage.removeItem('player-option')
        sessionStorage.removeItem('timeC')
        window.location.href = `/round/${nextRoundNumber}`})
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

    },[ countTime,  timerID, players, socket, timeC])
    
    

    return (
        <div className = "flex flex-col justify-center items-center">
            <FlashCard text = {`Round ${roundNo.id}`} />
                
            <Timer 
            time = {timeFormat}
            completed = {timePercent}
            />
            <div className = "flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center">
              {playerInfo.map(p => <div className = 'yo p-2' key = {Math.random()}>
                                    <FlashCard text = {p.playerName} />
                                    <ShowOptions
                                    fishes = {Fish1and2}
                                    choice = {p.choice}
                                    toggle = {p.toggle}
                                    />
                                    </div>)}
                
            </div>
            <div className="results">
            {disabled ? (
            <button className = "bg-btn-bg-primary p-3 text-warning btn-lg disabled:opacity-60 cursor-default" disabled>
              Results
            </button>) : 
            (  
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
              display = {'bg-btn-bg-primary p-3 text-warning btn-lg'}
            />
            </Link>
            )}
            <Button 
            text = {"Skip"}
            display = {'bg-btn-bg-primary p-3 text-warning btn-lg ml-5'}
            clickHandler = {clickHandler}
            />
          </div>
          <div className = 'flex items-end justify-between h-full w-full'>
            <DeckIcons />
          </div>
        </div>
    )
}

export default Discussion
