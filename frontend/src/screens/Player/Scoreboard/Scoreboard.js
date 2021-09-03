import React, { useState, useEffect, useContext } from 'react'
import FlashCard from '../../../components/Flashcard/Flashcard'
import './Scoreboard.css'
import Scores from '../../../components/Scores/Scores'
import { SocketContext } from '../../../context/SocketContext'

const Scoreboard = () => {
    const socket = useContext(SocketContext)
    
    const [scoreData, setScores] = useState([])
    const [playerData, setPlayers] = useState([])
    const [show, setShow] = useState(false)

    useEffect(() => {
        socket.emit('join-scores')
        socket.on('scores', ({scores, players}) => {
            console.log(scores, players);
            setScores(scores)
            setPlayers(players)
            sessionStorage.setItem('scores', JSON.stringify(scores))
            sessionStorage.getItem('player-with-scores', JSON.stringify(players))
        })
        socket.on('set-visible', () => {
            setShow(!show)
        })
        socket.on('new-round', () => window.location.href = `/round/${scoreData.length + 1}`)
        socket.on('end-game', () => window.location.href = `/gameover`)
    }, [socket, show, scoreData.length])
    return (
        <div className = "flex flex-col justify-center items-center">
            <FlashCard text = {`Scores`} />
            <div className = "tables flex flex-row justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto">
                
                {scoreData? 
                <Scores 
                show = {show}
                scores = {scoreData}
                players = {playerData}
                />
                :
                null}

            </div>
        </div>
    )
}

export default Scoreboard
