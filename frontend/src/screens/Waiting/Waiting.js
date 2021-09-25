import React, { useContext, useEffect, useState } from 'react'
import Button from '../../components/Button'
import FlashCard from '../../components/Flashcard/Flashcard'
import { SocketContext } from '../../context/SocketContext'

const Waiting = () => {
    const status = sessionStorage.getItem('status')
    const socket = useContext(SocketContext)
    const [roundNo, setRoundNo] = useState(0)
    useEffect(() => {
        socket.emit('join-game', sessionStorage.getItem('game-code'))
        socket.on('next-round-started', (roundNumber) => {
            window.location.href = (`/round/${roundNumber}`)
        })
        socket.on('round-number', roundNumber => setRoundNo(roundNumber))
        socket.on('message', ({message}) => alert(message))
        socket.on('game-over', () => window.location.href = '/gameover')
    }, [socket])
    
    const startGame = () => {
        socket.emit('start-next-round', sessionStorage.getItem('game-code'))
    }

    const endGame = () => {
        socket.emit('game-over', sessionStorage.getItem('game-code'))
        window.location.href = '/gameover'
    }

    const skipGameRound = () => {
        socket.emit('skip-round', sessionStorage.getItem('game-code'))
        socket.on('skipped-round-number', roundNumber => setRoundNo(roundNumber))
    }

    return (
        <div className='flex flex-col items-center justify-center p-5'>
            <div>
            {status === '1'?<FlashCard text = {'Select'} /> : <FlashCard text = {'Waiting for the host to start the round'} />}
            </div>
            {status === '1'?
            roundNo < 11?
            <div className='flex flex-row pt-10'>
                <div>
                    <Button text = {`Start Round ${roundNo}`} display = {'bg-btn-bg-primary text-warning p-4'} clickHandler = {startGame} />  
                </div>
                <div>
                    <Button text = {`Skip Round ${roundNo}`} display = {'ml-5 bg-btn-bg-primary text-warning p-4'} clickHandler = {skipGameRound} />
                </div>
            </div>
             : 
             <Button text = {`End Game`} display = {'bg-btn-bg-primary text-warning p-4'} clickHandler = {endGame} />
            : 
            null
        }
        </div>
    )
}

export default Waiting
