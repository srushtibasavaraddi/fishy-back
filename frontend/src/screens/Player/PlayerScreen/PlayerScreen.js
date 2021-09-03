import React, {useState, useEffect} from 'react'
import Button from '../../../components/Button'
import { Link } from 'react-router-dom'

const PlayerScreen = () => {
    const [inputCode, setInputCode] = useState('')
    const [playerName, setPlayerName] = useState('')

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
      sessionStorage.setItem('playerName', playerName)
    }

    return (
        <div className='bg-white shadow-lg rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <label
            htmlFor='Code'
            className='block text-gray-700 text-sm font-bold mb-2 px-3 py-3 '>
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
            className='block text-gray-700 text-sm font-bold mb-2 px-3 py-3'
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
        <br></br>
        <Link
                to={{
                  pathname: `/lobby/${inputCode}`,
                }}>
        <Button
          style={{ width: '150px' }}
          display={'btn btn-primary btn-lg'}
          text='Join'
          clickHandler = {enterGame}
        />
        </Link>
      </div>
    )
}

export default PlayerScreen
