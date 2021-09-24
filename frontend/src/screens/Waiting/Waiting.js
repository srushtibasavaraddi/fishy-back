import React, { useContext, useEffect } from 'react'
import Button from '../../components/Button'
import FlashCard from '../../components/Flashcard/Flashcard'
import { SocketContext } from '../../context/SocketContext'

const Waiting = () => {
    const status = sessionStorage.getItem('status')
    const socket = useContext(SocketContext)

    useEffect(() => {
        socket.emit('join-game', sessionStorage.getItem('game-code'))
        socket.on('game-started', (roundNumber) => {
            status === 1?
            window.location.href = (`/round/${roundNumber}`)
            :
            window.location.href = (`/round/${roundNumber}`)
        })
    })
    
    const startGame = () => {
        if(status === '1')
            socket.emit('start-game', sessionStorage.getItem('game-code'))
        
    }

    return (
        <div className='flex flex-col items-center justify-center p-5'>
            {status === '1'?<FlashCard text = {'Select'} /> : <FlashCard text = {'Waiting for the host to start the round'} />}
            {status === '1'?
            <div className='flex flex-row pt-10'>
                <div>
                    <Button text = {'Start Round'} display = {'bg-btn-bg-primary text-warning p-4'} clickHandler = {startGame} />  
                </div>
                <div>
                    <Button text = {'Skip Round'} display = {'ml-5 bg-btn-bg-primary text-warning p-4'} />
                </div>
            </div>
            : 
            null
        }
        </div>
    )
}

export default Waiting
