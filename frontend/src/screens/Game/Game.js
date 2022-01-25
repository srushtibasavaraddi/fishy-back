import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router'
import { SocketContext } from '../../context/SocketContext'
import Discussion from '../Host/Discussion/Discussion'
import GameRounds from '../Player/GameRounds/GameRounds'

const Game = (props) => {
    let status = Number(sessionStorage.getItem('status'))
    const history = useHistory();
    const socket = useContext(SocketContext)
    let players = JSON.parse(sessionStorage.getItem('players'))
    console.log(status);
    useEffect(() => {
        socket.on('end-game', () => {
            window.location.href = '/gameover'
            history.push("/gameover");
        })
    })
    
    return (
        <div>
        {
        status === 1?
        (<Discussion players = {players}/>)
        :
        (<GameRounds players = {players}/>)
        }
        </div>
    )
}

export default Game
