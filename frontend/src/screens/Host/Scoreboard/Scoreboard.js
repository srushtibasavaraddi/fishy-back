import React, { useState, useEffect, useContext } from 'react'
import FlashCard from '../../../components/Flashcard/Flashcard'
import './Scoreboard.css'
import Icons from '../../../components/Icons/Icons'
import Scores from '../../../components/Scores/Scores'
import { SocketContext } from '../../../context/SocketContext'
import Button from '../../../components/Button'
import {Link} from 'react-router-dom'

const Scoreboard = () => {
    const socket = useContext(SocketContext)
    const [show, setShow] = useState(false)
    const [scoreData, setScores] = useState([])
    const [playerData, setPlayers] = useState([])
    const clickHandler = () => {
        setShow(!show)
        socket.emit('set-visible')
    }

    useEffect(() => {
            socket.emit('show-scores')
            socket.emit('get-scores')
            socket.on('scores', ({scores, players }) => {
                setScores(scores)
                setPlayers(players)
            })
    },[socket])

    return (
        <div className = "flex flex-col justify-center items-center">
            <FlashCard text = {`Scores`} />
            <div className = "tables flex justify-center self-center xs-mobile:w-full md:w-5/6 ml-auto mr-auto">
                <div className = "show-hidden-table">
                <Icons
                    icon={
                    show
                    ? `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`
                    : `https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`
                    }
                    clickHandler = {clickHandler}
                />
                </div>
                
                {scoreData? 
                <Scores 
                show = {show}
                scores = {scoreData}
                players = {playerData}
                />
                :
                null}

            </div>
            <Link to = {{
                pathname: `/round/${scoreData.length + 1}`,
                state: {
                    value: { playerData },
                },
                }}>
            <Button  text = {'Next Round'} 
            display = {'bg-btn-bg-primary text-warning p-3 mt-2 btn-lg'}
            clickHandler = {() => socket.emit('next-round')}
            />
            </Link>
        </div>
    )
}

export default Scoreboard
