import React, {useState, useContext, useEffect} from 'react'
import Heading from '../../../components/Heading'
import Button from '../../../components/Button'
import Form from '../../../components/Form'
import FlashCard from '../../../components/Flashcard/Flashcard'
import { SocketContext } from '../../../context/SocketContext'
import { Link } from 'react-router-dom'
import Modal from '../../../components/Modal/Modal'
import Settings from '../Settings/Settings'
import Icons from '../../../components/Icons/Icons'
import Rules from '../../Rules/Rules'

const GenerateLink = () => {
    const socket = useContext(SocketContext)
    const [code, setCode] = useState('')
    const [settings, showSettings] = useState(false)
  const   [rules, showRules] = useState(false)
    useEffect(() => {
      sessionStorage.setItem('status',1)
    })

    const generateCode = () => {
      setCode(Math.floor(100000 + Math.random() * 900000))
    }

    const ClickHandler = () => {
      let room = code
      socket.emit('join', {room})
    };

    const ruleHandler = () => {
      showRules(!rules)
    }
  
    return (
      <div className = "flex flex-col h-screen">
        <div className = "flex justify-end items-center">
        <div className = "inline-block">
        <Button text = {'Settings'} display = {'bg-btn-bg-primary btn-lg mr-auto text-warning'} clickHandler = {() => showSettings(!settings)} />
        </div>
        <div className = "inline-block ml-auto mr-auto">
        <FlashCard text = {`Invite`} />
        </div>
        </div>
        
        {code? (
          
              <div className = "m-auto">
              <Heading display = {`text-center font-normal text-2xl mt-6 mb-5 inline-block`}
              text = {`Room code: ${code}`} />
              </div>
              ) : (
                
              <div className = "m-auto">
                <Button 
                display = {`bg-btn-bg-primary btn-lg m-5 text-warning inline-block`}
                clickHandler = {generateCode}
                text = 'Generate Game Code'
              />
              </div>)}
              <Form code = {code} />
          <div className="flex justify-around items-end h-full flex-row w-full">
              <div className = 'p-2'>
              <Icons icon = {`https://ik.imagekit.io/sjbtmukew5p/Fishy_Equilibrium/rules-list.png`} 
              title = {`Rules`}
              clickHandler = {ruleHandler}
              />
          </div>
          <div>
            
          </div>
          </div>
        
              {code?( 
              <Link
                to={{
                  pathname: `/lobby/${code}`,
                  aboutProps: {
                    value: { code },
                  },
                }}>
                <Button
                display = {'bg-btn-bg-primary text-warning btn-lg absolute bottom-5 right-5'}
                text = {'Next'}
                clickHandler = {ClickHandler}
                />
              </Link>
              ): (null)}
              {settings? <Modal>
                <Settings 
                showSettings = {() => showSettings(false)}
                />
              </Modal> : null}
              {rules ? 
              <Modal>
                <Rules 
                showRules = {() => showRules(false)} />
              </Modal> : null}   
        </div>

    )
}

export default GenerateLink
