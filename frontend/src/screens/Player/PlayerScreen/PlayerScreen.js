import React, {useState, useEffect, useContext} from 'react'
import Button from '../../../components/Button'
import { Link } from 'react-router-dom'
import {SocketContext} from '../../../context/SocketContext'

const PlayerScreen = () => {
    const socket = useContext(SocketContext)
    const [inputCode, setInputCode] = useState('')
    const [playerName, setPlayerName] = useState('')
    const [code, correctCode] = useState(false)
    useEffect(() => {
      sessionStorage.setItem('status', 0)
    })

    const handlegameLink = (e) => {
        setInputCode(e.target.value)
    }

    const handleName = (e) => {
        setPlayerName(e.target.value)
    }

    const enterGame = () => {
      console.log('clicked');
      socket.emit('authenticate', inputCode)
      socket.on('authenticated', (value) => {
        console.log('Fire once');
        if(value === 1){
        window.location.href = `/lobby/${inputCode}`
        correctCode(true)}
      else{
        if(!code){
          alert('Wrong code')
          correctCode(true)
        }
      }})
      
      sessionStorage.setItem('playerName', playerName)
    }

    return (
        <div className='flex flex-col bg-card bg-no-repeat bg-cover bg-blend-screen rounded-none px-8 pt-6 pb-8 h-full'>
        <div className='mb-4'>
          <label
            htmlFor='Code'
            className='block text-yellow-500 text-sm font-bold mb-2 px-3 py-3 '>
            Room Code :
          </label>
          <input
            type='text'
            placeholder='Eg:12345'
            value={inputCode}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            onChange={(e) => handlegameLink(e)}
            required></input>
        </div>
  
        <div className='mb-6'>
          <label
            className='block text-yellow-500 text-sm font-bold mb-2 px-3 py-3'
            htmlFor='Code'>
            Player Name :
          </label>
          <input
            type='text'
            placeholder='Eg:David'
            value={playerName}
            onChange={(e) => handleName(e)}
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            required></input>
        </div>
        <div className = 'self-center'>
        <Button
          style={{ width: '150px' }}
          display={'bg-btn-primary text-warning border-2 border-yellow-500 rounded-xl btn-lg self-center'}
          text='Join'
          clickHandler = {enterGame}
        />
        </div>
      </div>
    )
}

export default PlayerScreen
