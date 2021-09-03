import React, { useContext, useState } from 'react'
import Icons from '../Icons/Icons'
import Modal from '../Modal/Modal'
import rules_4 from '../../images/rules-list-new.png'
import FlashCard from '../Flashcard/Flashcard'
import {SocketContext} from '../../context/SocketContext'
import Heading from  '../Heading'
import Button from '../Button'

const DeckIcons = () => {
    const socket = useContext(SocketContext)
    const [rules, showRules] = useState(false)
    const [quit, showQuit] = useState(false)
    const clickHandler = () => {
        showRules(true)
    }

    const quitGame = () => {
        showQuit(true)
    }

    const reallyQuitGame = () => {
        socket.emit('quitGame')
        sessionStorage.clear()
        localStorage.clear()
        window.location.href = '/game'
    }

     return (
        <div className = "flex justify-around flex-row w-full">
            <div className = 'p-2'>
            <Icons icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`} 
            title = {`Rules`}
            clickHandler = {clickHandler}
            />
            </div>
            <div className = 'p-2'>
            <Icons icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/cross.png`}
            title = {`Quit`}
            clickHandler = {quitGame}
            />
            </div>
            {rules?
            <Modal>
                <div className = "inline-flex justify-end w-full">
                <div className = "inline-block ml-auto mr-auto">
                <FlashCard text = {'Rules'} />
                </div>
                <div className = "inline-block">
                    <button onClick = {() => showRules(false)} className="text-light text-2xl hover:text-light">
                    &times;
                    </button>
                </div>
                </div>
                <div className = "self-center flex justify-center items-center ml-auto mr-auto">
                <img src = {rules_4}  alt = "rules" className = 'xs-mobile:h-full md:h-5/6 w-full' />
                </div>
            </Modal> : null}
            {quit?
            <Modal>
                <div className = "inline-flex justify-end w-full">
                <div className = "inline-block ml-auto mr-auto">
                <FlashCard text = {'Quit?'} />
                </div>
                <div className = "inline-block">
                    <button onClick = {() => showQuit(false)} className="text-light text-2xl hover:text-light">
                    &times;
                    </button>
                </div>
                </div>
                <div className = "self-center flex justify-center items-center flex-col ml-auto mr-auto">
                    <div>
                	<Heading text = {`Are you sure you want to quit the game?`} display = {`text-warning text-4xl font-bold`} />
                    </div>
                    <div>
                        <Button clickHandler = {reallyQuitGame} display = {'btn btn-primary btn-lg'} text = {'Quit'} />
                    </div>
                </div>
            </Modal> : null}
        </div>
    )
}

export default DeckIcons
