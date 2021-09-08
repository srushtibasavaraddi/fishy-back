import React, {useState, useContext, useEffect, useRef} from 'react'
import FlashCard from '../../../components/Flashcard/Flashcard'
import ShowOptions from '../ShowOptions/ShowOptions'
import Fish1 from "../../../images/Fish1-new.png"
import Fish2 from "../../../images/Fish2-new.png"
import Icons from '../../../components/Icons/Icons'
import './RevealScores.css'
import { SocketContext } from '../../../context/SocketContext'
import Button from '../../../components/Button'
import { Link, useParams } from 'react-router-dom'
import DeckIcons from '../../../components/DeckIcons/DeckIcons'

const RevealScores = (props) => {
    const roundNo = useParams()
    const socket = useContext(SocketContext)
    let playerData = useRef([])
    
    if(Number(sessionStorage.getItem('status')) === 1){
        playerData.current = props.location.state.value.playerInfo
        sessionStorage.setItem('player-data', JSON.stringify(playerData.current))
    }
    const [players, setPlayers] = useState(playerData.current)

    const clickHandler = (playerName) => {
        console.log(playerData.current, 'hi');
        console.log(playerName);
        socket.emit('show', playerName)
    }

    useEffect(() => {
        if(sessionStorage.getItem('update-players')){
            console.log(JSON.parse(sessionStorage.getItem('update-players')));
            setPlayers(JSON.parse(sessionStorage.getItem('update-players')))
        }
        socket.emit('options', Number(sessionStorage.getItem('room')))
        socket.on('updated-players', updatedPlayers => {
            setPlayers(updatedPlayers)
            console.log(updatedPlayers);
            sessionStorage.setItem('update-players', JSON.stringify(updatedPlayers))
        })
    }, [socket])

    return (
        <div className = "flex flex-col items-center justify-center">
            <FlashCard text = {`Round ${roundNo.id}`} />
            <div className = 'flex mt-2 xs-mobile:flex-wrap md:flex-nowrap justify-center items-center'>
                {
                    players.map(
                        (player, index) =>{
                        if(player.eye){

                        return(
                        <div className = "inner-div flex flex-col md:p-1" key = {index}>
                            <div className = "xs-mobile:w-4/6 mobile:w-full w-full self-center ml-auto mr-auto">
                            <FlashCard text = {player.playerName} />
                            </div>
                            {player.eye?
                            <div key = {index} className = "">
                                <Icons
                                icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-new.png`}
                                title = {'Show'}
                                clickHandler = {() => clickHandler(player.playerName)}
                                />
                            </div>
                            :
                            <div key = {index} className = "">
                                <Icons
                                icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
                                title = {'Hide'}
                                clickHandler = {() => clickHandler(player.playerName)}
                                />
                            </div>}
                            {Number(player.choice) === 1?
                            
                            <div className = "xs-mobile:ml-auto xs-mobile:mr-auto mt-5">
                            <ShowOptions fishes = {Fish1} />
                            </div>:
                            <div className = "xs-mobile:ml-auto xs-mobile:mr-auto mt-5">
                            <ShowOptions fishes = {Fish2} />
                            </div>
                            }
                        </div>
                        )}
                        else{
                            return (
                                <div key={index} className="inner-div flex flex-col md:p-1">
                                    <div>
                                      <FlashCard text={player.playerName} />
                                      <Icons 
                                      icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/eye-off-new.png`}
                                      clickHandler = {() => clickHandler(player.playerName)}
                                      />
                                      </div>
                                      <div className = "mt-5 xs-mobile:ml-auto xs-mobile:mr-auto">
                                      <ShowOptions />
                                      </div>
                                    </div>
                            )
                        }
                    }
                )
                
            }
            </div>
            <Link to = '/host/scores'>
            <Button 
            text = {'Scores'}
            display = {'text-warning bg-btn-bg-primary btn-lg'}
            />
            </Link>
            
          <div className = 'flex items-end justify-between h-full w-full mt-4 xs-mobile:mt-5'>
            <DeckIcons />
          </div>
        </div>
    )
}

export default RevealScores
