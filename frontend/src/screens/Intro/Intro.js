import React, { useState } from 'react'
import Heading from '../../components/Heading'
import HostScreen from '../Host/HostScreen/HostScreen';
import PlayerScreen from '../Player/PlayerScreen/PlayerScreen';
import HomeNavbar from '../../components/HomeNavBar/HomeNavbar';

const Intro = () => {
    const [screen, setScreen] = useState(1);

    const showPlayer = () => {
        setScreen(1);
      }
    
      const showHost = () => {
        setScreen(0);
      }

    return (
        <div className = "flex items-center justify-center">
            <div className = "m-auto">
                <Heading 
                text = {'Fishy Equilibrium'}
                display = {'text-4xl'} />
                <HomeNavbar 
                showPlayer = {showPlayer}
                showHost = {showHost}
                />
                {screen === 1? 
                (<PlayerScreen />):
                ( <HostScreen /> )}
            </div>
        </div>
    )
}

export default Intro
